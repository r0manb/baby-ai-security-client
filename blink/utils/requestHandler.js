import "../assets/libs/axios/axios.min.js";
import { authRoute } from "./apiRoutes.js"

const $request = axios.create({
    withCredentials: true,
});

$request.interceptors.request.use(async (config) => {
    const { token } = await chrome.storage.local.get(['token']);
    config.headers.Authorization = `Bearer ${token}`;

    return config;
});

$request.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const { data } = await axios.post(`${authRoute}/refresh`, {}, { withCredentials: true });
            chrome.storage.local.set({
                token: data.token
            });

            return $request.request(originalRequest);
        } catch (e) { }
    }

    throw { error };
})

export default $request;
class EventEmitter {
    on(eventName, cb) {
        this["_on" + eventName] = cb;
    }
    emit(eventName, args) {
        this['_on' + eventName] && this['_on' + eventName](args);
    }
}

export default new EventEmitter();
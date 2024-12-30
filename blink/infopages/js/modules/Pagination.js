class Pagination {
    constructor(totalPages, maxPagesVisible, currentPage = 1) {
        this.totalPages = totalPages;
        this.maxPagesVisible = maxPagesVisible;
        this.currentPage = currentPage;

        this.pages = this.#pageNumbers(
            this.totalPages,
            this.maxPagesVisible,
            this.currentPage
        );
        this.currentPageBtn = null;
        this.buttons = new Map();

        this.disabled = {
            start: () => this.pages[0] === 1,
            end: () => this.pages.slice(-1)[0] === this.totalPages,
        }

        this.paginationContainer = document.createElement('div');
        this.paginationContainer.className = 'pagination';

        this.buttons.set(
            this.#createAndSetupButton(
                'Начало',
                'pagination__item start',
                this.disabled.start(),
                () => this.currentPage = 1
            ),
            (btn) => btn.disabled = this.disabled.start()
        )

        this.pages.map((pageNumber, index) => {
            const isCurrentPage = this.currentPage === pageNumber;
            const button = this.#createAndSetupButton(
                pageNumber,
                isCurrentPage ? 'active' : '',
                false,
                this.#onPageButtonClick
            );

            if (isCurrentPage) {
                this.currentPageBtn = button;
            }

            this.buttons.set(button, this.#onPageButtonUpdate(index));
        });

        this.buttons.set(
            this.#createAndSetupButton(
                'Конец',
                'pagination__item end',
                this.disabled.end(),
                () => this.currentPage = this.totalPages
            ),
            (btn) => btn.disabled = this.disabled.end()
        )

        this.buttons.forEach((_, btn) => this.paginationContainer.appendChild(btn));
    }

    #pageNumbers = (totalPages, maxPagesVisible, currentPage) => {
        const half = Math.floor(maxPagesVisible / 2);
        let to = maxPagesVisible;

        if (currentPage + half >= totalPages) {
            to = totalPages;
        } else if (currentPage > half) {
            to = currentPage + half;
        }

        let from = Math.max(to - maxPagesVisible, 0);

        return Array.from(
            {
                length: Math.min(totalPages, maxPagesVisible)
            },
            (_, i) => (i + 1) + from
        );
    }

    #createAndSetupButton = (label = '', cls = '', disabled = false, handleClick) => {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = label;
        buttonElement.className = `pagination__item ${cls}`;
        buttonElement.disabled = disabled;
        buttonElement.addEventListener('click', e => {
            handleClick(e);
            this.#update();
            this.paginationContainer.value = this.currentPage;
            this.paginationContainer.dispatchEvent(new CustomEvent('change', { detail: { currentPageBtn: this.currentPageBtn } }));
        });

        return buttonElement;
    }

    #onPageButtonClick = e => this.currentPage = Number(e.currentTarget.textContent);

    #onPageButtonUpdate = index => (btn) => {
        btn.textContent = this.pages[index];

        if (this.pages[index] === this.currentPage) {
            this.currentPageBtn.classList.remove('active');
            btn.classList.add('active');
            this.currentPageBtn = btn;
            this.currentPageBtn.focus();
        }
    }

    #update = () => {
        this.pages = this.#pageNumbers(
            this.totalPages,
            this.maxPagesVisible,
            this.currentPage
        );
        this.buttons.forEach((updateButton, btn) => updateButton(btn));
    }

    setTotalPages = (totalPages) => this.totalPages = totalPages;

    onChange = (hander) => {
        this.paginationContainer.addEventListener('change', hander)
    }

    render = (container) => {
        container.appendChild(this.paginationContainer);
    }

}

export default Pagination;
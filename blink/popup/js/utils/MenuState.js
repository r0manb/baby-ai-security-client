class MenuState{
    constructor(){
        this.canOpen = false
    }

    setCanOpen = (bool) => this.canOpen = bool;

    closeMenu() {
        $('.header__burger').removeClass('active');
        $('.menu').removeClass('active');
    }
}

export default new MenuState();
class MenuState{
    constructor(){
        this.canOpen = false
    }

    closeMenu() {
        $('.header__burger').removeClass('active');
        $('.menu').removeClass('active');
    }
}

export default new MenuState();
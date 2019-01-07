export class NavBar {
    constructor(dom_body, dom_content) {
        this.dom_span_array = [];
        this.list = [
            "playlist 1",
            "playlist 2",
            "playlist 3"
        ];
        this.dom_root = dom_body;
        this.dom_content = dom_content;
        this.dom_divNavBar = document.createElement('div');
        this.dom_divNavBar.classList.add("NavBarDiv");
        this.dom_root.appendChild(this.dom_divNavBar);
        this.dom_divNavBarToggle = document.createElement('div');
        this.dom_divNavBarToggle.classList.add("NavBarDivToggle");
        this.dom_divNavBar.appendChild(this.dom_divNavBarToggle);
        this.dom_divNavBarToggle.addEventListener('click', () => {
            this.toggleNavBar();
            this.moveBurgerButton();
            this.changeColorOfSpan();
        });
        for (let i = 0; i < 3; i++) {
            this.dom_span_array[i] = document.createElement('span');
            this.dom_span_array[i].classList.add("NavBarSpan");
            this.dom_divNavBarToggle.appendChild(this.dom_span_array[i]);
        }
        this.dom_UList = document.createElement('ul');
        this.dom_UList.classList.add("NavBarUL");
        this.dom_divNavBar.appendChild(this.dom_UList);
        for (let i = 0; i < this.list.length; i++) {
            this.dom_ListElement = document.createElement('li');
            this.dom_ListElement.classList.add("NavBarListElement");
            this.dom_UList.appendChild(this.dom_ListElement);
        }
        this.setNamesofPlaylists();
    }
    setNamesofPlaylists() {
        let n = this.dom_UList.childNodes.length;
        for (let i = 0; i < n; i++) {
            this.dom_UList.childNodes.item(i).textContent = this.list[i];
        }
    }
    toggleNavBar() {
        this.dom_divNavBar.classList.toggle('active');
    }
    moveBurgerButton() {
        this.dom_divNavBarToggle.classList.toggle("active");
    }
    changeColorOfSpan() {
        this.dom_span_array.forEach((elem) => {
            elem.classList.toggle('active');
        });
    }
    close() {
        this.dom_content.remove();
    }
}
//# sourceMappingURL=NavBar.js.map
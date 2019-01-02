
export class Header {
    private dom_root: HTMLElement;
    private dom_header: HTMLElement;

    constructor(dom: HTMLElement) {
        this.dom_root = dom;
        this.dom_header = document.createElement('header');
        this.dom_root.appendChild(this.dom_header);
        this.set('');

        const dom_about_contact_imp_container = document.createElement('div');
        this.dom_root.appendChild(dom_about_contact_imp_container);
        dom_about_contact_imp_container.setAttribute("id", "InformationContainer");
    }

    set(text: string) {
        this.dom_header.textContent = `Music Playlist ${text}`;
    }

}
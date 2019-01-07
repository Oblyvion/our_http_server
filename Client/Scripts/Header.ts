import {manager} from "./app.js";

export class Header {
    private dom_root: HTMLElement;
    private dom_header: HTMLElement;
    private dom_content: HTMLElement;
    private dom_about_contact_imp_container;
    private dom_about: HTMLElement;
    private dom_contact: HTMLElement;
    private dom_imp: HTMLElement;

    constructor(dom_body: HTMLElement, dom_content: HTMLElement) {
        this.dom_root = dom_body;
        this.dom_content = dom_content;
        this.dom_header = document.createElement('header');
        this.dom_root.appendChild(this.dom_header);
        this.set('');

        this.dom_about_contact_imp_container = document.createElement('div');
        this.dom_root.appendChild(this.dom_about_contact_imp_container);
        this.dom_about_contact_imp_container.setAttribute("id", "InformationContainer");

        this.dom_about = document.createElement('a');
        this.dom_about.textContent = "About";
        this.dom_about.classList.add('LinkHeader');
        this.dom_about.setAttribute('href', '#');
        this.dom_about.addEventListener('click', () => {
            this.close();
            new manager("about");
        });
        this.dom_about_contact_imp_container.appendChild(this.dom_about);

        this.dom_contact = document.createElement('a');
        this.dom_contact.textContent = "Contact";
        this.dom_contact.classList.add('LinkHeader');
        this.dom_contact.setAttribute('href', '#');
        this.dom_contact.addEventListener('click', () => {
            this.close();
            new manager("contact");
        });
        this.dom_about_contact_imp_container.appendChild(this.dom_contact);

        this.dom_imp = document.createElement('a');
        this.dom_imp.textContent = "Impressum";
        this.dom_imp.classList.add('LinkHeader');
        this.dom_imp.setAttribute('href', '#');
        this.dom_imp.addEventListener('click', () => {
            this.close();
            new manager("impressum");
        });
        this.dom_about_contact_imp_container.appendChild(this.dom_imp);
    }

    set(text: string) {
        this.dom_header.textContent = `Music Playlist ${text}`;
    }

    close() {
        this.dom_content.remove();
    }
}
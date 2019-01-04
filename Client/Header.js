export class Header {
    constructor(dom) {
        this.dom_root = dom;
        this.dom_header = document.createElement('header');
        this.dom_root.appendChild(this.dom_header);
        this.set('');
        this.dom_about_contact_imp_container = document.createElement('div');
        this.dom_root.appendChild(this.dom_about_contact_imp_container);
        this.dom_about_contact_imp_container.setAttribute("id", "InformationContainer");
        // const about = document.createElement('a');
        // about.textContent = "About";
        // about.classList.add('LinkHeader');
        // about.setAttribute('href', '#');
        // about.addEventListener('click', () => {
        //     this.close();
        //     new manager("page_about");
        // });
        // this.dom_about_contact_imp_container.appendChild(about);
        //
        // const contact = document.createElement('a');
        // contact.textContent = "Contact";
        // contact.classList.add('LinkHeader');
        // contact.setAttribute('href', '#');
        // contact.addEventListener('click', () => {
        //     this.close();
        //     new manager("page_contact");
        // });
        // this.dom_about_contact_imp_container.appendChild(contact);
        //
        // const impressum = document.createElement('a');
        // impressum.textContent = "Impressum";
        // impressum.classList.add('LinkHeader');
        // impressum.setAttribute('href', '#');
        // impressum.addEventListener('click', () => {
        //     this.close();
        //     new manager("page_impressum");
        // });
        // this.dom_about_contact_imp_container.appendChild(impressum);
    }
    set(text) {
        this.dom_header.textContent = `Music Playlist ${text}`;
    }
    close() {
        this.dom_root.remove();
    }
}
//# sourceMappingURL=Header.js.map
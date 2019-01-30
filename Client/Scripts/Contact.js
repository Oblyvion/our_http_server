/**
 * @class Contact
 * Repräsentiert die Contact Seite.
 */
export class Contact {
    /**
     * @constructor Contact
     * Konstruiert die Contact Seite, indem alle Elemente erzeugt und appended werden.
     * @param {HTMLElement} dom - Ort des Inhalts der Page
     *
     *
     */
    constructor(dom) {
        this.dom_root = document.getElementById('app');
        this.dom_Contact = dom;
        this.dom_Contact.classList.add('ContentContact');
        this.dom_root.appendChild(this.dom_Contact);
        const dom_ContactsInformationContainer = document.createElement('div');
        dom_ContactsInformationContainer.classList.add('ContactInformationContainer');
        this.dom_Contact.appendChild(dom_ContactsInformationContainer);
        const dom_ContactInformationHeader = document.createElement('div');
        dom_ContactInformationHeader.classList.add('ContactInformationHeader');
        dom_ContactsInformationContainer.appendChild(dom_ContactInformationHeader);
        dom_ContactInformationHeader.textContent = "If you have any questions or wishes please inform us via E-Mail";
        const dom_ContactInformation = document.createElement('div');
        dom_ContactInformation.classList.add('ContactInformation');
        dom_ContactsInformationContainer.appendChild(dom_ContactInformation);
        dom_ContactInformation.textContent = "info@music-playlist.com";
    }
    /**
     * @function close()
     *
     * Entfernt den Content bzw die einzelnen Dom Elemente werden removed
     *
     */
    close() {
        this.dom_Contact.classList.remove("ContentContact");
        while (this.dom_Contact.firstChild) {
            this.dom_Contact.removeChild(this.dom_Contact.firstChild);
        }
        this.dom_Contact.remove();
    }
}
//# sourceMappingURL=Contact.js.map
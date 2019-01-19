export class Contact {
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
    close() {
        while (this.dom_Contact.firstChild) {
            this.dom_Contact.removeChild(this.dom_Contact.firstChild);
        }
    }
}
//# sourceMappingURL=Contact.js.map
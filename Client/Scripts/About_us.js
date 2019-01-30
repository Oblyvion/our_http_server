/**
 * @class About_us
 * Repräsentiert die About us Seite.
 *
 *
 */
export class About_us {
    /**
     * @constructor About_us
     * Konstruiert die About us Seite, indem alle Elemente erzeugt und appended werden.
     * @param {HTMLElement} dom - Ort des Inhalts der Page
     *
     *
     */
    constructor(dom) {
        this.dom_root = document.getElementById('app');
        this.dom_AboutUs = dom;
        this.dom_AboutUs.classList.add('ContentAboutUs');
        this.dom_root.appendChild(this.dom_AboutUs);
        const dom_AboutUsInformation = document.createElement('div');
        dom_AboutUsInformation.classList.add('AboutUsInformation');
        this.dom_AboutUs.appendChild(dom_AboutUsInformation);
        const dom_AboutUsInformationHeader = document.createElement('div');
        dom_AboutUsInformationHeader.classList.add('AboutUsInformationHeader');
        dom_AboutUsInformation.appendChild(dom_AboutUsInformationHeader);
        dom_AboutUsInformationHeader.textContent = "Project Music Playlist";
        const dom_AboutUsInformationText = document.createElement('div');
        dom_AboutUsInformationText.classList.add('AboutUsInformationText');
        dom_AboutUsInformation.appendChild(dom_AboutUsInformationText);
        dom_AboutUsInformationText.textContent = "This project has been developed and designed by Julian Fess and Franz-Johannes Weber.\r\n" +
            "We are students of the \"University of Applied Sciences\" in Worms and created this WebApp for private use only.";
    }
    /**
     * @function close()
     *
     * Entfernt den Content bzw die einzelnen Dom Elemente werden removed
     *
     */
    close() {
        this.dom_AboutUs.classList.remove("ContentAboutUs");
        while (this.dom_AboutUs.firstChild) {
            this.dom_AboutUs.removeChild(this.dom_AboutUs.firstChild);
        }
        this.dom_AboutUs.remove();
    }
}
//# sourceMappingURL=About_us.js.map
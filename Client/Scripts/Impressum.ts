/**
 * @class Impressum
 * Repräsentiert die Impressum Seite.
 */
export class Impressum {
    private dom_root: HTMLElement;
    private dom_Impressum: HTMLElement;

    /**
     * @constructor Impressum
     * Konstruiert die Impressum Seite, indem alle Elemente erzeugt und appended werden.
     * @param {HTMLElement} dom - Ort des Inhalts der Page
     *
     *
     */
    constructor(dom: HTMLElement) {
        this.dom_root = document.getElementById('app');

        this.dom_Impressum = dom;
        this.dom_Impressum.classList.add('ContentImpressum');
        this.dom_root.appendChild(this.dom_Impressum);

        const dom_ImpressumInformationContainer = document.createElement('div');
        dom_ImpressumInformationContainer.classList.add('ImpressumInformationContainer');
        this.dom_Impressum.appendChild(dom_ImpressumInformationContainer);

        const dom_ImpressumInformation1 = document.createElement('div');
        dom_ImpressumInformation1.classList.add('ImpressumInformation');
        dom_ImpressumInformationContainer.appendChild(dom_ImpressumInformation1);
        dom_ImpressumInformation1.textContent = "Julian Fess\r\nJohann-Sebastian-Bach-Str. 10\r\nGrünstadt";

        const dom_ImpressumInformation2 = document.createElement('div');
        dom_ImpressumInformation2.classList.add('ImpressumInformation');
        dom_ImpressumInformationContainer.appendChild(dom_ImpressumInformation2);
        dom_ImpressumInformation2.textContent = "Franz-Johannes Weber\r\nFriedrich-Ebert-Str. 72\r\nWörrstadt";

    }

    /**
     * @function close()
     *
     * Entfernt den Content bzw die einzelnen Dom Elemente werden removed
     *
     */
    close() {
        this.dom_Impressum.classList.remove("ContentImpressum");
        while (this.dom_Impressum.firstChild) {
            this.dom_Impressum.removeChild(this.dom_Impressum.firstChild);
        }
        this.dom_Impressum.remove();
    }
}
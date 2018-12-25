export class Header {
    constructor(dom) {
        this.dom_root = dom;
        this.dom_header = document.createElement('header');
        this.dom_root.appendChild(this.dom_header);
        this.set('');
    }
    set(text) {
        this.dom_header.textContent = `Music Playlist ${text}`;
    }
}
//# sourceMappingURL=Header.js.map
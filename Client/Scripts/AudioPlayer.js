export class AudioPlayer {
    constructor(dom) {
        this.dom_root = dom;
        this.dom = document.createElement('div');
        this.dom.classList.add('AudioPlayerContainer');
        this.dom_root.appendChild(this.dom);
        this.dom_logo = document.createElement('div');
        this.dom_logo.classList.add('AudioPlayerLogo');
        this.dom.appendChild(this.dom_logo);
    }
}
//# sourceMappingURL=AudioPlayer.js.map
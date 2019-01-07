import { AudioPlayer } from "./AudioPlayer.js";
export class FirstSteps {
    constructor(dom) {
        this.dom_root = document.getElementById('app');
        const dom_content = document.createElement('div');
        dom_content.classList.add('ContentAboutUs');
        const audioPlayer = new AudioPlayer(dom_content);
        this.dom_root.appendChild(dom_content);
    }
}
//# sourceMappingURL=FirstSteps.js.map
import {AudioPlayer} from "./AudioPlayer.js"
import {NavBar} from "./NavBar.js";

export class About_us {
    private dom_root: HTMLElement;

    constructor(dom: HTMLElement) {
        this.dom_root = document.getElementById('app');

        const dom_content = document.createElement('div');
        dom_content.classList.add('ContentAboutUs');
        const audioPlayer = new AudioPlayer(dom_content);
        this.dom_root.appendChild(dom_content);
        const navBar = new NavBar(this.dom_root, dom_content)


    }

}
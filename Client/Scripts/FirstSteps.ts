import {AudioPlayer} from "./AudioPlayer.js"
import {manager} from "./app.js";
import {NavBar} from "./NavBar.js";
import {PlaylistTable} from "./PlaylistTable.js";
import {Login} from "./Login";

const API_URL = 'http://localhost:3000';

export class FirstSteps {
    private dom_root: HTMLElement;
    private dom_content: HTMLElement;
    private audioPlayer: AudioPlayer;
    private navBar: NavBar;

    constructor(dom: HTMLElement) {

        this.dom_root = document.getElementById('app');

        this.dom_content = dom;
        this.dom_content.classList.add('FirstSteps');
        this.audioPlayer = new AudioPlayer(this.dom_content);
        console.log("FirstSteps.ts, constructor: HALLO PLEASE");
        this.navBar = new NavBar(this.dom_root, this.dom_content);
        this.dom_root.appendChild(this.dom_content);


    }

    close() {
        this.dom_content.classList.remove("FirstSteps");
        while (this.dom_content.firstChild) {
            this.dom_content.removeChild(this.dom_content.firstChild);
        }
        this.audioPlayer.close();
        this.navBar.close();

    }
}
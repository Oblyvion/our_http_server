import {AudioPlayer} from "./AudioPlayer.js"
import {manager} from "./app.js";
import {NavBar} from "./NavBar.js";
import {PlaylistTable} from "./PlaylistTable.js";

export class FirstSteps {
    private dom_root: HTMLElement;
    private dom_content: HTMLElement;
    private audioPlayer: AudioPlayer;
    private navBar: NavBar;
    private playlistTable: PlaylistTable;

    constructor(dom: HTMLElement) {
        this.dom_root = document.getElementById('app');

        this.dom_content = dom;
        this.dom_content.classList.add('FirstSteps');
        this.audioPlayer = new AudioPlayer(this.dom_content);
        this.navBar = new NavBar(this.dom_root, this.dom_content);
        this.playlistTable = new PlaylistTable(this.dom_root, this.dom_content, this.audioPlayer);
        this.dom_root.appendChild(this.dom_content);


    }

    close() {
        this.dom_content.remove();
        this.audioPlayer.close();
        this.navBar.close();
        this.playlistTable.close();

    }
}
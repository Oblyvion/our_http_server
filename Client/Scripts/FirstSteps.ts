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
    private playlistTable: PlaylistTable;
    private Playlists;

    constructor(dom: HTMLElement) {
        this.Playlists = this.getPlaylists();
        console.log("das ist playlists: "+this.Playlists.length);

        this.dom_root = document.getElementById('app');

        this.dom_content = dom;
        this.dom_content.classList.add('FirstSteps');
        this.audioPlayer = new AudioPlayer(this.dom_content);
        this.navBar = new NavBar(this.dom_root, this.dom_content, this.Playlists);
        this.playlistTable = new PlaylistTable(this.dom_root, this.dom_content, this.audioPlayer);
        this.dom_root.appendChild(this.dom_content);


    }

    async getPlaylists() {
        try {
            // console.log(`das ist body name: ${this.dom_loginInputID.value}`);
            // console.log(`das ist body pw: ${password.toString()}`);
            console.log("hallo hier local storageeeeee "+localStorage.getItem("token"));
            const playlists = await fetch(API_URL + "/playlists/", {
                cache: 'no-cache',
                headers: {
                    'content-type': 'application/javascript',
                    'crossDomain': 'true',
                    'Authorization': localStorage.getItem("token")
                },
                method: 'GET',
                mode: 'cors',
                // todo REST POST redirect
                // redirect: 'follow',
                // credentials: 'include',
            });

            const result = await playlists.json();

            return result;
        }
        catch(err) {
            console.log("Error is passiert!")
        }
    }

    close() {
        this.dom_content.remove();
        this.audioPlayer.close();
        this.navBar.close();
        this.playlistTable.close();

    }
}
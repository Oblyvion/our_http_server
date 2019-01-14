import { AudioPlayer } from "./AudioPlayer.js";
import { NavBar } from "./NavBar.js";
import { PlaylistTable } from "./PlaylistTable.js";
const API_URL = 'http://localhost:3000';
export class FirstSteps {
    constructor(dom) {
        this.Playlists = this.getPlaylists();
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
            const playlists = await fetch(API_URL + "/playlists/", {
                cache: 'no-cache',
                headers: {
                    'content-type': 'application/javascript',
                    'crossDomain': 'true'
                },
                method: 'GET',
                mode: 'cors',
            });
            const result = await playlists.json();
            return result;
        }
        catch (err) {
            console.log("Error is passiert!");
        }
    }
    close() {
        this.dom_content.remove();
        this.audioPlayer.close();
        this.navBar.close();
        this.playlistTable.close();
    }
}
//# sourceMappingURL=FirstSteps.js.map
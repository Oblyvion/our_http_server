import { AudioPlayer } from "./AudioPlayer.js";
import { NavBar } from "./NavBar.js";
import { PlaylistTable } from "./PlaylistTable.js";
export class FirstSteps {
    constructor(dom) {
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
//# sourceMappingURL=FirstSteps.js.map
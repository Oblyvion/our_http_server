import { AudioPlayer } from "./AudioPlayer.js";
import { NavBar } from "./NavBar.js";
/**
 * @class FirstSteps
 * Baut den ersten Grundrahmen der Application auf, hier gibt es erstmals eine Playlist Navigation Bar und auch einen Musikplayer
 * der jedoch erst nach einem Klick auf Playlists dazu in der Lage ist Musik abzuspielen, da noch nicht klar ist welche Playlist gehört werden soll.
 */
export class FirstSteps {
    /**
     * @constructor FirstSteps
     * Konstruiert den FirstSteps Application Grundrahmen, durch erzeugen des AudioPlayers und der NavBar
     * @param {HTMLElement} dom - Ort des Inhalts der Page
     *
     *
     */
    constructor(dom) {
        this.dom_root = document.getElementById('app');
        this.dom_content = dom;
        this.dom_content.classList.add('FirstSteps');
        this.audioPlayer = new AudioPlayer(this.dom_content, null);
        this.navBar = new NavBar(this.dom_content);
        this.dom_root.appendChild(this.dom_content);
    }
    /**
     * @function close()
     *
     * Entfernt den Content bzw die einzelnen Dom Elemente werden removed
     * audioPlayer und navBar werden removed
     */
    close() {
        this.dom_content.classList.remove("FirstSteps");
        while (this.dom_content.firstChild) {
            this.dom_content.removeChild(this.dom_content.firstChild);
        }
        this.audioPlayer.close();
        this.navBar.close();
    }
}
//# sourceMappingURL=FirstSteps.js.map
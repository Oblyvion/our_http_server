import { AudioPlayer } from "./AudioPlayer.js";
import { NavBar } from "./NavBar.js";
export class FirstSteps {
    constructor(dom) {
        this.API_URL = 'http://localhost:' + localStorage.getItem("port");
        this.dom_root = document.getElementById('app');
        this.dom_content = dom;
        this.dom_content.classList.add('FirstSteps');
        this.audioPlayer = new AudioPlayer(this.dom_content);
        // console.log("FirstSteps.ts, constructor: HALLO PLEASE");
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
//# sourceMappingURL=FirstSteps.js.map
import { AudioPlayer } from "./AudioPlayer.js";
import { NavBar } from "./NavBar.js";
export class MyAccount {
    constructor(dom) {
        this.API_URL = 'http://192.168.178.44:' + localStorage.getItem("port");
        this.Playlists = this.getPlaylists();
        this.dom_root = document.getElementById('app');
        this.dom_ContentMyAccount = dom;
        this.dom_ContentMyAccount.classList.add('ContentMyAccount');
        this.dom_root.appendChild(this.dom_ContentMyAccount);
        this.audioPlayer = new AudioPlayer(this.dom_ContentMyAccount, null, null);
        this.navBar = new NavBar(this.dom_root, this.dom_ContentMyAccount);
        this.dom_MyAccountContainer = document.createElement('div');
        this.dom_MyAccountContainer.classList.add('MyAccountContainer');
        this.dom_ContentMyAccount.appendChild(this.dom_MyAccountContainer);
        this.dom_divMyAccHeader = document.createElement('div');
        this.dom_divMyAccHeader.classList.add('MyAccHeader');
        this.dom_MyAccountContainer.appendChild(this.dom_divMyAccHeader);
        this.dom_divMyAccHeaderUserName = document.createElement('div');
        this.dom_divMyAccHeaderUserName.classList.add('MyAccHeaderUserName');
        this.dom_divMyAccHeader.appendChild(this.dom_divMyAccHeaderUserName);
        this.dom_divMyAccHeaderUserName.textContent = this.parseJwt(localStorage.getItem("token")).username;
        this.dom_MyAccountInfoContainer = document.createElement('div');
        this.dom_MyAccountInfoContainer.classList.add('MyAccountInfoContainer');
        this.dom_MyAccountContainer.appendChild(this.dom_MyAccountInfoContainer);
    }
    parseJwt(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    }
    ;
    async getPlaylists() {
        try {
            // console.log(`das ist body name: ${this.dom_loginInputID.value}`);
            // console.log(`das ist body pw: ${password.toString()}`);
            // console.log("hallo hier local storageeeeee "+localStorage.getItem("token"));
            const playlists = await fetch(this.API_URL + "/playlists/", {
                cache: 'no-cache',
                headers: {
                    'content-type': 'application/javascript',
                    'crossDomain': 'true',
                    'Authorization': localStorage.getItem("token")
                },
                method: 'GET',
                mode: 'cors',
            });
            const result = await playlists.json();
            console.log("DAS IST RESULT: ", result.data);
            return result.data;
        }
        catch (err) {
            console.log("Error fetching Playlists!");
        }
    }
    close() {
        this.dom_ContentMyAccount.classList.remove("ContentMyAccount");
        while (this.dom_ContentMyAccount.firstChild) {
            this.dom_ContentMyAccount.removeChild(this.dom_ContentMyAccount.firstChild);
        }
        this.dom_ContentMyAccount.remove();
    }
}
//# sourceMappingURL=MyAccount.js.map
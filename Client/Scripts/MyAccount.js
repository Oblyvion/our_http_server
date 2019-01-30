import { AudioPlayer } from "./AudioPlayer.js";
import { NavBar } from "./NavBar.js";
/**
 * @class MyAccount
 * Erzeugt die MyAccount Page auf der User ihren Score abrufen können
 */
export class MyAccount {
    /**
     * @constructor MyAccount
     * Konstruiert die MyAccount Seite
     * @param dom - Das wird das DOM Element, was den Content von MyAccount beinhaltet
     */
    constructor(dom) {
        this.API_URL = 'http://localhost:3000';
        this.dom_root = document.getElementById('app');
        this.dom_ContentMyAccount = dom;
        this.dom_ContentMyAccount.classList.add('ContentMyAccount');
        this.dom_root.appendChild(this.dom_ContentMyAccount);
        this.audioPlayer = new AudioPlayer(this.dom_ContentMyAccount, null);
        this.navBar = new NavBar(this.dom_ContentMyAccount);
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
        this.dom_MyAccountInfoContainerScoreDiv = document.createElement('div');
        this.dom_MyAccountInfoContainerScoreDiv.classList.add('MyAccountInfoContainerScoreDiv');
        this.dom_MyAccountInfoContainerScoreDiv.textContent = "Your Score: ";
        this.dom_MyAccountInfoContainerScoreDiv.style.fontSize = "larger";
        this.dom_MyAccountInfoContainer.appendChild(this.dom_MyAccountInfoContainerScoreDiv);
        this.dom_MyAccountInfoContainerScore = document.createElement('div');
        this.dom_MyAccountInfoContainerScore.classList.add('MyAccountInfoContainerScore');
        this.dom_MyAccountInfoContainerScoreDiv.appendChild(this.dom_MyAccountInfoContainerScore);
        this.fetchScore().then(data => {
            //console.log("das ist data bei fetch score: ", data);
            this.Score = data.data;
            this.dom_MyAccountInfoContainerScore.textContent = this.Score;
        });
    }
    /**
     * @function parseJwt()
     * Parst einen Json Web Token
     * @param token - das ist der token des angemeldeten Users
     */
    parseJwt(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    }
    ;
    /**
     * @async fetchScore()
     * fetched die Route /user welche den Score eines Users zurückliefert
     * wenn alles erfolgreich war wird der Wert bei onfullfilled dem Score zugewiesen und angezeigt.
     *
     * Method: GET
     */
    async fetchScore() {
        try {
            let response = await fetch(this.API_URL + "/user", {
                cache: 'no-cache',
                headers: {
                    'content-type': 'application/javascript',
                    'crossDomain': 'true',
                    'Authorization': localStorage.getItem("token")
                },
                method: 'GET',
                mode: 'cors',
            });
            const data = await response.json();
            return data;
        }
        catch (err) {
            console.log("Error fetching Userscore!: ", err);
        }
    }
    /**
     * @function close()
     *
     * Entfernt den Content bzw. removed die einzelnen DOM Elemente
     *
     */
    close() {
        this.dom_ContentMyAccount.classList.remove("ContentMyAccount");
        while (this.dom_ContentMyAccount.firstChild) {
            this.dom_ContentMyAccount.removeChild(this.dom_ContentMyAccount.firstChild);
        }
        this.dom_ContentMyAccount.remove();
    }
}
//# sourceMappingURL=MyAccount.js.map
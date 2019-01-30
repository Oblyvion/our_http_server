/**
 * @class NewPlaylistMate
 * Enthält die Seite NewPlaylistMate, welche es dem User ermöglicht neue User zu seinen Playlist-Mates hinzuzufügen.
 */
export class NewPlaylistMate {
    private API_URL = 'http://localhost:3000';

    private dom_content: HTMLElement;
    private dom_divNewPlaylistMate: HTMLDivElement;
    private dom_divNewMateHeader: HTMLDivElement;
    private dom_divNewMateHeaderName: HTMLDivElement;
    private dom_NewPlaylistMateContainer: HTMLDivElement;

    private Users;
    private randomIndex = [];
    private topWerte = [];
    private leftWerte = [];
    private dom_NewMatesSearchMenuContent: HTMLDivElement;
    private dom_NewMatesSearchMenuInput: HTMLInputElement;
    private dom_NewMatesSearchMenuData: HTMLAnchorElement;
    private dom_NewMatesRandomDiv: HTMLDivElement;
    private dom_NewMatesRandomDivHeader: HTMLDivElement;
    private dom_NewMatesRandomDivContent: HTMLDivElement;

    /**
     * @constructor NewPlaylistMate
     * Konstruiert die Seite dazu gehört der "Zweitheader" der Seite in dem die Aufgabe an den User formuliert ist,
     * die Suche nach Usern ermöglicht durch ein Input Field und ein Random Div indem User angezeigt werden die noch nicht zu den PlaylistMates
     * gehören.
     *
     * @param dom_content
     */
    constructor(dom_content) {
        this.dom_content = dom_content;
        this.fetchUsers().then((result) => {
            this.Users = result.data;
            console.log("Das sind die User: ", this.Users);
            this.addRandomContent();
        }).catch(err => {
            console.log(err);
        });

        this.dom_divNewPlaylistMate = document.createElement('div');
        this.dom_divNewPlaylistMate.classList.add('NewPlaylistMateDiv');
        this.dom_content.appendChild(this.dom_divNewPlaylistMate);

        this.dom_divNewMateHeader = document.createElement('div');
        this.dom_divNewMateHeader.classList.add('NewPlaylistMateHeaderDiv');
        this.dom_divNewPlaylistMate.appendChild(this.dom_divNewMateHeader);

        this.dom_divNewMateHeaderName = document.createElement('div');
        this.dom_divNewMateHeaderName.classList.add('NewPlaylistMateHeaderName');
        this.dom_divNewMateHeader.appendChild(this.dom_divNewMateHeaderName);
        this.dom_divNewMateHeaderName.textContent = "Want to find a new mate...";

        this.dom_NewPlaylistMateContainer = document.createElement('div');
        this.dom_NewPlaylistMateContainer.classList.add('NewPlaylistMateContainer');
        this.dom_divNewPlaylistMate.appendChild(this.dom_NewPlaylistMateContainer);

        this.dom_NewMatesSearchMenuContent = document.createElement('div');
        this.dom_NewPlaylistMateContainer.appendChild(this.dom_NewMatesSearchMenuContent);
        this.dom_NewMatesSearchMenuContent.classList.add("NewMatesSearchContent");

        this.dom_NewMatesSearchMenuInput = document.createElement('input');
        this.dom_NewMatesSearchMenuInput.placeholder = "type in username from a user";
        this.dom_NewPlaylistMateContainer.appendChild(this.dom_NewMatesSearchMenuInput);
        this.dom_NewMatesSearchMenuInput.classList.add("NewMatesInput");
        this.dom_NewMatesSearchMenuInput.setAttribute('type', "text");
        this.dom_NewMatesSearchMenuInput.onkeyup = () => {
            //console.log("EVENT!!!!");

            for (let j = 0; j < this.Users.length; j++) {

                let regexp = new RegExp("(^" + this.dom_NewMatesSearchMenuInput.value + "){1}");

                //console.log("DAS IST REGEXP: ", regexp);
                if (this.Users[j].NAME.match(regexp)) {
                    for (let i = 0; i < this.dom_NewMatesSearchMenuContent.children.length; i++) {
                        if (this.dom_NewMatesSearchMenuContent.children[i].textContent === this.Users[j].NAME) {
                            this.dom_NewMatesSearchMenuContent.children[i].remove();
                        }
                    }
                    this.dom_NewMatesSearchMenuData = document.createElement('a');
                    this.dom_NewMatesSearchMenuData.textContent = this.Users[j].NAME;
                    this.dom_NewMatesSearchMenuData.classList.add('NewMatesSearchMenuData');
                    this.dom_NewMatesSearchMenuData.setAttribute('href', '#');
                    this.dom_NewMatesSearchMenuData.addEventListener('click', () => {
                        this.fetchRequest(j).then(result => {
                            // console.log("result:  ", result);
                            const antwort = result.data;
                            // console.log("Das ist request result: ", antwort);
                            alert("User " + this.Users[j].NAME + " has been asked to become your Playlist mate!");
                        }).catch(err => {
                            alert("Playlist mate request failed!");
                            console.log(err);
                        });
                    });
                    this.dom_NewMatesSearchMenuContent.appendChild(this.dom_NewMatesSearchMenuData);
                } else {
                    for (let i = 0; i < this.dom_NewMatesSearchMenuContent.children.length; i++) {
                        if (this.dom_NewMatesSearchMenuContent.children[i].textContent === this.Users[j].NAME) {
                            this.dom_NewMatesSearchMenuContent.children[i].remove();
                        }
                    }
                }

                if (this.dom_NewMatesSearchMenuInput.value.length <= 0) {
                    while (this.dom_NewMatesSearchMenuContent.firstChild) {
                        this.dom_NewMatesSearchMenuContent.removeChild(this.dom_NewMatesSearchMenuContent.firstChild);
                    }
                }

            }
        };

        this.dom_NewMatesRandomDiv = document.createElement('div');
        this.dom_NewPlaylistMateContainer.appendChild(this.dom_NewMatesRandomDiv);
        this.dom_NewMatesRandomDiv.classList.add("NewMatesRandomDiv");

        this.dom_NewMatesRandomDivHeader = document.createElement('div');
        this.dom_NewMatesRandomDiv.appendChild(this.dom_NewMatesRandomDivHeader);
        this.dom_NewMatesRandomDivHeader.classList.add("NewMatesRandomHeader");
        this.dom_NewMatesRandomDivHeader.textContent = "or add a random user!";

        this.dom_NewMatesRandomDivContent = document.createElement('div');
        this.dom_NewMatesRandomDiv.appendChild(this.dom_NewMatesRandomDivContent);
        this.dom_NewMatesRandomDivContent.classList.add("NewMatesRandomContent");

    }

    /**
     * @function addRandomContent()
     * Die Funktion generiert random Zahlen zwischen 0 und dem Array Users.length -1 um ein Array namens RandomIndex mit
     * ungleichen Werten(Indizes) zu füllen, welche dann den neu erzeugten RandomMateAnchors hinzugefügt zu werden um die Random
     * Content Box zu füllen.
     */
    addRandomContent() {

        let dom_NewRandomMate;
        let random;

        // console.log("Users length: ", this.Users.length);
        for (let i = 0; i < this.Users.length; i++) {
            random = Math.floor(Math.random() * (this.Users.length));
            // console.log("random: ", random);
            // console.log("das ist i in der for schleife: ", i);

            if (!this.randomIndex.includes(random)) {
                this.randomIndex.push(random);
            } else {
                while (this.randomIndex.includes(random)) {
                    random = Math.floor(Math.random() * (this.Users.length));
                    // console.log("new random: ", random);
                    // console.log("das ist i in der while: ", i);
                    if (!this.randomIndex.includes(random)) {
                        this.randomIndex.push(random);
                        break;
                    }
                }
            }

            //console.log("randomarray: ", this.randomIndex);

            dom_NewRandomMate = document.createElement('a');
            this.dom_NewMatesRandomDivContent.appendChild(dom_NewRandomMate);
            dom_NewRandomMate.classList.add("NewRandomMate");
            dom_NewRandomMate.textContent = this.Users[this.randomIndex[i]].NAME;

            let randomMarginWidth = Math.floor(Math.random() * (90));

            this.checkIfRandomInArray(this.leftWerte, randomMarginWidth, i);

            let randomMarginHeight = Math.floor(Math.random() * (90));

            this.checkIfRandomInArray(this.topWerte, randomMarginHeight, i);

            //console.log("margintop: und marginleft; ", this.topWerte[i].toString() + "%", this.leftWerte[i].toString() + "%");

            dom_NewRandomMate.style.top = this.topWerte[i].toString() + "%";
            dom_NewRandomMate.style.left = this.leftWerte[i].toString() + "%";
        }
    }

    /**
     * @function fetchUsers()
     * Ruft die Route /users des Servers auf welche nur die User zurücklierfert, welche keine Playlist-Mates des
     * jeweils angemeldeten Users sind
     *
     * Method: GET
     */
    async fetchUsers() {
        try {
            let response = await fetch(this.API_URL + "/users ", {
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
        } catch (err) {
            console.log("Error fetching Users!: ", err);
        }
    }

    /**
     * @function fetchUsers()
     * Ruft die Route /users des Servers auf welche nur die User zurücklierfert, welche keine Playlist-Mates des
     * jeweils angemeldeten Users sind.
     *
     * Method: POST
     */
    async fetchRequest(clicked) {
        try {
            let response = await fetch(this.API_URL + "/playlistMate/", {
                body: JSON.stringify({
                    mate: this.Users[clicked].NAME,
                }),
                cache: 'no-cache',
                headers: {
                    'content-type': 'application/json',
                    'crossDomain': 'true',
                    'Authorization': localStorage.getItem("token")
                },
                method: 'POST',
                mode: 'cors',
            });

            const data = await response.json();

            return data;
        } catch (err) {
            console.log("Error fetching Request for Mate!: ", err);
        }
    }

    /**
     * @function close()
     *
     * Entfernt den Content indem alle childNodes entfernt werden
     *
     */
    close() {
        while (this.dom_content.firstChild) {
            this.dom_content.removeChild(this.dom_content.firstChild);
        }
    }

    /**
     * @function checkIfRandomInArray()
     * Die Funktion checkt ob ein bestimmter random generierter Wert schon im Array vorhanden ist, ist dies
     * nicht der Fall so wird der random Wert hinzugefügt ansonsten wird solange ein neuer generiert, bis der
     * Wert in den Array passt, da er nicht vorhanden ist
     *
     * @param array - array in dem gesucht wird
     * @param random - random wert der bereits erzeugt wurde
     * @param i - index um zu überprüfen ob der Array am Anfang ist und einfach ein random Wert hinzugefügt werden kann.
     */
    private checkIfRandomInArray(array, random, i) {
        if (i === 0) {
            array.push(random);
        }

        if (array.includes(random) && i !== 0) {
            while (array.includes(random)) {
                random = Math.floor(Math.random() * (80));
                // console.log("random new: ", random);
                if (!array.includes(random)) {
                    array.push(random);
                    break;
                }
            }
        }
        if (!array.includes(random) && i !== 0) {
            array.push(random);
        }
    }
}
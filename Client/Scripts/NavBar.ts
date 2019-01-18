import {manager} from "./app.js";
import {PlaylistTable} from "./PlaylistTable.js";

const API_URL = 'http://localhost:3000';

const test = {
    "name": "playlist1",
    "from": "hans"
};

export class NavBar {
    private dom_root: HTMLElement;
    private dom_content: HTMLElement;
    private dom_divNavBar: HTMLElement;
    private dom_addButton: HTMLDivElement;
    private dom_addButtonImg: HTMLImageElement;
    private dom_UList: HTMLUListElement;
    private dom_ListElement: HTMLLIElement;
    private dom_divNavBarToggle: HTMLElement;
    private dom_span_array = [];
    private dom_newplaylist: HTMLInputElement;
    private playlistTable: PlaylistTable;

    private listofPlaylists;


    constructor(dom_body: HTMLElement, dom_content: HTMLElement) {

        this.fetchPlaylists().then((result) => {
            this.listofPlaylists = result.data;
            console.log("das ist list of playlists: ", this.listofPlaylists);
            this.addPlaylistNames();
        })
            .catch(err => {
                console.log("NavBar.ts, constructor = ", err);
            }
        );


        this.dom_root = dom_body;
        this.dom_content = dom_content;

        this.dom_divNavBar = document.createElement('div');
        this.dom_divNavBar.classList.add("NavBarDiv");
        this.dom_content.appendChild(this.dom_divNavBar);

        this.dom_addButton = document.createElement('div');
        this.dom_addButton.classList.add("NavBarAddButtonDiv");
        this.dom_divNavBar.appendChild(this.dom_addButton);

        this.dom_addButtonImg = document.createElement('img');
        this.dom_addButtonImg.classList.add("NavBarAddButtonImage");
        this.dom_addButton.appendChild(this.dom_addButtonImg);
        this.dom_addButtonImg.src = "./Images/add_button.png";
        this.dom_addButtonImg.style.width = "40px";
        this.dom_addButtonImg.addEventListener('click', () => {
            if (this.dom_newplaylist.style.display === "none") {
                this.dom_newplaylist.style.display = "block";
            } else {
                this.insertNewPlaylist(this.dom_newplaylist.value);
                this.fetchPlaylists().then((result) => {
                    this.listofPlaylists = result.data;
                    console.log("das ist list of playlists: ", this.listofPlaylists);
                    this.addPlaylistNames();
                })
                    .catch(err => {
                            console.log("NavBar.ts, constructor = ", err);
                        }
                    );
                this.addPlaylistNames();
                this.dom_newplaylist.style.display = "none";
            }
        });

        this.dom_newplaylist = document.createElement("input");
        this.dom_newplaylist.classList.add("NavBarInputNewSong");
        this.dom_addButton.appendChild(this.dom_newplaylist);

        // this.dom_divNavBarToggle = document.createElement('div');
        // this.dom_divNavBarToggle.classList.add("NavBarDivToggle");
        // this.dom_divNavBar.appendChild(this.dom_divNavBarToggle);
        // this.dom_divNavBarToggle.addEventListener('click', () => {
        //     this.toggleNavBar();
        //     this.moveBurgerButton();
        //     this.changeColorOfSpan();
        // });
        //
        //     for(let i = 0; i<3; i++) {
        //         this.dom_span_array[i] = document.createElement('span');
        //         this.dom_span_array[i].classList.add("NavBarSpan");
        //         this.dom_divNavBarToggle.appendChild(this.dom_span_array[i]);
        //     }


    }

    async fetchPlaylists() {
        // console.log(`das ist body name: ${this.dom_loginInputID.value}`);
        // console.log(`das ist body pw: ${password.toString()}`);
        try {

            console.log("hallo hier local storageeeeee " + localStorage.getItem("token"));
            let response = await fetch(API_URL + "/playlists/", {
                cache: 'no-cache',
                headers: {
                    'content-type': 'application/json',
                    'crossDomain': 'true',
                    'Authorization': localStorage.getItem('token')
                },
                method: 'GET',
                mode: 'cors',
                // todo REST POST redirect
                // redirect: 'follow',
                // credentials: 'include',
            });
            let data = await response.json();
            console.log("NavBar.ts, fetchPlaylists: data = ", data.data);
            return data;

            // return await response.json();
        } catch (err) {
            console.log("NavBar.ts, fetchPlaylists: ERROR = ", err);
        }
    }

    addPlaylistNames() {
        this.dom_UList = document.createElement('ul');
        this.dom_UList.classList.add("NavBarUL");
        this.dom_divNavBar.appendChild(this.dom_UList);

        for (let i = 0; i < this.listofPlaylists.length; i++) {
            this.dom_ListElement = document.createElement('li');
            this.dom_ListElement.classList.add("NavBarListElement");
            this.dom_UList.appendChild(this.dom_ListElement);
            this.dom_ListElement.addEventListener('click', () => {
                this.playlistTable = new PlaylistTable(this.dom_root, this.dom_content, this.listofPlaylists[i]);
            });
        }
        this.setNamesofPlaylists();
    }

    setNamesofPlaylists() {
        let n = this.dom_UList.childNodes.length;
        for (let i = 0; i < n; i++) {
            this.dom_UList.childNodes.item(i).textContent = this.listofPlaylists[i].NAME;
        }
    }

    async insertNewPlaylist(playlist_name: String) {
        try {
            const response = await fetch(API_URL + '/playlist/', {
                body: JSON.stringify({
                    name: playlist_name
                }),
                cache: 'no-cache',
                headers: {
                    'content-type': 'application/json',
                    'crossDomain': 'true',
                    'Authorization': localStorage.getItem('token')
                },
                method: 'POST',
                mode: 'cors',
                // todo REST POST redirect
                // redirect: 'follow',
                // credentials: 'include',
            });

            console.log('NavBar.ts, insertNewPlaylist: RESPONSE = ', response);

            const result: PlaylistResult = await response.json();
            if (!result.success) {
                console.error(result);
                throw result.msg;
            }

            if (result.success) {
                this.listofPlaylists.push(result.data.NAME)
            }
            return result;

        } catch(err)  {
            console.log(err);
        }


    }


    toggleNavBar() {
        this.dom_divNavBar.classList.toggle('active');
    }

    moveBurgerButton() {
        this.dom_divNavBarToggle.classList.toggle("active")
    }

    changeColorOfSpan() {
        this.dom_span_array.forEach((elem) => {
            elem.classList.toggle('active');
        });
    }

    close() {
        this.dom_content.remove();
        this.playlistTable.close();
    }
}
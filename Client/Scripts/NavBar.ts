import {PlaylistTable} from "./PlaylistTable.js";

const API_URL = 'http://localhost:3000';

export class NavBar {
    private dom_root: HTMLElement;
    private dom_content: HTMLElement;
    private dom_divNavBar: HTMLElement;
    private dom_addButton: HTMLDivElement;
    private dom_addButtonImg: HTMLImageElement;
    private dom_UList: HTMLUListElement;
    private dom_UList2: HTMLUListElement;
    private dom_ListElement: HTMLLIElement;
    private dom_divNavBarToggle: HTMLElement;
    private dom_span_array = [];
    private dom_newplaylist: HTMLInputElement;
    private playlistTable: PlaylistTable;

    private OwnlistofPlaylists;
    private CollaboratedPlaylists;
    private clickedPlaylistID;


    constructor(dom_body: HTMLElement, dom_content: HTMLElement) {

        this.fetchPlaylists().then((result) => {
            this.OwnlistofPlaylists = result.data;
            this.addPlaylistNames(this.OwnlistofPlaylists, true);
        })
            .catch(err => {
                    console.log("NavBar.ts, constructor aufruf fetchPlaylists = ", err);
                }
            );

        this.fetchCollaboratedPlaylists().then((result) => {
            this.CollaboratedPlaylists = result.data;
            this.addPlaylistNames(this.CollaboratedPlaylists, false);
        })
            .catch(err => {
                    console.log("NavBar.ts, constructor aufruf fetchCollaboratedPlaylists = ", err);
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
            if (this.dom_newplaylist.style.display === "block") {
                if (this.dom_newplaylist.value.length > 1) {
                    this.insertNewPlaylist(this.dom_newplaylist.value);
                    this.dom_newplaylist.value = null;
                    this.fetchPlaylists().then((result) => {
                        //this.dom_UList.removeChild()
                        while (this.dom_UList.firstChild) {
                            this.dom_UList.removeChild(this.dom_UList.firstChild);
                        }
                        // console.log("das ist die GELÖSCHTE list of playlists: ", this.listofPlaylists);
                        this.OwnlistofPlaylists = result.data;
                        // console.log("das ist list of playlists nach dem 2. fetch: ", this.listofPlaylists);
                        this.addPlaylistNames(this.OwnlistofPlaylists, true);
                    })
                        .catch(err => {
                                console.log("NavBar.ts, constructor = ", err);
                            }
                        );
                }
                this.dom_newplaylist.style.display = "none";
            } else {
                this.dom_newplaylist.style.display = "block";
            }
        });

        this.dom_newplaylist = document.createElement("input");
        this.dom_newplaylist.classList.add("NavBarInputNewSong");
        this.dom_addButton.appendChild(this.dom_newplaylist);
        this.dom_newplaylist.placeholder = "type in new playlist";

        this.dom_UList = document.createElement('ul');
        this.dom_UList.classList.add("NavBarUL");
        this.dom_divNavBar.appendChild(this.dom_UList);

        this.dom_UList2 = document.createElement('ul');
        this.dom_UList2.classList.add("NavBarUL");
        this.dom_divNavBar.appendChild(this.dom_UList2);

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

            // console.log("hallo hier local storageeeeee " + localStorage.getItem("token"));
            let response = await fetch(API_URL + "/playlists/", {
                cache: 'no-cache',
                headers: {
                    'content-type': 'application/json',
                    'crossDomain': 'true',
                    'Authorization': localStorage.getItem('token')
                },
                method: 'GET',
                mode: 'cors',
            });
            let data = await response.json();
            console.log("NavBar.ts, fetchPlaylists: data = ", data.data);
            return data;
            // return await response.json();
        } catch (err) {
            console.log("NavBar.ts, fetchPlaylists: ERROR = ", err);
        }
    }

    async fetchCollaboratedPlaylists() {
        // console.log(`das ist body name: ${this.dom_loginInputID.value}`);
        // console.log(`das ist body pw: ${password.toString()}`);
        try {

            // console.log("hallo hier local storageeeeee " + localStorage.getItem("token"));
            let response = await fetch(API_URL + "/playlists/collabs", {
                cache: 'no-cache',
                headers: {
                    'content-type': 'application/json',
                    'crossDomain': 'true',
                    'Authorization': localStorage.getItem('token')
                },
                method: 'GET',
                mode: 'cors',
            });
            let data = await response.json();
            console.log("NavBar.ts, fetchCollaboratedPlaylists: data = ", data.data);
            return data;
            // return await response.json();
        } catch (err) {
            console.log("NavBar.ts, fetchCollaboratedPlaylists: ERROR = ", err);
        }
    }

    addPlaylistNames(playlists, ownornot) {

        console.log("länge: ", playlists.length);
        if (ownornot) {
            for (let i = 0; i < this.OwnlistofPlaylists.length; i++) {
                this.dom_ListElement = document.createElement('li');
                this.dom_ListElement.classList.add("NavBarListElement");
                this.dom_UList.appendChild(this.dom_ListElement);
                this.dom_ListElement.addEventListener('click', () => {
                    if (this.playlistTable) {
                        this.playlistTable.close();
                    }
                    for (let i = 2; i < this.dom_content.childNodes.length; i++) {
                        this.dom_content.childNodes[i].remove();
                    }
                    const header = document.getElementById("header");
                    header.textContent = "Music Playlist";
                    this.playlistTable = new PlaylistTable(this.dom_root, this.dom_content, this.OwnlistofPlaylists[i]);
                });
            }
            this.setNamesofPlaylists(true);
        }
        else {
            for (let i = 0; i < this.CollaboratedPlaylists.length; i++) {
                this.dom_ListElement = document.createElement('li');
                this.dom_ListElement.classList.add("NavBarListElement");
                this.dom_UList2.appendChild(this.dom_ListElement);
                this.dom_ListElement.addEventListener('click', () => {
                    if (this.playlistTable) {
                        this.playlistTable.close();
                    }
                    for (let i = 2; i < this.dom_content.childNodes.length; i++) {
                        this.dom_content.childNodes[i].remove();
                    }
                    const header = document.getElementById("header");
                    header.textContent = "Music Playlist";
                    this.playlistTable = new PlaylistTable(this.dom_root, this.dom_content, this.CollaboratedPlaylists[i]);
                });
            }
            this.setNamesofPlaylists(false);
        }

    }

    // deletePlaylist() {
    //     console.log("0NavBar.ts, deletePlaylist: PLAYLIST = ", this.listofPlaylists);
    //     this.listofPlaylists = {};
    //     console.log("1NavBar.ts, deletePlaylist: PLAYLIST = ", this.listofPlaylists);
    // }

    setNamesofPlaylists(own) {
        if (own) {
            let n = this.dom_UList.childNodes.length;
            for (let i = 0; i < n; i++) {
                this.dom_UList.childNodes.item(i).textContent = this.OwnlistofPlaylists[i].NAME;
            }
        }
        else {
            let n = this.dom_UList2.childNodes.length;
            for (let i = 0; i < n; i++) {
                this.dom_UList2.childNodes.item(i).textContent = this.CollaboratedPlaylists[i].NAME;
            }
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
                    'Authorization': localStorage.getItem("token")
                },
                method: 'POST',
                mode: 'cors',
                // todo REST POST redirect
                // redirect: 'follow',
                // credentials: 'include',
            });

            console.log('NavBar.ts, insertNewPlaylist: Response = ', response);

            const result: PlaylistResult = await response.json();
            if (!result.success) {
                console.error(result);
                throw result.msg;
            }

            if (result.success) {
                console.log('NavBar.ts, insertNewPlaylist: Result success!');
                return;
            }

        } catch (err) {
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
        if (this.playlistTable) {
            this.playlistTable.close();
        }
    }
}
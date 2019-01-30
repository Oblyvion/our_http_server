import { PlaylistTable } from "./PlaylistTable.js";
export class NavBar {
    constructor(dom_body, dom_content) {
        this.API_URL = 'http://localhost:' + localStorage.getItem("port");
        this.fetchPlaylists().then((result) => {
            this.OwnlistofPlaylists = result.data;
            this.addPlaylistNames(this.OwnlistofPlaylists, true);
        })
            .catch(err => {
            console.log("NavBar.ts, constructor Aufruf fetchPlaylists = ", err);
        });
        this.fetchCollaboratedPlaylists().then((result) => {
            this.CollaboratedPlaylists = result.data;
            this.addPlaylistNames(this.CollaboratedPlaylists, false);
        })
            .catch(err => {
            console.log("NavBar.ts, constructor Aufruf fetchCollaboratedPlaylists = ", err);
        });
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
                    this.insertNewPlaylist(this.dom_newplaylist.value).then(() => {
                    })
                        .catch(err => {
                        console.log(err);
                    });
                    this.dom_newplaylist.value = null;
                    this.fetchPlaylists().then((result) => {
                        while (this.dom_UList.firstChild) {
                            this.dom_UList.removeChild(this.dom_UList.firstChild);
                        }
                        this.OwnlistofPlaylists = result.data;
                        this.addPlaylistNames(this.OwnlistofPlaylists, true);
                    })
                        .catch(err => {
                        console.log("NavBar.ts, ", err);
                    });
                }
                this.dom_newplaylist.style.display = "none";
            }
            else {
                this.dom_newplaylist.style.display = "block";
            }
        });
        this.dom_newplaylist = document.createElement("input");
        this.dom_newplaylist.classList.add("NavBarInputNewSong");
        this.dom_addButton.appendChild(this.dom_newplaylist);
        this.dom_newplaylist.placeholder = "type in new playlist";
        this.dom_UListSeperator0 = document.createElement('div');
        this.dom_UListSeperator0.classList.add("UListSeperator");
        this.dom_divNavBar.appendChild(this.dom_UListSeperator0);
        this.dom_UListSeperator0.textContent = "Own Playlists";
        this.dom_UList = document.createElement('ul');
        this.dom_UList.classList.add("NavBarOwnList");
        this.dom_divNavBar.appendChild(this.dom_UList);
        this.dom_UListSeperator = document.createElement('div');
        this.dom_UListSeperator.classList.add("UListSeperator");
        this.dom_divNavBar.appendChild(this.dom_UListSeperator);
        this.dom_UListSeperator.textContent = "Collaborated Playlists";
        this.dom_UList2 = document.createElement('ul');
        this.dom_UList2.classList.add("NavBarCollabList");
        this.dom_divNavBar.appendChild(this.dom_UList2);
    }
    async fetchPlaylists() {
        try {
            let response = await fetch(this.API_URL + "/playlists/", {
                cache: 'no-cache',
                headers: {
                    'content-type': 'application/json',
                    'crossDomain': 'true',
                    'Authorization': localStorage.getItem('token')
                },
                method: 'GET',
                mode: 'cors'
            });
            let data = await response.json();
            return data;
        }
        catch (err) {
            console.log("NavBar.ts, fetchPlaylists: ERROR = ", err);
        }
    }
    async fetchCollaboratedPlaylists() {
        try {
            let response = await fetch(this.API_URL + "/playlists/collabs", {
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
            return data;
        }
        catch (err) {
            console.log("NavBar.ts, fetchCollaboratedPlaylists: ERROR = ", err);
        }
    }
    addPlaylistNames(playlists, ownornot) {
        //console.log("länge: ", playlists.length);
        if (ownornot) {
            for (let i = 0; i < this.OwnlistofPlaylists.length; i++) {
                this.dom_ListElement = document.createElement('li');
                this.dom_ListElement.classList.add("NavBarListElement");
                this.dom_UList.appendChild(this.dom_ListElement);
                this.dom_ListElement.addEventListener('click', () => {
                    console.log(this.dom_content);
                    this.clearContent();
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
                    this.clearContent();
                    const header = document.getElementById("header");
                    header.textContent = "Music Playlist";
                    this.playlistTable = new PlaylistTable(this.dom_root, this.dom_content, this.CollaboratedPlaylists[i]);
                });
            }
            this.setNamesofPlaylists(false);
        }
    }
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
    async insertNewPlaylist(playlist_name) {
        try {
            const response = await fetch(this.API_URL + '/playlist/', {
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
            });
            console.log('NavBar.ts, insertNewPlaylist: Response = ', response);
            const result = await response.json();
            if (!result.success) {
                console.error(result);
                throw result.msg;
            }
            if (result.success) {
                console.log('NavBar.ts, insertNewPlaylist: Result success!');
                return;
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    clearContent() {
        while (this.dom_content.childNodes.length > 2) {
            this.dom_content.removeChild(this.dom_content.lastChild);
        }
    }
    close() {
        this.dom_content.remove();
        if (this.playlistTable) {
            this.playlistTable.close();
        }
    }
}
//# sourceMappingURL=NavBar.js.map
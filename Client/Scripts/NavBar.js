import { PlaylistTable } from "./PlaylistTable.js";
/**
 * @class NavBar
 * Erzeugt die Playlist Navigationsleiste der Application
 */
export class NavBar {
    /**
     * @constructor NavBar
     * Konstruiert die NavBar mit all Ihren Elementen und hängt sie dem Content an
     * @param dom_content - dort wird die NavBar angehängt
     */
    constructor(dom_content) {
        this.API_URL = 'http://localhost:3000';
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
    /**
     * @async fetchPlaylists()
     * Hier wird die Route /playlists des Servers angesprochen, welche die eigenen Playlists des Users fetcht.
     *
     * Method: GET
     */
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
    /**
     * @async fetchCollaboratedPlaylists()
     * Hier wird die Route /playlists/collabs des Servers angesprochen, welche die Playlists des Users zurückgibt bei denen er ein
     * Playlist Collaborator ist.
     *
     * Method: GET
     */
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
    /**
     * @function addPlaylistNames()
     * Die Funktion addPlaylistNames fügt die Namen der jeweiligen Playlists des jeweiligen Users in die NavBar ein.
     * Dabei muss unterschieden werden ob es eine eigene Playlist ist oder eine Playlist an der mitgearbeitet wird.
     * @param playlists - Array der die Playlists enthält
     * @param ownornot - boolean der aussagt ob es eigene Playlists sind oder CollabPlaylists
     * true = own
     * false = collaborated
     */
    addPlaylistNames(playlists, ownornot) {
        //console.log("länge: ", playlists.length);
        if (ownornot) {
            for (let i = 0; i < this.OwnlistofPlaylists.length; i++) {
                this.dom_ListElement = document.createElement('li');
                this.dom_ListElement.classList.add("NavBarListElement");
                this.dom_UList.appendChild(this.dom_ListElement);
                this.dom_UList.childNodes.item(i).textContent = this.OwnlistofPlaylists[i].NAME;
                this.dom_ListElement.addEventListener('click', () => {
                    console.log(this.dom_content);
                    this.clearContent();
                    const header = document.getElementById("header");
                    header.textContent = "Music Playlist";
                    this.playlistTable = new PlaylistTable(this.dom_content, this.OwnlistofPlaylists[i]);
                });
            }
        }
        else {
            for (let i = 0; i < this.CollaboratedPlaylists.length; i++) {
                this.dom_ListElement = document.createElement('li');
                this.dom_ListElement.classList.add("NavBarListElement");
                this.dom_UList2.appendChild(this.dom_ListElement);
                this.dom_UList2.childNodes.item(i).textContent = this.CollaboratedPlaylists[i].NAME;
                this.dom_ListElement.addEventListener('click', () => {
                    this.clearContent();
                    const header = document.getElementById("header");
                    header.textContent = "Music Playlist";
                    this.playlistTable = new PlaylistTable(this.dom_content, this.CollaboratedPlaylists[i]);
                });
            }
        }
    }
    /**
     * @async insertNewPlaylist()
     * Ruft die Route /playlist/ auf die eine neue Playlist hinzufügt
     *
     * @param playlist_name - Name der neuen Playlist
     *
     * Method: POST
     */
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
    /**
     * @function clearContent()
     * löscht jeglichen content bis auf die NavBar und den Music Player
     */
    clearContent() {
        while (this.dom_content.childNodes.length > 2) {
            this.dom_content.removeChild(this.dom_content.lastChild);
        }
    }
    /**
     * @function close()
     * entfernt die Navbar
     */
    close() {
        this.dom_content.remove();
        if (this.playlistTable) {
            this.playlistTable.close();
        }
    }
}
//# sourceMappingURL=NavBar.js.map
import { AudioPlayer } from "./AudioPlayer.js";
export class PlaylistTable {
    constructor(dom_root, dom_content, PlaylistData) {
        this.API_URL = 'http://localhost:' + localStorage.getItem("port");
        this.Playlist = {
            name: "",
            songs: [],
        };
        this.dom_root = dom_root;
        this.dom_content = dom_content;
        this.PlaylistID = PlaylistData.ID;
        console.log("Playlist ID: IST DAS HIER: ", this.PlaylistID);
        this.Playlist.name = PlaylistData.NAME;
        this.fetchPlaylistSongs().then((result) => {
            this.Playlist.songs = result.data;
            this.audioPlayer = new AudioPlayer(this.dom_content, this.Playlist.songs);
            console.log("das SIND DIE SONGS nach erstem fetch: ", this.Playlist.songs);
            this.addPlaylistSongs();
        }).catch(err => {
            console.log(err);
        });
        this.dom_divTable = document.createElement('div');
        this.dom_divTable.classList.add('PlaylistTableDiv');
        this.dom_content.appendChild(this.dom_divTable);
        this.dom_divPlaylistHeader = document.createElement('div');
        this.dom_divPlaylistHeader.classList.add('PlaylistTablePlaylistHeader');
        this.dom_divTable.appendChild(this.dom_divPlaylistHeader);
        this.dom_divPlaylistHeaderPlaylistName = document.createElement('div');
        this.dom_divPlaylistHeaderPlaylistName.classList.add('PlaylistTablePlaylistHeaderPlaylistName');
        this.dom_divPlaylistHeader.appendChild(this.dom_divPlaylistHeaderPlaylistName);
        this.dom_divPlaylistHeaderPlaylistName.textContent = this.Playlist.name;
        this.dom_divPlaylistHeaderButtons = document.createElement('div');
        this.dom_divPlaylistHeaderButtons.classList.add('PlaylistTablePlaylistHeaderButtons');
        this.dom_divPlaylistHeader.appendChild(this.dom_divPlaylistHeaderButtons);
        this.dom_PlaylistHeaderShare = document.createElement('img');
        this.dom_PlaylistHeaderShare.classList.add('PlaylistTablePlaylistHeaderShare');
        this.dom_divPlaylistHeaderButtons.appendChild(this.dom_PlaylistHeaderShare);
        this.dom_PlaylistHeaderShare.src = "./Images/share.png";
        this.dom_PlaylistHeaderShare.style.width = "20px";
        this.dom_PlaylistHeaderShare.addEventListener('click', () => {
            this.dom_DropdownMenu.style.display = "block";
            this.fetchPlaylistMates().then((result) => {
                this.Mates = result.data;
                console.log("Das sind die Mates: ", this.Mates);
            }).catch(err => {
                console.log(err);
            });
        });
        this.dom_DropdownMenu = document.createElement('div');
        this.dom_divTable.appendChild(this.dom_DropdownMenu);
        this.dom_DropdownMenu.classList.add('ShareDropdownMenu');
        this.dom_DropdownMenu.addEventListener('mouseleave', () => {
            this.dom_DropdownMenu.style.display = "none";
        });
        this.dom_DropdownMenuDiv = document.createElement('div');
        this.dom_DropdownMenu.appendChild(this.dom_DropdownMenuDiv);
        this.dom_DropdownMenuDiv.classList.add("ShareDropdownMenuDiv");
        this.dom_DropdownMenuContent = document.createElement('div');
        this.dom_DropdownMenuDiv.appendChild(this.dom_DropdownMenuContent);
        this.dom_DropdownMenuContent.classList.add("ShareDropdownMenuContent");
        this.dom_DropdownMenuInput = document.createElement('input');
        this.dom_DropdownMenuDiv.insertBefore(this.dom_DropdownMenuInput, this.dom_DropdownMenuContent);
        this.dom_DropdownMenuInput.classList.add("ShareDropdownMenuInput");
        this.dom_DropdownMenuInput.setAttribute('type', "text");
        this.dom_DropdownMenuInput.onkeyup = () => {
            //console.log("EVENT!!!!");
            for (let j = 0; j < this.Mates.length; j++) {
                let regexp = new RegExp("(^" + this.dom_DropdownMenuInput.value + "){1}");
                //console.log("DAS IST REGEXP: ", regexp);
                if (this.Mates[j].NAME.match(regexp)) {
                    for (let i = 0; i < this.dom_DropdownMenuContent.children.length; i++) {
                        if (this.dom_DropdownMenuContent.children[i].textContent === this.Mates[j].NAME) {
                            console.log("hallo hier if remove!");
                            this.dom_DropdownMenuContent.children[i].remove();
                        }
                    }
                    this.dom_DropdownMenuData = document.createElement('a');
                    this.dom_DropdownMenuData.textContent = this.Mates[j].NAME;
                    this.dom_DropdownMenuData.classList.add('ShareDropdownMenuData');
                    this.dom_DropdownMenuData.setAttribute('href', '#');
                    this.dom_DropdownMenuData.addEventListener('click', () => {
                    });
                    this.dom_DropdownMenuContent.appendChild(this.dom_DropdownMenuData);
                }
                else {
                    console.log("hallo hier else!");
                    for (let i = 0; i < this.dom_DropdownMenuContent.children.length; i++) {
                        if (this.dom_DropdownMenuContent.children[i].textContent === this.Mates[j].NAME) {
                            console.log("hallo hier else remove!");
                            this.dom_DropdownMenuContent.children[i].remove();
                        }
                    }
                }
                if (this.dom_DropdownMenuInput.value.length <= 0) {
                    while (this.dom_DropdownMenuContent.firstChild) {
                        this.dom_DropdownMenuContent.removeChild(this.dom_DropdownMenuContent.firstChild);
                    }
                }
            }
            // for (let j = 0; j < this.Mates.length; j++) {
            //     for (let i = 0; i < this.dom_DropdownMenuInput.value.length; i++) {
            //         console.log("Das ist elemNAME: " + this.Mates[j].NAME[i] + " und das ist value: " + this.dom_DropdownMenuInput.value[i]);
            //         if (this.Mates[j].NAME[i] === this.dom_DropdownMenuInput.value[i]) {
            //             console.log("hallo add menu content");
            //         } else {
            //             if (this.dom_DropdownMenuContent.childNodes) {
            //                 this.dom_DropdownMenuContent.removeChild(this.dom_DropdownMenuContent.firstChild)
            //             }
            //         }
            //     }
            // }
        };
        // this.dom_DropdownMenuInput.addEventListener('oninput', () => {
        //     console.log("EVENT!!!!");
        //     if(this.dom_DropdownMenuContent.firstChild) {
        //         this.dom_DropdownMenuContent.removeChild(this.dom_DropdownMenuContent.firstChild)
        //     }
        //     this.Mates.forEach(elem => {
        //         for (let i = 0; i < this.dom_DropdownMenuInput.value.length; i++) {
        //             if(elem.NAME[i] === this.dom_DropdownMenuInput.value[i]) {
        //                 this.dom_DropdownMenuData = document.createElement('a');
        //                 this.dom_DropdownMenuData.textContent = elem.NAME;
        //                 this.dom_DropdownMenuData.classList.add('ShareDropdownMenuData');
        //                 this.dom_DropdownMenuData.setAttribute('href', '#');
        //                 this.dom_DropdownMenuData.addEventListener('click', () => {
        //
        //                 });
        //                 this.dom_DropdownMenuContent.appendChild(this.dom_DropdownMenuData);
        //             }
        //         }
        //     })
        // });
        this.dom_PlaylistHeaderAddBtn = document.createElement('img');
        this.dom_PlaylistHeaderAddBtn.classList.add('PlaylistTablePlaylistHeaderAddBtn');
        this.dom_divPlaylistHeaderButtons.appendChild(this.dom_PlaylistHeaderAddBtn);
        this.dom_PlaylistHeaderAddBtn.src = "./Images/add_button.png";
        this.dom_PlaylistHeaderAddBtn.addEventListener('click', () => {
            if (this.dom_AddNewSong.style.display == "grid") {
                this.dom_AddNewSong.style.display = "none";
            }
            else {
                this.dom_AddNewSong.style.display = "grid";
            }
        });
        this.dom_PlaylistHeaderAddBtn.style.width = "20px";
        // this.dom_divPlaylistHeaderAddBtn.addEventListener('click', this.uploadNewSong);
        this.dom_Table = document.createElement('table');
        this.dom_Table.classList.add('PlaylistTable');
        this.dom_divTable.appendChild(this.dom_Table);
        this.dom_Table.cellSpacing = "0";
        this.dom_Table.cellPadding = "0";
        this.dom_TableHeader = document.createElement('tr');
        this.dom_TableHeader.classList.add('TableHeaderRow');
        this.dom_Table.appendChild(this.dom_TableHeader);
        this.dom_TableHeaderName1 = document.createElement('th');
        this.dom_TableHeaderName1.classList.add('TableHeader');
        this.dom_TableHeader.appendChild(this.dom_TableHeaderName1);
        this.dom_TableHeaderName1.textContent = "Title";
        this.dom_TableHeaderName2 = document.createElement('th');
        this.dom_TableHeaderName2.classList.add('TableHeader');
        this.dom_TableHeader.appendChild(this.dom_TableHeaderName2);
        this.dom_TableHeaderName2.textContent = "Artist";
        this.dom_TableHeaderName3 = document.createElement('th');
        this.dom_TableHeaderName3.classList.add('TableHeader');
        this.dom_TableHeader.appendChild(this.dom_TableHeaderName3);
        this.dom_TableHeaderName3.textContent = "Added By";
        this.dom_AddNewSongForm = document.createElement("form");
        this.dom_AddNewSongForm.setAttribute("id", "INPUTFORM");
        //this.dom_AddNewSongForm.setAttribute("action", this.API_URL + "/song/global/" + this.PlaylistID);
        this.dom_AddNewSongForm.setAttribute("method", "POST");
        this.dom_AddNewSongForm.setAttribute("enctype", "multipart/form-data");
        this.dom_AddNewSongForm.setAttribute("data-rel", "back");
        //this.dom_AddNewSongForm.onsubmit = new manager("page-first-steps");
        this.dom_AddNewSongForm.classList.add('AddNewSongForm');
        console.log("ADDNEWSONGFORM = ", this.dom_AddNewSongForm);
        this.dom_divTable.appendChild(this.dom_AddNewSongForm);
        this.dom_AddNewSong = document.createElement("div");
        this.dom_AddNewSong.classList.add('AddNewSongDiv');
        this.dom_AddNewSongForm.appendChild(this.dom_AddNewSong);
        this.dom_AddNewSongHeader = document.createElement("div");
        this.dom_AddNewSongHeader.classList.add('AddNewSongHeader');
        this.dom_AddNewSong.appendChild(this.dom_AddNewSongHeader);
        this.dom_AddNewSongHeader.textContent = "Add a song from database or from your files";
        this.dom_AddNewSongInput = document.createElement("input");
        this.dom_AddNewSongInput.classList.add('AddNewSongInput');
        this.dom_AddNewSong.appendChild(this.dom_AddNewSongInput);
        this.dom_AddNewSongDialogButton = document.createElement("input");
        this.dom_AddNewSongDialogButton.setAttribute("id", "file");
        this.dom_AddNewSongDialogButton.setAttribute("name", "audioFile");
        this.dom_AddNewSongDialogButton.setAttribute("type", "file");
        // this.dom_AddNewSongDialogButton.setAttribute("multiple","multiple");
        // this.dom_AddNewSongDialogButton.type = "file";
        this.dom_AddNewSongDialogButton.classList.add('AddNewSongDialogButton');
        this.dom_AddNewSong.appendChild(this.dom_AddNewSongDialogButton);
        this.dom_InputToken = document.createElement("input");
        this.dom_InputToken.classList.add("token");
        this.dom_InputToken.setAttribute("id", "token");
        this.dom_InputToken.setAttribute("name", "token");
        this.dom_InputToken.setAttribute("type", "text");
        this.dom_AddNewSong.appendChild(this.dom_InputToken);
        this.dom_InputToken.value = localStorage.getItem("token");
        this.dom_InputToken.style.display = "none";
        this.dom_AddNewSongTitle = document.createElement("input");
        this.dom_AddNewSongTitle.classList.add("AddNewSongTitle");
        this.dom_AddNewSongTitle.setAttribute("id", "title");
        this.dom_AddNewSongTitle.setAttribute("name", "title");
        this.dom_AddNewSongTitle.setAttribute("type", "text");
        this.dom_AddNewSong.appendChild(this.dom_AddNewSongTitle);
        this.dom_AddNewSongTitle.placeholder = "Song title...";
        this.dom_AddNewSongArtist = document.createElement("input");
        this.dom_AddNewSongArtist.classList.add("AddNewSongArtist");
        this.dom_AddNewSongArtist.setAttribute("id", "artist");
        this.dom_AddNewSongArtist.setAttribute("name", "artist");
        this.dom_AddNewSongArtist.setAttribute("type", "text");
        this.dom_AddNewSong.appendChild(this.dom_AddNewSongArtist);
        this.dom_AddNewSongArtist.placeholder = "Song artist...";
        this.dom_AddNewSongSubmit = document.createElement("button");
        this.dom_AddNewSongSubmit.classList.add('AddNewSongSubmit');
        this.dom_AddNewSong.appendChild(this.dom_AddNewSongSubmit);
        this.dom_AddNewSongSubmit.textContent = "Submit";
        this.dom_AddNewSongSubmit.addEventListener('click', async (e) => {
            e.preventDefault();
            const formElement = document.querySelector("form");
            const formData = new FormData(formElement);
            const request = new XMLHttpRequest();
            request.open("POST", this.API_URL + "/song/global/" + this.PlaylistID);
            request.send(formData);
            console.log("Das ist die response vom server: " + request.responseText);
            this.fetchPlaylistSongs().then((result) => {
                this.Playlist.songs = result.data;
                this.audioPlayer = new AudioPlayer(this.dom_content, this.Playlist.songs);
                console.log("das sind die songs nach dem hinzufügen eines songs: ", this.Playlist.songs);
                this.addPlaylistSongs();
            }).catch(err => {
                console.log(err);
            });
            this.dom_AddNewSongForm.style.display = "none";
        });
    }
    async fetchPlaylistMates() {
        try {
            let response = await fetch(this.API_URL + "/playlistMates ", {
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
            console.log("Error fetching Mates!: ", err);
        }
    }
    async fetchPlaylistSongs() {
        console.log("fetchPlaylistSongs(), Z.338: this.PlaylistID = ", this.PlaylistID);
        //try {
        // console.log(`das ist body name: ${this.dom_loginInputID.value}`);
        // console.log(`das ist body pw: ${password.toString()}`);
        // console.log("hallo hier local storageeeeee "+localStorage.getItem("token"));
        let response = await fetch(this.API_URL + "/songsuser/ " + this.PlaylistID, {
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
    addPlaylistSongs() {
        while (this.dom_Table.childNodes.length > 1) {
            this.dom_Table.removeChild(this.dom_Table.lastChild);
        }
        for (let i = 0; i < this.Playlist.songs.length; i++) {
            const dom_TableData = document.createElement('tr');
            dom_TableData.classList.add('TableDataRow');
            this.dom_Table.appendChild(dom_TableData);
            dom_TableData.addEventListener('click', () => {
                let clicked = dom_TableData.rowIndex - 1;
                console.log(clicked);
                console.log(this.Playlist.songs[clicked].ID);
                this.audioPlayer.loadSong(clicked);
            });
            console.log("PlaylistTable.ts: this.Playlist[i].Title = ", this.Playlist.songs[i].TITLE);
            const dom_TableDataTitle = document.createElement('td');
            dom_TableDataTitle.classList.add('TableData');
            dom_TableData.appendChild(dom_TableDataTitle);
            dom_TableDataTitle.textContent = this.Playlist.songs[i].TITLE;
            const dom_TableDataArtist = document.createElement('td');
            dom_TableDataArtist.classList.add('TableData');
            dom_TableData.appendChild(dom_TableDataArtist);
            dom_TableDataArtist.textContent = this.Playlist.songs[i].ARTIST;
            const dom_TableDataSupportedBy = document.createElement('td');
            dom_TableDataSupportedBy.classList.add('TableData');
            dom_TableData.appendChild(dom_TableDataSupportedBy);
            dom_TableDataSupportedBy.textContent = this.Playlist.songs[i].SUPPORTED_BY;
        }
    }
    close() {
        this.dom_divTable.remove();
    }
}
//# sourceMappingURL=PlaylistTable.js.map
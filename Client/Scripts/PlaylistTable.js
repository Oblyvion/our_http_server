const API_URL = 'http://localhost:3001';
export class PlaylistTable {
    constructor(dom_root, dom_content, PlaylistData) {
        this.Playlist = {
            name: "",
            songs: [],
        };
        this.filestoSend = [];
        this.dom_root = dom_root;
        this.dom_content = dom_content;
        this.PlaylistID = PlaylistData.ID;
        console.log("Playlist ID: IST DAS HIER: ", this.PlaylistID);
        this.Playlist.name = PlaylistData.NAME;
        this.fetchPlaylistSongs().then((result) => {
            this.Playlist.songs = result.data;
            console.log("das SIND DIE SONGS: ", this.Playlist.songs);
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
        this.dom_DropdownMenuContent = document.createElement('div');
        this.dom_DropdownMenu.appendChild(this.dom_DropdownMenuContent);
        this.dom_DropdownMenuContent.classList.add("ShareDropdownMenuContent");
        this.dom_DropdownMenuInput = document.createElement('input');
        this.dom_DropdownMenu.appendChild(this.dom_DropdownMenuInput);
        this.dom_DropdownMenuInput.classList.add("ShareDropdownMenuData");
        this.dom_DropdownMenuInput.setAttribute('type', "text");
        this.dom_DropdownMenuInput.onkeyup = () => {
            console.log("EVENT!!!!");
            if (this.dom_DropdownMenuContent.firstChild) {
                this.dom_DropdownMenuContent.removeChild(this.dom_DropdownMenuContent.firstChild);
            }
            for (let j = 0; j < this.Mates.length; j++) {
                for (let i = 0; i < this.dom_DropdownMenuInput.value.length; i++) {
                    console.log("Das ist elemNAME: " + this.Mates[j].NAME[i] + " und das ist value: " + this.dom_DropdownMenuInput.value[i]);
                    if (this.Mates[j].NAME[i] === this.dom_DropdownMenuInput.value[i]) {
                        // if (this.dom_DropdownMenuData) {
                        //     this.dom_DropdownMenuData.remove();
                        // }
                        console.log("hallo add menu content");
                        this.dom_DropdownMenuData = document.createElement('a');
                        this.dom_DropdownMenuData.textContent = this.Mates[j].NAME;
                        this.dom_DropdownMenuData.classList.add('ShareDropdownMenuData');
                        this.dom_DropdownMenuData.setAttribute('href', '#');
                        this.dom_DropdownMenuData.addEventListener('click', () => {
                        });
                        this.dom_DropdownMenuContent.appendChild(this.dom_DropdownMenuData);
                    }
                    else {
                        if (this.dom_DropdownMenuContent.firstChild) {
                            this.dom_DropdownMenuContent.removeChild(this.dom_DropdownMenuContent.firstChild);
                        }
                    }
                }
            }
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
        this.dom_AddNewSongForm.classList.add('AddNewSongForm');
        this.dom_AddNewSongForm.setAttribute("enctype", "multipart/form-data");
        this.dom_AddNewSongForm.setAttribute("method", "post");
        this.dom_AddNewSongForm.setAttribute("id", "INPUTFORM");
        //this.dom_AddNewSongForm.setAttribute("name", "fileSong");
        //this.dom_AddNewSongForm.setAttribute("action", API_URL + "/song/global/" + this.PlaylistID);
        this.dom_divTable.appendChild(this.dom_AddNewSongForm);
        // this.dom_AddNewSongForm.addEventListener('onsubmit', () => {
        //     console.log("hallo");
        //     this.uploadNewSong().then( response => {
        //         console.log(response);
        //     }).catch( err => {
        //         console.log(err);
        //     })
        // });
        this.dom_AddNewSong = document.createElement("div");
        this.dom_AddNewSong.classList.add('AddNewSongDiv');
        this.dom_AddNewSongForm.appendChild(this.dom_AddNewSong);
        this.dom_AddNewSongInput = document.createElement("input");
        this.dom_AddNewSongInput.classList.add('AddNewSongInput');
        this.dom_AddNewSong.appendChild(this.dom_AddNewSongInput);
        this.dom_AddNewSongDialogButton = document.createElement("input");
        this.dom_AddNewSongDialogButton.setAttribute("type", "file");
        this.dom_AddNewSongDialogButton.setAttribute("id", "file");
        this.dom_AddNewSongDialogButton.setAttribute("name", "fileSong");
        this.dom_AddNewSongDialogButton.type = "file";
        this.dom_AddNewSongDialogButton.classList.add('AddNewSongDialogButton');
        this.dom_AddNewSong.appendChild(this.dom_AddNewSongDialogButton);
        this.dom_AddNewSongDialogButton.addEventListener('change', async () => {
            try {
                this.files = document.querySelector('[type=file]').files;
                console.log("PlaylistTable.ts, Z.137: THIS.FILES = ", this.files);
                this.reader = new FileReader();
                this.reader.onload = await function () {
                    console.log("REEEEEADER!", this.result);
                    //     array = new Uint8Array(arrayBuffer),
                    //     binaryString = String.fromCharCode.apply(null, array);
                    //
                    // console.log(binaryString);
                    return this.result;
                };
                this.reader.readAsArrayBuffer(this.files[0]);
                this.formData = new FormData();
                for (let i = 0; i < this.files.length; i++) {
                    let file = this.files[i];
                    this.filestoSend[i] = this.files[i];
                    if (file.type != "audio/mpeg") {
                        alert('Error : Incorrect file type');
                        throw "You can only upload Audio files!";
                    }
                    else if (file.name.length < 2) {
                        throw "Your upload has a not allowed name!";
                    }
                    else {
                        this.formData.append('files[]', file);
                        console.log("DAS IST FORM DATA, Z.180: ", this.formData.get("files[]"));
                    }
                }
                // This code is only for demo ...
                console.log("name : " + this.files[0].name);
                console.log("size : " + this.files[0].size);
                console.log("type : " + this.files[0].type);
                console.log("date : " + this.files[0].lastModified);
            }
            catch (err) {
                console.log("Error: ", err);
            }
        }, false);
        this.dom_AddNewSongSubmit = document.createElement("button");
        this.dom_AddNewSongSubmit.classList.add('AddNewSongSubmit');
        this.dom_AddNewSong.appendChild(this.dom_AddNewSongSubmit);
        this.dom_AddNewSongSubmit.textContent = "Submit";
        this.dom_AddNewSongSubmit.addEventListener('click', () => {
            this.uploadNewSong().then(response => {
                console.log(response);
                this.Playlist.songs.push(response);
                this.fetchPlaylistSongs().then((result) => {
                    this.Playlist.songs = result.data;
                    console.log("das SIND DIE SONGS: ", this.Playlist.songs);
                    this.addPlaylistSongs();
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                console.log(err);
            });
        });
    }
    async fetchPlaylistMates() {
        try {
            let response = await fetch(API_URL + "/playlistMates ", {
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
        console.log("this.PlaylistID = ", this.PlaylistID);
        //try {
        // console.log(`das ist body name: ${this.dom_loginInputID.value}`);
        // console.log(`das ist body pw: ${password.toString()}`);
        // console.log("hallo hier local storageeeeee "+localStorage.getItem("token"));
        let response = await fetch(API_URL + "/songsuser/ " + this.PlaylistID, {
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
        if (this.dom_Table.firstChild) {
            this.dom_Table.firstChild.remove();
        }
        for (let i = 0; i < this.Playlist.songs.length; i++) {
            const dom_TableData = document.createElement('tr');
            dom_TableData.classList.add('TableDataRow');
            this.dom_Table.appendChild(dom_TableData);
            dom_TableData.addEventListener('click', () => {
                let clicked = dom_TableData.rowIndex - 1;
                console.log(clicked);
                for (let i = 0; i < this.audioPlayer.Songs.length; i++) {
                    console.log(this.audioPlayer.Songs[i]);
                    console.log(this.Playlist.songs[clicked].Title);
                    if (this.audioPlayer.Songs[i] === this.Playlist.songs[clicked].Title) {
                        this.audioPlayer.loadSong(clicked);
                        this.audioPlayer.playorpauseSong();
                    }
                }
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
    async uploadNewSong() {
        try {
            //console.log("das ist form data kurz vorm absenden: ", this.formData.get('files[]'));
            //this.filestoSend = this.formData.getAll('files[]');
            console.log("das ist files to send!", this.reader.result);
            this.filestoSend[0] = this.reader.result;
            let response = await fetch(API_URL + "/song/global/" + this.PlaylistID, {
                body: JSON.stringify({
                    //files: this.formData,
                    files: this.formData,
                }),
                cache: 'no-cache',
                headers: {
                    //'enctype': 'multipart/form-data',
                    'content-type': 'multipart/form-data',
                    'crossDomain': 'true',
                    'Authorization': localStorage.getItem("token")
                },
                method: 'POST',
                mode: 'cors',
            });
            const data = await response.json();
            return data;
        }
        catch (err) {
            console.log("Error: ", err);
        }
    }
    close() {
        this.dom_divTable.remove();
    }
}
//# sourceMappingURL=PlaylistTable.js.map
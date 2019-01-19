const API_URL = 'http://localhost:3000';
export class PlaylistTable {
    constructor(dom_root, dom_content, PlaylistData) {
        this.SongObject = {
            Title: "Bad_Habit_Terrasound.mp3",
            Artist: "Terrasound",
            AddedBy: "fliesentischbesitzerklaus25",
        };
        this.SongObject1 = {
            Title: "Dark_Blue_Echoes.mp3",
            Artist: "Terrasound",
            AddedBy: "fliesentischbesitzerklaus25",
        };
        this.Playlist = {
            name: "",
            songs: [this.SongObject, this.SongObject1],
        };
        this.dom_root = dom_root;
        this.dom_content = dom_content;
        this.PlaylistID = PlaylistData.ID;
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
        this.dom_divPlaylistHeaderAddBtn = document.createElement('img');
        this.dom_divPlaylistHeaderAddBtn.classList.add('PlaylistTablePlaylistHeaderAddBtn');
        this.dom_divPlaylistHeaderButtons.appendChild(this.dom_divPlaylistHeaderAddBtn);
        this.dom_divPlaylistHeaderAddBtn.src = "./Images/add_button.png";
        this.dom_divPlaylistHeaderAddBtn.style.width = "20px";
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
    }
    async fetchPlaylistSongs() {
        //try {
        // console.log(`das ist body name: ${this.dom_loginInputID.value}`);
        // console.log(`das ist body pw: ${password.toString()}`);
        // console.log("hallo hier local storageeeeee "+localStorage.getItem("token"));
        let response = await fetch(API_URL + "/playlist/" + this.PlaylistID, {
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
        for (let i = 0; i < this.Playlist.songs.length; i++) {
            const dom_TableData = document.createElement('tr');
            dom_TableData.classList.add('TableDataRow');
            this.dom_Table.appendChild(dom_TableData);
            dom_TableData.addEventListener('click', () => {
                let clicked = dom_TableData.rowIndex - 1;
                console.log(clicked);
                for (let i = 0; i < this.audioPlayer.Songs.length; i++) {
                    console.log(this.audioPlayer.Songs[i]);
                    console.log(this.Playlist[clicked].Title);
                    if (this.audioPlayer.Songs[i] === this.Playlist[clicked].Title) {
                        this.audioPlayer.loadSong(clicked);
                        this.audioPlayer.playorpauseSong();
                    }
                }
            });
            const dom_TableDataTitle = document.createElement('td');
            dom_TableDataTitle.classList.add('TableData');
            dom_TableData.appendChild(dom_TableDataTitle);
            dom_TableDataTitle.textContent = this.Playlist.songs[i].Title;
            const dom_TableDataArtist = document.createElement('td');
            dom_TableDataArtist.classList.add('TableData');
            dom_TableData.appendChild(dom_TableDataArtist);
            dom_TableDataArtist.textContent = this.Playlist.songs[i].Artist;
            const dom_TableDataAddedBy = document.createElement('td');
            dom_TableDataAddedBy.classList.add('TableData');
            dom_TableData.appendChild(dom_TableDataAddedBy);
            dom_TableDataAddedBy.textContent = this.Playlist[i].AddedBy;
        }
    }
    close() {
        this.dom_divTable.remove();
    }
}
//# sourceMappingURL=PlaylistTable.js.map
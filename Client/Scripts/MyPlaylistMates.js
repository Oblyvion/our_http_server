import { NewPlaylistMate } from "./NewPlaylistMate.js";
import { manager } from "./app.js";
const API_URL = 'http://localhost:3000';
export class MyPlaylistMates {
    constructor(dom_root, dom_content) {
        this.dom_root = dom_root;
        this.dom_content = dom_content;
        this.fetchPlaylistMates().then((result) => {
            this.Mates = result.data;
            console.log("Das sind die Freunde: ", this.Mates);
            this.addMatesToTable();
        }).catch(err => {
            console.log(err);
        });
        this.dom_divPlaylistMates = document.createElement('div');
        this.dom_divPlaylistMates.classList.add('PlaylistMatesDiv');
        this.dom_content.appendChild(this.dom_divPlaylistMates);
        this.dom_divMatesHeader = document.createElement('div');
        this.dom_divMatesHeader.classList.add('PlaylistMatesHeaderDiv');
        this.dom_divPlaylistMates.appendChild(this.dom_divMatesHeader);
        this.dom_divMatesHeaderName = document.createElement('div');
        this.dom_divMatesHeaderName.classList.add('PlaylistMatesHeaderName');
        this.dom_divMatesHeader.appendChild(this.dom_divMatesHeaderName);
        this.dom_divMatesHeaderName.textContent = "Your Playlist Mates";
        this.dom_divMatesHeaderButtons = document.createElement('div');
        this.dom_divMatesHeaderButtons.classList.add('PlaylistMatesHeaderButtonDiv');
        this.dom_divMatesHeader.appendChild(this.dom_divMatesHeaderButtons);
        this.dom_MatesHeaderAddBtn = document.createElement('img');
        this.dom_MatesHeaderAddBtn.classList.add('PlaylistMatesHeaderAddBtn');
        this.dom_divMatesHeaderButtons.appendChild(this.dom_MatesHeaderAddBtn);
        this.dom_MatesHeaderAddBtn.src = "./Images/add_button.png";
        this.dom_MatesHeaderAddBtn.style.width = "20px";
        this.dom_MatesHeaderAddBtn.addEventListener('click', () => {
            new manager("page_first_steps");
            document.getElementById("header").textContent = "Music Playlist New Playlist Mate";
            new NewPlaylistMate(this.dom_root, this.dom_content);
        });
        this.dom_Table = document.createElement('table');
        this.dom_Table.classList.add('MatesTable');
        this.dom_divPlaylistMates.appendChild(this.dom_Table);
        this.dom_Table.cellSpacing = "0";
        this.dom_Table.cellPadding = "0";
        this.dom_TableHeader = document.createElement('tr');
        this.dom_TableHeader.classList.add('TableHeaderRow');
        this.dom_Table.appendChild(this.dom_TableHeader);
        this.dom_TableHeaderName1 = document.createElement('th');
        this.dom_TableHeaderName1.classList.add('TableHeader');
        this.dom_TableHeader.appendChild(this.dom_TableHeaderName1);
        this.dom_TableHeaderName1.textContent = "Playlist-Mate Name";
        this.dom_TableHeaderName2 = document.createElement('th');
        this.dom_TableHeaderName2.classList.add('TableHeader');
        this.dom_TableHeader.appendChild(this.dom_TableHeaderName2);
        this.dom_TableHeaderName2.textContent = "Shared Playlists";
        this.dom_TableHeaderName3 = document.createElement('th');
        this.dom_TableHeaderName3.classList.add('TableHeader');
        this.dom_TableHeader.appendChild(this.dom_TableHeaderName3);
        this.dom_TableHeaderName3.textContent = "Score";
    }
    async fetchPlaylistMates() {
        try {
            let response = await fetch(API_URL + "/friends/ ", {
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
            console.log("Error fetching Friends!: ", err);
        }
    }
    addMatesToTable() {
        for (let i = 0; i < this.Mates.length; i++) {
            const dom_TableData = document.createElement('tr');
            dom_TableData.classList.add('TableDataRow');
            this.dom_Table.appendChild(dom_TableData);
            const dom_TableDataName = document.createElement('td');
            dom_TableDataName.classList.add('TableData');
            dom_TableData.appendChild(dom_TableDataName);
            dom_TableDataName.textContent = this.Mates[i].NAME;
            const dom_TableDataSharedPlaylists = document.createElement('td');
            dom_TableDataSharedPlaylists.classList.add('TableData');
            dom_TableData.appendChild(dom_TableDataSharedPlaylists);
            dom_TableDataSharedPlaylists.textContent = this.Mates[i].SHARED_PLAYLISTS;
            const dom_TableDataScore = document.createElement('td');
            dom_TableDataScore.classList.add('TableData');
            dom_TableData.appendChild(dom_TableDataScore);
            dom_TableDataScore.textContent = this.Mates[i].SCORE;
        }
    }
    close() {
        while (this.dom_content.firstChild) {
            this.dom_content.removeChild(this.dom_content.firstChild);
        }
    }
}
//# sourceMappingURL=MyPlaylistMates.js.map
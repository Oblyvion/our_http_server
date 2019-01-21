const API_URL = 'http://localhost:3000';
export class NewPlaylistMate {
    constructor(dom_root, dom_content) {
        this.dom_root = dom_root;
        this.dom_content = dom_content;
        this.fetchPlaylistMates().then((result) => {
            this.Mates = result.data;
            console.log("Das sind die Mates: ", this.Mates);
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
        this.dom_divNewMateHeaderName.textContent = "Want to find a new mate?";
        this.dom_NewPlaylistMateContainer = document.createElement('div');
        this.dom_NewPlaylistMateContainer.classList.add('NewPlaylistMateContainer');
        this.dom_divNewPlaylistMate.appendChild(this.dom_NewPlaylistMateContainer);
        // this.dom_divMatesHeaderButtons = document.createElement('div');
        // this.dom_divMatesHeaderButtons.classList.add('PlaylistMatesHeaderButtonDiv');
        // this.dom_divNewMateHeader.appendChild(this.dom_divMatesHeaderButtons);
        //
        // this.dom_MatesHeaderAddBtn = document.createElement('img');
        // this.dom_MatesHeaderAddBtn.classList.add('PlaylistMatesHeaderAddBtn');
        // this.dom_divMatesHeaderButtons.appendChild(this.dom_MatesHeaderAddBtn);
        // this.dom_MatesHeaderAddBtn.src = "./Images/add_button.png";
        // this.dom_MatesHeaderAddBtn.style.width = "20px";
        // this.dom_Table = document.createElement('table');
        // this.dom_Table.classList.add('MatesTable');
        // this.dom_divNewPlaylistMate.appendChild(this.dom_Table);
        // this.dom_Table.cellSpacing = "0";
        // this.dom_Table.cellPadding = "0";
        //
        // this.dom_TableHeader = document.createElement('tr');
        // this.dom_TableHeader.classList.add('TableHeaderRow');
        // this.dom_Table.appendChild(this.dom_TableHeader);
        //
        // this.dom_TableHeaderName1 = document.createElement('th');
        // this.dom_TableHeaderName1.classList.add('TableHeader');
        // this.dom_TableHeader.appendChild(this.dom_TableHeaderName1);
        // this.dom_TableHeaderName1.textContent = "Playlist-Mate Name";
        //
        // this.dom_TableHeaderName2 = document.createElement('th');
        // this.dom_TableHeaderName2.classList.add('TableHeader');
        // this.dom_TableHeader.appendChild(this.dom_TableHeaderName2);
        // this.dom_TableHeaderName2.textContent = "Shared Playlists";
        //
        // this.dom_TableHeaderName3 = document.createElement('th');
        // this.dom_TableHeaderName3.classList.add('TableHeader');
        // this.dom_TableHeader.appendChild(this.dom_TableHeaderName3);
        // this.dom_TableHeaderName3.textContent = "Score";
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
    close() {
        while (this.dom_content.firstChild) {
            this.dom_content.removeChild(this.dom_content.firstChild);
        }
    }
}
//# sourceMappingURL=NewPlaylistMate.js.map
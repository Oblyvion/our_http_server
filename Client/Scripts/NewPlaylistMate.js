const API_URL = 'http://localhost:3001';
export class NewPlaylistMate {
    constructor(dom_root, dom_content) {
        this.randomIndex = [];
        this.topWerte = [];
        this.leftWerte = [];
        this.dom_root = dom_root;
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
                            console.log("hallo hier if remove!");
                            this.dom_NewMatesSearchMenuContent.children[i].remove();
                        }
                    }
                    this.dom_NewMatesSearchMenuData = document.createElement('a');
                    this.dom_NewMatesSearchMenuData.textContent = this.Users[j].NAME;
                    this.dom_NewMatesSearchMenuData.classList.add('NewMatesSearchMenuData');
                    this.dom_NewMatesSearchMenuData.setAttribute('href', '#');
                    this.dom_NewMatesSearchMenuData.addEventListener('click', () => {
                    });
                    this.dom_NewMatesSearchMenuContent.appendChild(this.dom_NewMatesSearchMenuData);
                }
                else {
                    console.log("hallo hier else!");
                    for (let i = 0; i < this.dom_NewMatesSearchMenuContent.children.length; i++) {
                        if (this.dom_NewMatesSearchMenuContent.children[i].textContent === this.Users[j].NAME) {
                            console.log("hallo hier else remove!");
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
    addRandomContent() {
        let added;
        let dom_NewRandomMate;
        for (let i = 0; i < 10; i++) {
            added = false;
            let random = Math.floor(Math.random() * (this.Users.length - 1));
            console.log("random: ", random);
            if (i === 0) {
                this.randomIndex.push(random);
                console.log("i === 0 added");
            }
            if (this.randomIndex.includes(random) && i !== 0) {
                while (this.randomIndex.includes(random)) {
                    let newrandom = Math.floor(Math.random() * (this.Users.length - 1));
                    // console.log("random new: ", newrandom);
                    if (!this.randomIndex.includes(newrandom)) {
                        // console.log("crazy added");
                        this.randomIndex.push(newrandom);
                        break;
                    }
                }
            }
            if (!this.randomIndex.includes(random) && i !== 0) {
                console.log("normal added");
                this.randomIndex.push(random);
            }
            console.log("randomarray: ", this.randomIndex);
            dom_NewRandomMate = document.createElement('a');
            this.dom_NewMatesRandomDivContent.appendChild(dom_NewRandomMate);
            dom_NewRandomMate.classList.add("NewRandomMate");
            dom_NewRandomMate.textContent = this.Users[this.randomIndex[i]].NAME;
            let randomMarginWidth = Math.floor(Math.random() * (90));
            this.checkIfRandomInArray(this.leftWerte, randomMarginWidth, i);
            let randomMarginHeight = Math.floor(Math.random() * (90));
            this.checkIfRandomInArray(this.topWerte, randomMarginHeight, i);
            console.log("margintop: und marginleft; ", this.topWerte[i].toString() + "%", this.leftWerte[i].toString() + "%");
            dom_NewRandomMate.style.top = this.topWerte[i].toString() + "%";
            dom_NewRandomMate.style.left = this.leftWerte[i].toString() + "%";
        }
    }
    async fetchUsers() {
        try {
            let response = await fetch(API_URL + "/users ", {
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
            console.log("Error fetching Users!: ", err);
        }
    }
    close() {
        while (this.dom_content.firstChild) {
            this.dom_content.removeChild(this.dom_content.firstChild);
        }
    }
    checkIfRandomInArray(array, random, i) {
        if (i === 0) {
            array.push(random);
        }
        if (array.includes(random) && i !== 0) {
            while (array.includes(random)) {
                let newrandom = Math.floor(Math.random() * (80));
                // console.log("random new: ", newrandom);
                if (!array.includes(newrandom)) {
                    array.push(newrandom);
                    break;
                }
            }
        }
        if (!array.includes(random) && i !== 0) {
            array.push(random);
        }
    }
}
//# sourceMappingURL=NewPlaylistMate.js.map
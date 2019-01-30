import {NewPlaylistMate} from "./NewPlaylistMate.js";
import {manager} from "./app.js";

/**
 * @class MyPlaylistMates
 * Erzeugt die MyPlaylistMates Seite, welche die Playlist-Mates eines Benutzers anzeigt.
 */
export class MyPlaylistMates {
    private API_URL = 'http://localhost:3000';
    private dom_content: HTMLElement;
    private dom_divPlaylistMates: HTMLDivElement;
    private dom_divMatesHeader: HTMLDivElement;
    private dom_Table: HTMLTableElement;
    private dom_TableHeader: HTMLTableRowElement;
    private dom_TableHeaderName1: HTMLTableCaptionElement;
    private dom_TableHeaderName2: HTMLTableCaptionElement;
    private dom_TableHeaderName3: HTMLTableCaptionElement;
    private dom_divMatesHeaderButtons: HTMLElement;
    private dom_MatesHeaderAddBtn: HTMLImageElement;
    private dom_divMatesHeaderName: HTMLDivElement;

    private Mates;
    private sharedPlaylists = [];

    /**
     * @constructor MyPlaylistMates
     * Konstruiert den Table der die Mates anzeigt
     *
     * @param dom_content - Stelle an der der Content der Seite angehängt wird
     */
    constructor(dom_content) {
        this.dom_content = dom_content;
        this.fetchPlaylistMates().then((result) => {
            this.Mates = result.data;
            console.log("Das sind die Mates: ", this.Mates);
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
            new NewPlaylistMate(this.dom_content);
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

    /**
     * @async fetchPlaylistMates()
     * Ruft die Route /playlistMates des Servers auf, welcher darauf die Playlist Mates
     * des Users liefert, der gerade angemeldet ist.
     * Diese Daten werden bei onfullfilled in den Array Mates geschrieben
     *
     * Method: GET
     */
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
        } catch (err) {
            console.log("Error fetching Mates!: ", err);
        }
    }

    /**
     * @async fetchSharedPlaylistsProMate()
     * Ruft die Route /playlistMates/sharedPlaylists/ des Servers auf, welcher darauf für
     * jeden einzelnen Playlist-Mate die Anzahl an Shared Playlists zwischen Ihm und dem angemeldeten User zurückliefert
     * Diese Daten werden bei onfullfilled in den Array sharedPlaylists geschrieben
     *
     * Method: GET
     */
    async fetchSharedPlaylistsProMate(mate) {
        try {
            //console.log("Das ist mate: ", mate);
            let response = await fetch(this.API_URL + "/playlistMates/sharedPlaylists/" + mate, {
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
        } catch (err) {
            console.log("Error fetching Mates!: ", err);
        }
    }

    /**
     * @function addMatesToTable()
     * In der Funktion addMatesToTable werden alle bisher gefetchten Daten in die Tabelle übertragen
     * dabei werden die Arrays durchlaufen und neue TableDataRows erzeugt. Die einzelnen TableDatas werden erzeugt mit den
     * Werten die sie beinhalten sollen besetzt und in die dafür vorgesehenen Spalten eingesetzt
     */
    addMatesToTable() {
        for (let i = 0; i < this.Mates.length; i++) {
            if (this.Mates[i].REQUEST === 1) {
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

                //console.log("Das ist i: ", i);
                this.fetchSharedPlaylistsProMate(this.Mates[i].NAME).then((result) => {
                    // console.log("Das ist RESULT!: ", result.data);
                    // console.log("Das sind die sharedplaylist counts: ", result.data.countSharedPlaylists);
                    this.sharedPlaylists.push(result.data.countSharedPlaylists);
                    if (this.sharedPlaylists[i] > 0) {
                        dom_TableDataSharedPlaylists.textContent = this.sharedPlaylists[i];
                    } else {
                        dom_TableDataSharedPlaylists.textContent = "-";
                        dom_TableDataSharedPlaylists.style.fontWeight = "bold";
                    }
                }).catch(err => {
                    console.log(err);
                });

                const dom_TableDataScore = document.createElement('td');
                dom_TableDataScore.classList.add('TableData');
                dom_TableData.appendChild(dom_TableDataScore);
                if (this.Mates[i].SCORE > 0) {
                    dom_TableDataScore.textContent = this.Mates[i].SCORE;
                } else {
                    dom_TableDataScore.textContent = "-";
                    dom_TableDataScore.style.fontWeight = "bold";
                }
            }
        }
    }

    /**
     * @function close()
     *
     * Entfernt den Content indem alle childNodes entfernt werden
     *
     */
    close() {
        while (this.dom_content.firstChild) {
            this.dom_content.removeChild(this.dom_content.firstChild);
        }
    }
}
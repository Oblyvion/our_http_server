/**
 * @class RequestPage
 * Die class RequestPage konstruiert die Page um PlaylistMate Anfragen zu bestätigen.
 */
export class RequestPage {
    private API_URL = 'http://localhost:' + localStorage.getItem("port");

    private dom_root: HTMLElement;
    private dom_content: HTMLElement;
    private dom_divRequestPage: HTMLDivElement;
    private dom_divRequestHeader: HTMLDivElement;
    private dom_divRequestHeaderName: HTMLDivElement;
    private dom_RequestContainer: HTMLDivElement;
    private dom_RequestContainerData: HTMLDivElement;
    private dom_RequestContainerDataName: HTMLDivElement;
    private dom_RequestContainerDataScore: HTMLDivElement;
    private dom_RequestContainerDataAccept: HTMLInputElement;
    private dom_RequestContainerDataDecline: HTMLInputElement;
    private dom_RequestContainerDataSend: HTMLButtonElement;

    private Requests;
    private dom_RequestContainerDataAcceptDiv: HTMLDivElement;
    private dom_RequestContainerDataAcceptLabel: HTMLElement;
    private dom_RequestContainerDataDeclineDiv: HTMLDivElement;
    private dom_RequestContainerDataDeclineLabel: HTMLElement;
    private dom_RequestContainerDataForm: HTMLFormElement;


    /**
     * @constructor RequestPage
     * Der constructor der RequestPage erzeugt alle für das Grundgerüst der Seite wichtigen DOM Elemente die für die Seite benötigt werden und
     * hängt diese dem dom_content an
     *
     * @param dom_content
     */
    constructor(dom_content) {
        this.dom_content = dom_content;
        this.fetchRequests().then((result) => {
            this.Requests = result.data;
            //console.log("Das sind die Requests: ", this.Requests);
            this.addRequestContainers();
        }).catch(err => {
            console.log(err);
        });

        this.dom_divRequestPage = document.createElement('div');
        this.dom_divRequestPage.classList.add('RequestPageDiv');
        this.dom_content.appendChild(this.dom_divRequestPage);

        this.dom_divRequestHeader = document.createElement('div');
        this.dom_divRequestHeader.classList.add('RequestHeader');
        this.dom_divRequestPage.appendChild(this.dom_divRequestHeader);

        this.dom_divRequestHeaderName = document.createElement('div');
        this.dom_divRequestHeaderName.classList.add('RequestHeaderName');
        this.dom_divRequestHeader.appendChild(this.dom_divRequestHeaderName);
        this.dom_divRequestHeaderName.textContent = "Your playlist mate requests";

        this.dom_RequestContainer = document.createElement('div');
        this.dom_RequestContainer.classList.add('RequestContainer');
        this.dom_divRequestPage.appendChild(this.dom_RequestContainer);


    }

    /**
     * @async fetchPlaylistMates()
     * Ruft die Route /playlistMates des Servers auf, welcher darauf die Playlist Mates
     * des Users liefert, der gerade angemeldet ist.
     * In diesen Daten der User befindet sich auch der Wert dafür, ob eine RequestAnfrage gestellt wurde oder nicht.
     * Diese Daten werden bei onfullfilled in den Array Mates geschrieben
     *
     * Method: GET
     */
    async fetchRequests() {
        try {
            let response = await fetch(this.API_URL + "/playlistMates", {
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

            //console.log("das ist die Antwort des Servers auf fetch /users : ", data);

            return data;
        } catch (err) {
            console.log("Error fetching Users!: ", err);
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

    /**
     * @function addRequestContainers()
     * Die Funktion addRequestContainers() fügt jeden einzelnen Mate aus Mates hinzu, bei dem REQUEST (abgefragt vom Server) auf
     * 0 steht, diese User haben eine Anfrage an den angemeldeten Benutzer gesendet.
     */
    private addRequestContainers() {
        for(let i = 0; i < this.Requests.length; i++) {
            if(this.Requests[i].REQUEST === 0) {
                this.dom_RequestContainerData = document.createElement('div');
                this.dom_RequestContainerData.classList.add('RequestContainerData');
                this.dom_RequestContainer.appendChild(this.dom_RequestContainerData);

                this.dom_RequestContainerDataName = document.createElement('div');
                this.dom_RequestContainerDataName.classList.add('RequestContainerDataName');
                this.dom_RequestContainerData.appendChild(this.dom_RequestContainerDataName);
                this.dom_RequestContainerDataName.textContent = this.Requests[i].NAME;

                this.dom_RequestContainerDataScore = document.createElement('div');
                this.dom_RequestContainerDataScore.classList.add('RequestContainerDataScore');
                this.dom_RequestContainerData.appendChild(this.dom_RequestContainerDataScore);
                this.dom_RequestContainerDataScore.textContent = this.Requests[i].SCORE;

                this.dom_RequestContainerDataForm = document.createElement('form');
                this.dom_RequestContainerDataForm.classList.add('RequestContainerDataForm');
                this.dom_RequestContainerData.appendChild(this.dom_RequestContainerDataForm);
                this.dom_RequestContainerDataForm.setAttribute("id", "Form");
                this.dom_RequestContainerDataForm.addEventListener("onSubmit", event => {
                    event.preventDefault();
                    return false;
                });

                this.dom_RequestContainerDataAcceptDiv = document.createElement('div');
                this.dom_RequestContainerDataAcceptDiv.classList.add('RequestContainerDataAcceptDiv');
                this.dom_RequestContainerDataForm.appendChild(this.dom_RequestContainerDataAcceptDiv);

                this.dom_RequestContainerDataAcceptLabel = document.createElement('label');
                this.dom_RequestContainerDataAcceptLabel.setAttribute("for", "accept");
                this.dom_RequestContainerDataAcceptLabel.classList.add('RequestContainerDataAcceptLabel');
                this.dom_RequestContainerDataAcceptDiv.appendChild(this.dom_RequestContainerDataAcceptLabel);
                this.dom_RequestContainerDataAcceptLabel.textContent = "accept";

                this.dom_RequestContainerDataAccept = document.createElement('input');
                this.dom_RequestContainerDataAccept.setAttribute("type", "radio");
                this.dom_RequestContainerDataAccept.setAttribute("name", "radiobtn");
                this.dom_RequestContainerDataAccept.setAttribute("id", "accept");
                this.dom_RequestContainerDataAccept.setAttribute("value", "1");
                this.dom_RequestContainerDataAccept.classList.add('RequestContainerDataAccept');
                this.dom_RequestContainerDataAcceptDiv.appendChild(this.dom_RequestContainerDataAccept);

                this.dom_RequestContainerDataDeclineDiv = document.createElement('div');
                this.dom_RequestContainerDataDeclineDiv.classList.add('RequestContainerDataDeclineDiv');
                this.dom_RequestContainerDataForm.appendChild(this.dom_RequestContainerDataDeclineDiv);

                this.dom_RequestContainerDataDeclineLabel = document.createElement('label');
                this.dom_RequestContainerDataDeclineLabel.setAttribute("for", "decline");
                this.dom_RequestContainerDataDeclineLabel.classList.add('RequestContainerDataDeclineLabel');
                this.dom_RequestContainerDataDeclineDiv.appendChild(this.dom_RequestContainerDataDeclineLabel);
                this.dom_RequestContainerDataDeclineLabel.textContent = "decline";

                this.dom_RequestContainerDataDecline = document.createElement('input');
                this.dom_RequestContainerDataDecline.setAttribute("type", "radio");
                this.dom_RequestContainerDataDecline.setAttribute("name", "radiobtn");
                this.dom_RequestContainerDataDecline.setAttribute("id", "decline");
                this.dom_RequestContainerDataDecline.setAttribute("value", "0");
                this.dom_RequestContainerDataDecline.classList.add('RequestContainerDataDecline');
                this.dom_RequestContainerDataDeclineDiv.appendChild(this.dom_RequestContainerDataDecline);

                this.dom_RequestContainerDataSend = document.createElement('button');
                this.dom_RequestContainerDataSend.classList.add('RequestContainerDataSend');
                this.dom_RequestContainerData.appendChild(this.dom_RequestContainerDataSend);
                this.dom_RequestContainerDataSend.textContent = "Send Answer";
                this.dom_RequestContainerDataSend.addEventListener('click', (event) => {
                    //console.log(document.getElementById("Form").elements);
                    const form = <HTMLFormElement>document.getElementById("Form");
                    const elements = form.elements;
                    // @ts-ignore
                    if(elements[0].checked) {
                        //console.log("radio button accept 1");
                        this.sendRequestResponse(i, 1).then((result) => {
                            //console.log("Das ist /playlistmate/request: ", result);
                            alert("You have accepted the Request!");
                            this.dom_RequestContainerData.remove();
                        }).catch(err => {
                            console.log(err);
                        });
                    } else {
                        //console.log("radio button decline 0");
                        this.sendRequestResponse(i, 0).then((result) => {
                            //console.log("Das ist /playlistmate/request: ", result);
                            alert("You have declined the Request!");
                            this.dom_RequestContainerData.remove();

                        }).catch(err => {
                            console.log(err);
                        });
                    }
                })
            }
        }
    }


    /**
     * @async fetchAddCollabs()
     * Ruft die Route /playlistMates/request des Servers auf, welcher darauf dem mitgesendeten "Mate" eine Zusage auf seine
     * Anfrage gibt.
     *
     * @param index - index für den Mates Array um den richtigen Mate Namen mitzusenden
     * @param value - value den der User beim RadioButton aus Funktion addRequestContainers() ausgewählt hat
     * entweder angenommen = 1 oder abgelehnt = 0;
     *
     * Method: POST
     */
    async sendRequestResponse(index, value) {
        //console.log("Mates Name! ",this.Requests[index].NAME);
        try {
            let response = await fetch(this.API_URL + "/playlistMates/request", {
                body: JSON.stringify({
                    mate: this.Requests[index].NAME,
                    answer: value
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

                const data = await response.json();

                //console.log("das ist die Antwort des Servers auf fetch /playlistmate/request : ", data);

                return data;
        } catch (err) {
            console.log("Error fetching /playlistMates/request: ", err);
        }
    }

}
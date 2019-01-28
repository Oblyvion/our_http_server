export class RequestPage {
    constructor(dom_root, dom_content) {
        this.API_URL = 'http://localhost:' + localStorage.getItem("port");
        this.dom_root = dom_root;
        this.dom_content = dom_content;
        this.fetchRequests().then((result) => {
            this.Requests = result.data;
            console.log("Das sind die Requests: ", this.Requests);
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
            console.log("das ist die antwort des Servers auf fetch /users : ", data);
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
    addRequestContainers() {
        for (let i = 0; i < this.Requests.length; i++) {
            if (this.Requests[i].REQUEST === 0) {
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
                this.dom_RequestContainerDataForm.addEventListener("submit", this.processForm);
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
                    const form = document.getElementById("Form");
                    if (form.elements[0].checked) {
                        console.log("radio button accept 1");
                        this.sendRequestResponse(i, 1).then((result) => {
                            console.log("Das ist /playlistmate/request: ", result);
                            alert("You have accepted the Request!");
                            this.dom_RequestContainerData.remove();
                        }).catch(err => {
                            console.log(err);
                        });
                    }
                    else {
                        console.log("radio button decline 0");
                        this.sendRequestResponse(i, 0).then((result) => {
                            console.log("Das ist /playlistmate/request: ", result);
                            alert("You have declined the Request!");
                            this.dom_RequestContainerData.remove();
                        }).catch(err => {
                            console.log(err);
                        });
                    }
                });
            }
        }
    }
    processForm(e) {
        if (e.preventDefault())
            e.preventDefault();
        // const radios = document.getElementsByName('radiobtn');
        //
        // for (let i = 0, length = radios.length; i < length; i++)
        // {
        //     if (radios[i].checked)
        //     {
        //         // do whatever you want with the checked radio
        //         alert(radios[i].value);
        //
        //         // only one radio can be logically checked, don't check the rest
        //         break;
        //     }
        // }
        /* do what you want with the form */
        // You must return false to prevent the default form behavior
        return false;
    }
    async sendRequestResponse(index, value) {
        console.log("Mates Name! ", this.Requests[index].NAME);
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
            console.log("das ist die antwort des Servers auf fetch /playlistmate/request : ", data);
            return data;
        }
        catch (err) {
            console.log("Error fetching /playlistMates/request!: ", err);
        }
    }
}
//# sourceMappingURL=RequestPage.js.map
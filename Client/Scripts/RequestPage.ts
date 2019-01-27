export class RequestPage {
    private API_URL = 'http://localhost:' + localStorage.getItem("port");

    private dom_root: HTMLElement;
    private dom_content: HTMLElement;
    private dom_divRequestPage: HTMLDivElement;
    private dom_divRequestHeader: HTMLDivElement;
    private dom_divRequestHeaderName: HTMLDivElement;
    private dom_RequestContainer: HTMLDivElement;

    private Requests;

    constructor(dom_root, dom_content) {
        this.dom_root = dom_root;
        this.dom_content = dom_content;
        this.fetchRequests().then((result) => {
            this.Requests = result.data;
            console.log("Das sind die Requests: ", this.Requests);
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
                // todo REST POST redirect
                // redirect: 'follow',
                // credentials: 'include',
            });

            const data = await response.json();

            console.log("das ist die antwort des Servers auf fetch /users : ", data);

            return data;
        } catch (err) {
            console.log("Error fetching Users!: ", err);
        }
    }


    close() {
        while (this.dom_content.firstChild) {
            this.dom_content.removeChild(this.dom_content.firstChild);
        }
    }
}
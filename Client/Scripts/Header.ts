import {manager} from "./app.js";
import {MyPlaylistMates} from "./MyPlaylistMates.js";
import {NewPlaylistMate} from "./NewPlaylistMate.js";
import {RequestPage} from "./RequestPage.js";

/**
 * @class Header
 * Generiert den Header für die gesamte Application
 */
export class Header {
    private dom_root: HTMLElement;
    private dom_header: HTMLElement;
    private dom_content: HTMLElement;
    private dom_about_contact_imp_container;
    private dom_about: HTMLElement;
    private dom_contact: HTMLElement;
    private dom_imp: HTMLElement;
    private dom_ButtonContainer: HTMLDivElement;
    private dom_HeaderAccountBttn: HTMLImageElement;
    private dom_HeaderMessageBttn: HTMLImageElement;
    private dom_DropdownMenu: HTMLDivElement;
    private dom_DropdownMenuContent: HTMLDivElement;
    private dom_DropdownMenuData0: HTMLElement;
    private dom_DropdownMenuData1: HTMLElement;
    private dom_DropdownMenuData2: HTMLElement;
    private dom_DropdownMenuData3: HTMLElement;
    private MyPlaylistMates: MyPlaylistMates;
    private Requests: RequestPage;

    /**
     * @constructor Header
     * Konstruiert den Header je nach dem was die Page für einen Header braucht werden Teile entfernt oder hinzugefügt
     *
     * @param dom_body - DOM Element, welches den gesamten Body der Website enthält
     * @param dom_content - Dom Element, welches dem Bereich unter dem Header zugeordnet wird
     */
    constructor(dom_body: HTMLElement, dom_content: HTMLElement) {
        this.dom_root = dom_body;
        this.dom_content = dom_content;
        this.dom_header = document.createElement('header');
        this.dom_header.setAttribute("id", "header");
        this.dom_root.appendChild(this.dom_header);
        this.set('');

        //Header Left
        this.dom_about_contact_imp_container = document.createElement('div');
        this.dom_root.appendChild(this.dom_about_contact_imp_container);
        this.dom_about_contact_imp_container.setAttribute("id", "InformationContainer");

        this.dom_about = document.createElement('a');
        this.dom_about.textContent = "About us";
        this.dom_about.classList.add('LinkHeader');
        this.dom_about.setAttribute('href', '#');
        this.dom_about.addEventListener('click', () => {
            new manager("about");
        });
        this.dom_about_contact_imp_container.appendChild(this.dom_about);

        this.dom_contact = document.createElement('a');
        this.dom_contact.textContent = "Contact";
        this.dom_contact.classList.add('LinkHeader');
        this.dom_contact.setAttribute('href', '#');
        this.dom_contact.addEventListener('click', () => {
            new manager("contact");
        });
        this.dom_about_contact_imp_container.appendChild(this.dom_contact);

        this.dom_imp = document.createElement('a');
        this.dom_imp.textContent = "Impressum";
        this.dom_imp.classList.add('LinkHeader');
        this.dom_imp.setAttribute('href', '#');
        this.dom_imp.addEventListener('click', () => {
            new manager("impressum");
        });
        this.dom_about_contact_imp_container.appendChild(this.dom_imp);

    }

    /**
     * @function set()
     *
     * setzt den Headertext
     * @param text - dieser Parameter wird an Music Playlist angehängt und ergibt zusammengefügt den Headertext
     */
    set(text: string) {
        this.dom_header.textContent = `Music Playlist ${text}`;
    }

    /**
     * @function removeRightButtons()
     * Entfernt die rechten Buttons, wenn eine Area betreten wird in der es sie nicht gibt zb. Login
     */
    removeRightButtons() {
        if (this.dom_ButtonContainer != undefined) {
            while (this.dom_ButtonContainer.firstChild) {
                this.dom_ButtonContainer.removeChild(this.dom_ButtonContainer.firstChild);
            }
            this.dom_ButtonContainer.remove();
            this.dom_DropdownMenuContent.remove();
        }
    }

    /**
     * @function setRightButtons()
     */
    setRightButtons() {
        this.removeRightButtons();

        //Header Right
        this.dom_ButtonContainer = document.createElement('div');
        this.dom_root.appendChild(this.dom_ButtonContainer);
        this.dom_ButtonContainer.classList.add('HeaderButtonContainer');

        this.dom_HeaderAccountBttn = document.createElement("img");
        this.dom_HeaderAccountBttn.setAttribute('id', "AccountSymbol");
        this.dom_HeaderAccountBttn.classList.add("HeaderButtonImage");
        this.dom_HeaderAccountBttn.src = "./Images/account.png";
        this.dom_ButtonContainer.appendChild(this.dom_HeaderAccountBttn);
        this.dom_HeaderAccountBttn.style.width = "25px";
        this.dom_HeaderAccountBttn.style.width = "25px";
        this.dom_HeaderAccountBttn.addEventListener('mouseover', () => {
            this.dom_DropdownMenu.style.display = "block";
            this.dom_DropdownMenuContent.style.display = "block";
        });


        this.dom_DropdownMenu = document.createElement('div');
        this.dom_root.appendChild(this.dom_DropdownMenu);
        this.dom_DropdownMenu.classList.add('HeaderDropdownMenu');
        this.dom_DropdownMenu.addEventListener('mouseleave', () => {
            this.dom_DropdownMenuContent.style.display = "none";
            this.dom_DropdownMenu.style.display = "none";
        });

        this.dom_DropdownMenuContent = document.createElement('div');
        this.dom_DropdownMenu.appendChild(this.dom_DropdownMenuContent);
        this.dom_DropdownMenuContent.classList.add("HeaderDropdownMenuContent");

        this.dom_DropdownMenuData0 = document.createElement('a');
        this.dom_DropdownMenuData0.textContent = "Your Playlist Mates";
        this.dom_DropdownMenuData0.classList.add('HeaderDropdownMenuData');
        this.dom_DropdownMenuData0.setAttribute('href', '#');
        this.dom_DropdownMenuData0.addEventListener('click', () => {
            for (let i = 2; i < this.dom_content.childNodes.length; i++) {
                this.dom_content.childNodes[i].remove();
            }
            new manager("page_first_steps");
            this.set("My Playlist Mates");
            this.MyPlaylistMates = new MyPlaylistMates(this.dom_content)
        });
        this.dom_DropdownMenuContent.appendChild(this.dom_DropdownMenuData0);

        this.dom_DropdownMenuData1 = document.createElement('a');
        this.dom_DropdownMenuData1.textContent = "New Playlist-Mate?";
        this.dom_DropdownMenuData1.classList.add('HeaderDropdownMenuData');
        this.dom_DropdownMenuData1.setAttribute('href', '#');
        this.dom_DropdownMenuData1.addEventListener('click', () => {
            for (let i = 2; i < this.dom_content.childNodes.length; i++) {
                this.dom_content.childNodes[i].remove();
            }
            new manager("page_first_steps");
            this.set("New Playlist Mate");
            new NewPlaylistMate(this.dom_content);
        });
        this.dom_DropdownMenuContent.appendChild(this.dom_DropdownMenuData1);

        this.dom_DropdownMenuData2 = document.createElement('a');
        this.dom_DropdownMenuData2.textContent = "My Account";
        this.dom_DropdownMenuData2.classList.add('HeaderDropdownMenuData');
        this.dom_DropdownMenuData2.setAttribute('href', '#');
        this.dom_DropdownMenuData2.addEventListener('click', () => {
            new manager('myacc');
        });
        this.dom_DropdownMenuContent.appendChild(this.dom_DropdownMenuData2);

        this.dom_DropdownMenuData3 = document.createElement('a');
        this.dom_DropdownMenuData3.textContent = "Logout";
        this.dom_DropdownMenuData3.classList.add('HeaderDropdownMenuData');
        this.dom_DropdownMenuData3.setAttribute('href', '#');
        this.dom_DropdownMenuData3.addEventListener('click', () => {
            this.removeRightButtons();
            new manager('login');
        });
        this.dom_DropdownMenuContent.appendChild(this.dom_DropdownMenuData3);


        this.dom_HeaderMessageBttn = document.createElement("img");
        this.dom_HeaderMessageBttn.setAttribute('id', "MessageSymbol");
        this.dom_HeaderMessageBttn.classList.add("HeaderButtonImage");
        this.dom_HeaderMessageBttn.src = "./Images/letter.png";
        this.dom_ButtonContainer.appendChild(this.dom_HeaderMessageBttn);
        this.dom_HeaderMessageBttn.style.width = "30px";
        this.dom_HeaderMessageBttn.addEventListener('click', () => {
            for (let i = 2; i < this.dom_content.childNodes.length; i++) {
                this.dom_content.childNodes[i].remove();
            }
            new manager("page_first_steps");
            this.set("Requests");
            this.Requests = new RequestPage(this.dom_content)
        });
    }

}
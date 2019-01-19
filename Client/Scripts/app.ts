import {Header} from "./Header.js";
import {Login} from "./Login.js";
import {Registration} from "./Registration.js";
import {FirstSteps} from "./FirstSteps.js";
import {About_us} from "./About_us.js";
import {Contact} from "./Contact.js";
import {Impressum} from "./Impressum.js";
import {MyAccount} from "./MyAccount.js";

const dom_root = document.getElementById('app');
const dom_content = document.createElement('div');
dom_content.classList.add('content');
const header = new Header(dom_root, dom_content);
//const audioPlayer = new AudioPlayer(dom_content);
dom_root.appendChild(dom_content);
localStorage.setItem("PlaylistIndex", "1");

let active_app = null;

export const manager = function (app) {

    if (active_app != null) {
        active_app.close();
        active_app = null;
    }

    switch (app) {
        case 'login':
            header.set('Login');
            active_app = new Login(dom_content);
            break;
        case 'register':
            header.set('Registration');
            active_app = new Registration(dom_content);
            break;
        case 'page_first_steps':
            header.set('First Steps');
            header.setRightButtons();
            active_app = new FirstSteps(dom_content);
            break;
        case 'myacc':
            header.set('My Account');
            active_app = new MyAccount(dom_content);
            break;
        case 'about':
            header.set('About Us');
            active_app = new About_us(dom_content);
            break;
        case 'contact':
            header.set('Contact');
            active_app = new Contact(dom_content);
            break;
        case 'impressum':
            header.set('Impressum');
            active_app = new Impressum(dom_content);
            break;
        case 'default':
            throw `Undefined manager app ${app}`
    }
};

manager("login");

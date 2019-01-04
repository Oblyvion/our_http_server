
import {Header} from "./Header.js";
import {Login} from "./Login.js";
import {Registration} from "./Registration.js";
import {FirstSteps} from "./FirstSteps.js";

const dom_body = document.getElementById('app');
const header = new Header(dom_body);
const dom_content = document.createElement('div');
dom_content.classList.add('content');
dom_body.appendChild(dom_content);

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
            active_app = new FirstSteps(dom_content);
            break;
        case 'default':
            throw `Undefined manager app ${app}`
    }
};

manager("login");

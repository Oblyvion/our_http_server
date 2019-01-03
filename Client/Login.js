const API_URL = 'http://localhost:3002';
import { manager } from "./app.js";
export class Login {
    constructor(dom) {
        this.dom_root = dom;
        this.dom = document.createElement('div');
        this.dom.classList.add('container');
        this.dom_root.appendChild(this.dom);
        //Create Login Div
        const dom_login = document.createElement('div');
        dom_login.setAttribute("id", "Login");
        dom_login.classList.add('LoginAndRegisterContainer');
        this.dom.appendChild(dom_login);
        this.animate();
        const dom_loginText = document.createElement('div');
        dom_loginText.classList.add('headline');
        dom_login.appendChild(dom_loginText);
        dom_loginText.textContent = "Log in here.";
        this.dom_loginInputID = document.createElement('input');
        this.dom_loginInputID.classList.add('input');
        dom_login.appendChild(this.dom_loginInputID);
        this.dom_loginInputID.placeholder = "username";
        this.dom_loginInputID.type = "text";
        this.dom_loginInputPW = document.createElement('input');
        this.dom_loginInputPW.classList.add('input');
        dom_login.appendChild(this.dom_loginInputPW);
        this.dom_loginInputPW.placeholder = "password";
        this.dom_loginInputPW.type = "password";
        const dom_loginButton = document.createElement('button');
        dom_loginButton.classList.add('button');
        dom_login.appendChild(dom_loginButton);
        dom_loginButton.textContent = "Login";
        dom_loginButton.addEventListener('click', () => {
            this.loginUser();
        });
        const dom_loginLink = document.createElement('div');
        dom_loginLink.classList.add('LinkContainer');
        dom_login.appendChild(dom_loginLink);
        const dom_loginLinkText = document.createElement("p");
        dom_loginLinkText.classList.add('LinkText');
        dom_loginLinkText.textContent = "Not registered?";
        dom_loginLink.appendChild(dom_loginLinkText);
        const newlink = document.createElement('a');
        newlink.textContent = "Register";
        newlink.classList.add('Link');
        newlink.setAttribute('href', '#');
        newlink.addEventListener('click', () => {
            this.close();
            new manager("register");
        });
        dom_loginLink.appendChild(newlink);
        // const dom_registerButton = document.createElement('button');
        // dom_registerButton.classList.add('button');
        // dom_login.appendChild(dom_registerButton);
        // dom_registerButton.textContent = "Not registered? Register";
        // dom_registerButton.addEventListener('click', (event) => {
        //     this.close();
        //     new manager("register");
        // });
    }
    async loginUser() {
        if (this.dom_loginInputID.value !== "" && this.dom_loginInputPW.value !== "") {
            let password = this.dom_loginInputPW.value; //= Registration.sha256(this.dom_registerPW.value);
            try {
                console.log(`das ist body name: ${this.dom_loginInputID.value}`);
                console.log(`das ist body pw: ${password.toString()}`);
                const response = await fetch(API_URL + '/user/' + this.dom_loginInputID.value, {
                    cache: 'no-cache',
                    headers: {
                        'content-type': 'application/json',
                        'crossDomain': 'true'
                    },
                    method: 'GET',
                    mode: 'cors',
                });
                const result = await response.json();
                if (!result.success) {
                    console.error(result);
                    throw result.msg;
                }
                //new User(this.dom_register, result.data);
                //this.info(`Registration successful!`, '', 'success');
            }
            catch (err) {
                console.log(err);
                //this.info('Registration Error! Please try again.', err, 'warning');
            }
        }
        else {
            console.log("Etwas eingeben!");
        }
    }
    close() {
        this.dom.remove();
    }
    animate() {
        const elem = document.getElementById("Login");
        let pos = 150;
        const id = setInterval(frame, 5);
        function frame() {
            if (pos === -50) {
                clearInterval(id);
            }
            else {
                pos--;
                elem.style.marginTop = pos + "px";
                elem.style.animation.blink();
            }
        }
    }
}
//# sourceMappingURL=Login.js.map
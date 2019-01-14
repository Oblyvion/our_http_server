const API_URL = 'http://localhost:3000';

import {manager} from "./app.js";

export class Login implements iAppContainer {

    private dom_root: HTMLElement;
    private dom: HTMLElement;
    private dom_login: HTMLElement;
    private dom_loginInputID;
    private dom_loginInputPW;
    private dom_login_notification;

    constructor(dom: HTMLElement) {
        this.dom_root = dom;

        console.log(this.dom_root);

        this.dom = document.createElement('div');
        this.dom.classList.add('container');
        this.dom_root.appendChild(this.dom);

        //Create Login Div
        this.dom_login = document.createElement('div');
        this.dom_login.setAttribute("id", "Login");
        this.dom_login.classList.add('LoginAndRegisterContainer');
        this.dom.appendChild(this.dom_login);

        this.animate();

        const dom_loginText = document.createElement('div');
        dom_loginText.classList.add('headline');
        this.dom_login.appendChild(dom_loginText);
        dom_loginText.textContent = "Log in here.";

        this.dom_loginInputID = document.createElement('input');
        this.dom_loginInputID.classList.add('input');
        this.dom_login.appendChild(this.dom_loginInputID);
        this.dom_loginInputID.placeholder = "username";
        this.dom_loginInputID.type = "text";

        this.dom_loginInputPW = document.createElement('input');
        this.dom_loginInputPW.classList.add('input');
        this.dom_login.appendChild(this.dom_loginInputPW);
        this.dom_loginInputPW.placeholder = "password";
        this.dom_loginInputPW.type = "password";


        const dom_loginButton = document.createElement('button');
        dom_loginButton.classList.add('button');
        this.dom_login.appendChild(dom_loginButton);
        dom_loginButton.textContent = "Login";
        dom_loginButton.addEventListener('click', () => {
            this.loginUser();
        });

        const dom_loginLink = document.createElement('div');
        dom_loginLink.classList.add('LinkContainer');
        this.dom_login.appendChild(dom_loginLink);
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

    private async loginUser() {
        if (this.dom_loginInputID.value !== "" && this.dom_loginInputPW.value !== "") {
            let password = this.dom_loginInputPW.value; //= Registration.sha256(this.dom_registerPW.value);
            try {
                // console.log(`das ist body name: ${this.dom_loginInputID.value}`);
                // console.log(`das ist body pw: ${password.toString()}`);
                const response = await fetch(API_URL + '/user?name=' + this.dom_loginInputID.value, {
                    cache: 'no-cache',
                    headers: {
                        'content-type': 'application/javascript',
                        'crossDomain': 'true'
                    },
                    method: 'GET',
                    mode: 'cors',
                    // todo REST POST redirect
                    // redirect: 'follow',
                    // credentials: 'include',
                });

                const result: UserResult = await response.json();
                
                //console.log(result.data.toString());


                //console.log("server: "+result.data.PASSWORD);
                //console.log("client: "+password);
                
                if (!result.success) {
                    console.error(result);
                    throw "wrong data";
                }
                else {
                    if(result.data.PASSWORD !== password) {
                        throw "Error wrong password";
                    }
                }

                this.info(`Login successful!`, '', 'success');
                this.close()
                manager("page_first_steps");

            } catch (err) {
                console.log(err);
                this.info("Login Error! Wrong username or password.", err, 'warning');
            }
        }
        else {
            this.info("Please type in username and password.", "", 'warning')
        }
    }

    info(message: string, headline: string = '', classname: string = 'info') {
        if(this.dom_login_notification) {
            this.dom_login_notification.remove();
        }
        //show if registration was successful or not
        this.dom_login_notification = document.createElement('div');
        this.dom_login_notification.classList.add('notification');
        this.dom_login.insertBefore(this.dom_login_notification, this.dom_login.childNodes[0]);
        this.dom_login_notification.textContent = message;
        if (classname === "warning") {
            this.dom_login_notification.style.backgroundColor = "Red";
        }
        else {
            this.dom_login_notification.style.backgroundColor = "Green";
        }
    }

    close() {
        this.dom.remove();
    }

    animate() {
        const elem = this.dom_login;
        console.log("das ist elem: "+elem);
        let pos = 150;
        const id = setInterval(frame, 5);
        function frame() {
            if (pos === 50) {
                clearInterval(id);
            } else {
                pos--;
                elem.style.marginTop = pos + "px";
                elem.style.animation.blink();
            }
        }
    }
}


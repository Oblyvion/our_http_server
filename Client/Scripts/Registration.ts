const API_URL = 'http://localhost:3001';

import {manager} from "./app.js";

export class Registration implements iAppContainer {

    private dom_root: HTMLElement;
    private dom: HTMLElement;
    private dom_register: HTMLElement;
    private dom_registerID;
    private dom_registerPW;
    private dom_register_notification;

    constructor(dom: HTMLElement) {
        this.dom_root = document.getElementById("app");

        this.dom = document.createElement('div');
        this.dom.classList.add('ContentLoginRegistration');
        this.dom_root.appendChild(this.dom);

        //Create Registration Div
        this.dom_register = document.createElement('div');
        this.dom_register.setAttribute("id", "Registration");
        this.dom_register.classList.add('LoginAndRegisterContainer');
        this.dom.appendChild(this.dom_register);

        this.animate();

        const dom_registerText = document.createElement('div');
        dom_registerText.classList.add('headline');
        this.dom_register.appendChild(dom_registerText);
        dom_registerText.textContent = "Register here.";

        this.dom_registerID = document.createElement('input');
        this.dom_registerID.classList.add('input');
        this.dom_register.appendChild(this.dom_registerID);
        this.dom_registerID.placeholder = "username";
        this.dom_registerID.type = "text";

        this.dom_registerPW = document.createElement('input');
        this.dom_registerPW.classList.add('input');
        this.dom_register.appendChild(this.dom_registerPW);
        this.dom_registerPW.placeholder = "password";
        this.dom_registerPW.type = "text";


        const dom_registerButton = document.createElement('button');
        dom_registerButton.classList.add('button');
        this.dom_register.appendChild(dom_registerButton);
        dom_registerButton.textContent = "Register";
        dom_registerButton.addEventListener('click', () => {
            this.registerUser();
        });


        const dom_registerLink = document.createElement('div');
        dom_registerLink.classList.add('LinkContainer');
        this.dom_register.appendChild(dom_registerLink);
        const dom_registerLinkText = document.createElement("p");
        dom_registerLinkText.classList.add('LinkText');
        dom_registerLinkText.textContent = "Already registered?";
        dom_registerLink.appendChild(dom_registerLinkText);

        const newlink = document.createElement('a');
        newlink.textContent = "Login";
        newlink.classList.add('Link');
        newlink.setAttribute('href', '#');
        newlink.addEventListener('click', () => {
            this.close();
            new manager("login");
        });
        dom_registerLink.appendChild(newlink);


        // const dom_toLoginButton = document.createElement('button');
        // dom_toLoginButton.classList.add('button');
        // this.dom_register.appendChild(dom_toLoginButton);
        // dom_toLoginButton.textContent = "Already registered? Login!";
        // dom_toLoginButton.addEventListener('click', () => {
        //     this.close();
        //     new manager("login");
        // });

    }

    async registerUser() {
        let password = this.dom_registerPW.value; // Registration.sha256(this.dom_registerPW.toString());
        if (this.dom_registerID.value.length > 1) {
            try {
                if (this.dom_registerPW.value.length > 3) {
                    console.log("PW too short = ", this.dom_registerPW.value.length);
                    console.log(`das ist body name: ${this.dom_registerID.value}`);
                    console.log(`das ist body pw: ${password.toString()}`);

                    const response = await fetch(API_URL + '/user/', {
                        body: JSON.stringify({
                            name: this.dom_registerID.value,
                            password: password
                        }),
                        cache: 'no-cache',
                        headers: {
                            'content-type': 'application/json',
                            'crossDomain': 'true'
                        },
                        method: 'POST',
                        mode: 'cors',
                        // todo REST POST redirect
                        // redirect: 'follow',
                        // credentials: 'include',
                    });

                    const result: UserResult = await response.json();
                    if (!result.success) {
                        console.error(result);
                        throw result.msg;
                    }

                    //new User(this.dom_register, result.data);
                    this.info(`Registration successful!`, `created Account: ${this.dom_registerID.value}`, 'success');

                } else throw new Error("Short PW, Mate");
            } catch (err) {
                console.log(err);
                this.info('Registration Error! Please try again.', err, 'warning');
            }
        }

        else {
            let err = new Error("Username has to be at least 2 characters!")
            this.info("Registration Error! Please try again.", err.message, 'warning');
        }
    }


    info(message: string, headline: string = '', classname: string = 'info') {
        if (this.dom_register_notification) {
            this.dom_register_notification.remove();
        }
        //show if registration was successful or not
        this.dom_register_notification = document.createElement('div');
        this.dom_register_notification.classList.add('notification');
        this.dom_register.insertBefore(this.dom_register_notification, this.dom_register.childNodes[0]);
        this.dom_register_notification.textContent = message+"\n"+headline;
        if (classname === "warning") {
            this.dom_register_notification.style.backgroundColor = "Red";
        } else {
            this.dom_register_notification.style.backgroundColor = "Green";
        }
    }

    // static async sha256(message: string) {
    //     // encode as UTF-8
    //     const msgBuffer = new TextEncoder().encode(message);
    //     // hash the message
    //     const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    //     // convert ArrayBuffer to Array
    //     const hashArray = Array.from(new Uint8Array(hashBuffer));
    //     // convert bytes to hex string
    //     return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    // }


    close() {
        this.dom.remove();
    }


    animate() {
        const elem = this.dom_register;
        let pos = 150;
        const id = setInterval(frame, 5);

        function frame() {
            if (pos === -50) {
                clearInterval(id);
            } else {
                pos--;
                elem.style.marginTop = pos + "px";
                elem.style.animation.blink();
            }
        }
    }

}


//
// clickLogin() {
//     this.animate();
//     const RegistrationForm = document.getElementsByClassName("RegistrationForm").item(0);
//     const LoginForm = document.getElementsByClassName("LoginForm").item(0);
//     LoginForm.style.display = "block";
//     RegistrationForm.style.display = "none";
// }
//
// animate() {
//     const elem = document.getElementById("form");
//     let pos = -100;
//     const id = setInterval(frame, 5);
//     function frame() {
//         if (pos === 0) {
//             clearInterval(id);
//         } else {
//             pos++;
//             elem.style.bottom = pos + "px";
//             elem.style.animation.blink();
//         }
//     }
// }



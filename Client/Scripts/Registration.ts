import {manager} from "./app.js";

/**
 * @class Registration
 * Erzeugt den Registrierungsscreen damit es Benutzern ermöglicht wird sich zu registrieren
 */
export class Registration implements AppContainer {

    private API_URL = 'http://localhost:3000';
    private dom_root: HTMLElement;
    private dom: HTMLElement;
    private dom_register: HTMLElement;
    private dom_registerID;
    private dom_registerPW;
    private dom_register_notification;

    /**
     *@constructor Registration
     * Erzeugt den LoginAndRegisterContainer und alle darin befindlichen Elemente
     */
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
    }

    /**
     * @async registerUser()
     * Überprüft die Eingabe des Users ob der eingegebene Benutzername größer als ein Zeichen ist und ob das
     * Passwort mindestens 4 Zeichen lang ist. Danach wird die Route /register des Servers aufgerufen. Dabei werden die Registrierungsdaten im Body mit
     * übergeben um sie beim Server angelangt in die  Datenbank zu schreiben
     * Gibt der Server success !== true zurück so wird eine Fehlermeldung an die info Funktion gesendet.
     * Bei success === true wird der User registriert und die Info Meldung wird grün.
     *
     * Method: POST
     */
    async registerUser() {
        let password = this.dom_registerPW.value;
        //password = Registration.sha256(password);
        if (this.dom_registerID.value.length > 1) {
            try {
                if (this.dom_registerPW.value.length > 3) {
                    // console.log("PW too short = ", this.dom_registerPW.value.length);
                    // console.log(`das ist body name: ${this.dom_registerID.value}`);
                    // console.log(`das ist body pw: ${password.toString()}`);

                    const response = await fetch(this.API_URL + '/user/', {
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
                    });

                    const result: UserResult = await response.json();
                    if (!result.success) {
                        console.error(result);
                        throw result.msg;
                    }

                    this.info(`Registration successful!`, `created Account: ${this.dom_registerID.value}`, 'success');

                } else throw new Error("Short PW, Mate");
            } catch (err) {
                console.log(err);
                this.info('Registration Error! Please try again.', err, 'warning');
            }
        } else {
            let err = new Error("Username has to be at least 2 characters!");
            this.info("Registration Error! Please try again.", err.message, 'warning');
        }
    }

    /**
     * @function info
     * Die info Funktion wird aufgerufen um dem User eine Fehlermeldung zu zeigen wenn beim Login Vorgang etwas schief gegangen ist
     * @param message - enthält die Fehlermeldung
     * @param headline - enthält die Daten falls ein Fehler entsteht oder den Benutzernamen des erfolgreich erzeugten Users
     * @param classname - enthält die Information ob es eine Warnung ist oder nicht
     */
    info(message: string, headline: string = '', classname: string = 'info') {
        if (this.dom_register_notification) {
            this.dom_register_notification.remove();
        }
        //show if registration was successful or not
        this.dom_register_notification = document.createElement('div');
        this.dom_register_notification.classList.add('notification');
        this.dom_register.insertBefore(this.dom_register_notification, this.dom_register.childNodes[0]);
        this.dom_register_notification.textContent = message + "\n" + headline;
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


    /**
     * @function close()
     *
     * Entfernt den Content
     *
     */
    close() {
        this.dom.remove();
    }

    /**
     * @function animate()
     *
     * Animiert den LoginContainer
     */
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




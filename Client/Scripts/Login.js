import { manager } from "./app.js";
console.log("port: ", localStorage.getItem("port"));
/**
 * @class Login
 * Erzeugt den Loginscreen damit es Benutzern ermöglicht wird sich anzumelden
 */
export class Login {
    /**
     *@constructor Login
     * Erzeugt den LoginAndRegisterContainer und alle darin befindlichen Elemente
     */
    constructor() {
        this.API_URL = 'http://localhost:' + localStorage.getItem("port");
        this.dom_root = document.getElementById("app");
        this.dom = document.createElement('div');
        this.dom.classList.add('ContentLoginRegistration');
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
        this.dom_loginInputID.addEventListener("keypress", event => {
            if (event.keyCode === 13) {
                this.dom_loginButton.click();
            }
        });
        this.dom_loginInputPW = document.createElement('input');
        this.dom_loginInputPW.classList.add('input');
        this.dom_login.appendChild(this.dom_loginInputPW);
        this.dom_loginInputPW.placeholder = "password";
        this.dom_loginInputPW.type = "password";
        this.dom_loginInputPW.addEventListener("keypress", event => {
            if (event.keyCode === 13) {
                this.dom_loginButton.click();
            }
        });
        this.dom_loginButton = document.createElement('button');
        this.dom_loginButton.classList.add('button');
        this.dom_login.appendChild(this.dom_loginButton);
        this.dom_loginButton.textContent = "Login";
        this.dom_loginButton.addEventListener('click', () => {
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
    }
    /**
     *
     */
    async loginUser() {
        if (this.dom_loginInputID.value !== "" && this.dom_loginInputPW.value !== "") {
            let password = this.dom_loginInputPW.value; //Registration.sha256(this.dom_loginInputPW.value);
            try {
                // console.log(`das ist body name: ${this.dom_loginInputID.value}`);
                console.log(`das ist body pw: ${password.toString()}`);
                const response = await fetch(this.API_URL + '/login', {
                    body: JSON.stringify({
                        name: this.dom_loginInputID.value,
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
                const result = await response.json();
                // console.log("server: "+result.data.PASSWORD);
                // console.log("client: "+password);
                if (!result.success) {
                    console.error(result);
                    throw "wrong data";
                }
                else {
                    this.info(`Login successful!`, '', 'success');
                    // console.log("Login.ts, loginUser: result.data = ", result.data);
                    // console.log("Login.ts, loginUser: 0localStorage = ", localStorage.getItem('token'));
                    localStorage.clear();
                    // console.log("Login.ts, loginUser: 1localStorage = ", localStorage.getItem('token'));
                    localStorage.setItem("token", result.data);
                    // console.log("Login.ts, loginUser: 2localStorage = ", localStorage.getItem('token'));
                    this.close();
                    manager("page_first_steps");
                }
            }
            catch (err) {
                console.log(err);
                this.info("Login Error! Wrong username or password.", err, 'warning');
            }
        }
        else {
            this.info("Please type in username and password.", "", 'warning');
        }
    }
    info(message, headline = '', classname = 'info') {
        if (this.dom_login_notification) {
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
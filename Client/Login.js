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
        const dom_loginInputID = document.createElement('input');
        dom_loginInputID.classList.add('input');
        dom_login.appendChild(dom_loginInputID);
        dom_loginInputID.placeholder = "username";
        dom_loginInputID.type = "text";
        const dom_loginInputPW = document.createElement('input');
        dom_loginInputPW.classList.add('input');
        dom_login.appendChild(dom_loginInputPW);
        dom_loginInputPW.placeholder = "password";
        dom_loginInputPW.type = "password";
        const dom_loginButton = document.createElement('button');
        dom_loginButton.classList.add('button');
        dom_login.appendChild(dom_loginButton);
        dom_loginButton.textContent = "Login";
        const dom_registerButton = document.createElement('button');
        dom_registerButton.classList.add('button');
        dom_login.appendChild(dom_registerButton);
        dom_registerButton.textContent = "Not registered? Register";
        dom_registerButton.addEventListener('click', (event) => {
            this.close();
            new manager("register");
        });
    }
    close() {
        this.dom.remove();
    }
    animate() {
        const elem = document.getElementById("Login");
        let pos = 150;
        const id = setInterval(frame, 5);
        function frame() {
            if (pos === 0) {
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
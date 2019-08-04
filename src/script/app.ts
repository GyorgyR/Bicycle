// @ts-ignore: It does not recognize this as a module even tho it is (amd)
import template = require('handlebars/app.hbs.js');
import {eventHandler, UiComponent} from "./ui-component";
import {INavBarConfig, NavBar} from "./navbar";

namespace BikeApp {
    export function init(config: IAppConfig) {
        let app = new App(getAppContainer, config);
        getAppConfig('/app-config.json', app.setState.bind(app));
    }

    function getAppContainer(): HTMLElement {
        return document.getElementById('app') as HTMLElement;
    }

    interface IAppConfig {
        description: string;
        navbar: INavBarConfig;
    }

    class App extends UiComponent {
        navBar: NavBar;
        state!: IAppConfig;

        constructor(containerGen: () => HTMLElement, state: IAppConfig) {
            super(containerGen, template, state);

            this.render();
            this.navBar = new NavBar(
                () => this.getElement('#navbar-container'),
                this.state.navbar
            );
        }

        postRender(): void {
            if (this.navBar) {
                this.navBar.setState(this.state.navbar);
                this.navBar.render();
            }
        }

        @eventHandler("button", "click")
        handleClick(e: Event) {
            console.log('click');
        }
    }
    function getAppConfig(url: string, callback: (data: IAppConfig)=>void): void {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function () {
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
            else {
                console.error('Failed to get app config', xhr.status);
                throw Error('Cannot init app with app config');
            }
        };
        xhr.send();
    }
}

BikeApp.init({"description": "", navbar: {options: []}});


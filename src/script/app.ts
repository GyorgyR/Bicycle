// @ts-ignore: It does not recognize this as a module even tho it is (amd)
import template = require('handlebars/app.hbs.js');
import {eventHandler, UiComponent} from "./ui-component";
import {INavBarConfig, NavBar} from "./navbar";

namespace BikeApp {
    export function init() {
        let app = new App(getAppContainer, null);
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
        navBar: NavBar | null;
        state!: IAppConfig | null;

        constructor(containerGen: () => HTMLElement, state: IAppConfig | null) {
            super(containerGen, template, state);

            this.navBar = (this.state) ? new NavBar(
                () => this.getElement('#navbar-container'),
                this.state.navbar
            ) : null;

            this.render();
        }

        setState(newState: IAppConfig) {
            super.setState(newState);
            if (!this.navBar) this.navBar = new NavBar(
                () => this.getElement('#navbar-container'),
                newState.navbar
            );
        }

        render(): void {
            super.render();

            if (this.navBar && this.state) {
                this.navBar.setState(this.state.navbar);
                this.navBar.render();
            }
        }

        @eventHandler("button", "click")
        handleClick(e: Event) {
            console.log('click', e);
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

BikeApp.init();


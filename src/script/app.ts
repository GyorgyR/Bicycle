// @ts-ignore: It does not recognize this as a module even tho it is (amd)
import template = require('handlebars/app.hbs.js');
import {eventHandler, UiComponent} from "./ui-component";
import {NavBar, INavBarConfig} from "./navbar";
namespace BikeApp {
    export function init(config: IAppConfig) {
        new App(document.getElementById('app') as HTMLElement, config);
    }

    interface IAppConfig {
        description: string;
        navbar: INavBarConfig;
    }

    class App extends UiComponent {
        constructor(container: HTMLElement, state: IAppConfig) {
            super(container, template, state);

            this.render();
            new NavBar(
                this.container.querySelector('#navbar-container') as HTMLElement,
                this.state.navbar
                );
        }

        @eventHandler("button", "click")
        handleClick(e: Event) {
            console.log('click');
        }
    }
    export function getAppConfig(url: string, callback: (data: IAppConfig)=>void): void {
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
BikeApp.getAppConfig('http://localhost:8080/app-config.json', BikeApp.init);


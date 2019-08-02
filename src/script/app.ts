// @ts-ignore: It does not recognize this as a module even tho it is (amd)
import template = require('handlebars/app.hbs.js');
import {eventHandler, UiComponent} from "./ui-component";
import {NavBar, INavBarConfig} from "./navbar";
namespace BikeApp {
    export function init(config: IAppConfig) {
        let app = new App(document.getElementById('app') as HTMLElement, config);
        getAppConfig('/app-config.json', app.setState.bind(app));
    }

    interface IAppConfig {
        description: string;
        navbar: INavBarConfig;
    }

    class App extends UiComponent {
        navBar: NavBar | undefined;
        state!: IAppConfig;
        constructor(container: HTMLElement, state: IAppConfig) {
            super(container, template, state);

            this.render();
        }

        postRender(): void {
            // Make sure the object is not referenced anymore and GC will reclaim it
            delete this.navBar;

            // Recreate nav bar with new container
            this.navBar = new NavBar(
                this.getElement('#navbar-container'),
                this.state.navbar
            );
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


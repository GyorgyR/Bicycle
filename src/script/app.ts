// @ts-ignore: It does not recognize this as a module even tho it is (amd)
import template = require('handlebars/app.hbs.js');
import {eventHandler, UiComponent} from "./ui-component";
import {NavBar} from "./navbar";
namespace BikeApp {
    export function init(config: IAppConfig) {
        new App(document.getElementById('app') as HTMLElement, config);
    }

    interface IAppConfig {
        description: string;
    }

    class App extends UiComponent {
        constructor(container: HTMLElement, state: IAppConfig) {
            super(container, template, state);

            this.render();
            new NavBar(
                this.container.querySelector('#navbar-container') as HTMLElement,
                {}
                );
        }

        @eventHandler("button", "click")
        handleClick(e: Event) {
            console.log('click');
        }
    }
}
BikeApp.init({description: 'This is a test to see how painful it would be to create an SPA with handlebars.'});


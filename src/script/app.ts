// @ts-ignore: It does not recognize this as a module even tho it is (amd)
import template = require('handlebars/app.hbs.js');
import {eventHandler, UiComponent} from "./ui-component";
import {INavBarConfig, NavBar} from "./navbar";

namespace BikeApp {
    export function init() {
        let app = new App(
            document.getElementById('app') as HTMLElement, null);
        app.downloadStateFrom('/app-config.json').then();
    }

    interface IAppConfig {
        description: string;
        navbar: INavBarConfig;
    }

    class App extends UiComponent {
        navBar: NavBar | null;
        state!: IAppConfig | null;

        constructor(container: HTMLElement, state: IAppConfig | null) {
            super(() => container, template, state);

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
}

BikeApp.init();


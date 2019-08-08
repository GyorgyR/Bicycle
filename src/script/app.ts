// @ts-ignore: It does not recognize this as a module even tho it is (amd)
import template = require('handlebars/app.hbs.js');
import {UiComponent} from "./ui-component";
import {INavBarConfig, NavBar} from "./navbar";

namespace BikeApp {
    export function init() {
        window["Bike"] = new App(
            document.getElementById('app') as HTMLElement, null);
        window["Bike"].downloadStateFrom('/app-config.json').then();
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

            this.navBar = new NavBar(
                () => this.getElement('#navbar-container'),
                (this.state) ? this.state.navbar : {}
            );
        }

        setState(newState: any) {
            super.setState(newState);

            if (this.navBar && newState.navbar) {
                this.navBar.setState(newState.navbar);
            }
        }
    }
}

BikeApp.init();


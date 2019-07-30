import { UiComponent } from './ui-component';
// @ts-ignore
import template = require('handlebars/app.hbs.js');
namespace BikeApp {
	export function init(config: IAppConfig) {
		new App(<HTMLElement>document.getElementById('app'), config);
	}

	interface IAppConfig {
		description: string;
	}

	class App extends UiComponent {
		constructor(container: HTMLElement, state: IAppConfig) {
			super(container, template, state);

			this.render();
		}
	}
}
BikeApp.init({description: 'This is a test to see how painful it would be to create an SPA with handlebars.'});


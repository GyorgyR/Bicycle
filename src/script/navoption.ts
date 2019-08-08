// @ts-ignore: It does not recognize this as a module even tho it is (amd)
import template = require('handlebars/navoption.hbs.js');
import {UiComponent} from "./ui-component";

export class NavOption extends UiComponent {
    constructor(containerGen: () => HTMLElement, state: any) {
        super(containerGen, template, state);

        this.render();
    }
}

export interface INavOptionState {
    navOptions: ISingleNavOption[];
}

interface ISingleNavOption {
    optionName: string;
    optionLink: string | URL;
}
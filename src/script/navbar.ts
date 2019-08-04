// @ts-ignore: It does not recognize this as a module even tho it is (amd)
import template = require('handlebars/navbar.hbs.js');
import {UiComponent} from "./ui-component";

export interface INavBarConfig {
    title: string;
    options: IOptionConfig[];
}

interface IOptionConfig {
    name: string;
}

export class NavBar extends UiComponent {
    constructor(containerGen: () => HTMLElement, state: any) {
        super(containerGen, template, state);

        this.render();
    }
}
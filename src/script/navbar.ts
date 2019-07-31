// @ts-ignore: It does not recognize this as a module even tho it is (amd)
import template = require('handlebars/navbar.hbs.js');
import {UiComponent} from "./ui-component";

export class NavBar extends UiComponent{
    constructor(container: HTMLElement, state: any) {
        super(container, template, state);

        this.render();
    }
}
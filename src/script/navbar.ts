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

        this.navOption = new NavOption(
            () => this.getElement(this.optionSelector), null);
    }

    @eventHandler('div.nav-menu', 'click')
    private handleOptionClick(e: Event) {
        let selectedOptionElement = e.target as HTMLElement;
        let selectedOptionName = selectedOptionElement
            .getAttribute('data-option');
        let activeList: INavOptionState | null = null;

        this.setBatchState(() => this.state
            .options
            .forEach((option) => {
                option.wasActive = option.isActive;
                if (option.name == selectedOptionName) {
                    option.isActive = !option.isActive;
                    if (option.isActive) activeList = option.list;
                } else {
                    option.isActive = false;
                }
            })
        );

        this.navOption.setState(activeList);
    }

    @eventHandler('div.nav-menu', 'animationend')
    private removeWasAnim(e: Event) {
        (e.target as HTMLElement).classList.remove('was-active');
    }
}
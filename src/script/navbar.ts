// @ts-ignore: It does not recognize this as a module even tho it is (amd)
import template = require('handlebars/navbar.hbs.js');
import {eventHandler, UiComponent} from "./ui-component";
import {INavOptionState, NavOption} from "./navoption";

export interface INavBarConfig {
    title: string;
    options: IOptionConfig[];
}

interface IOptionConfig {
    name: string;
    list: INavOptionState;
    isActive: boolean;
    wasActive: boolean;
}

export class NavBar extends UiComponent {
    state!: INavBarConfig;
    protected navOption: NavOption;
    private readonly optionSelector: string = 'section#selected-option';

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

        this.setBatchState((state) => state
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

    // Remove class after animation ended otherwise the animation could play randomly
    @eventHandler('div.nav-menu', 'animationend')
    private removeWasAnim(e: Event) {
        (e.target as HTMLElement).classList.remove('was-active');
    }
}
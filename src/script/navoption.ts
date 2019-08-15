// @ts-ignore: It does not recognize this as a module even tho it is (amd)
import template = require('handlebars/navoption.hbs.js');
import {eventHandler, UiComponent} from "./ui-component";

const optionsContainerSelector: string = '#options-container';

export class NavOption extends UiComponent {
    private prevHeight: number;

    constructor(containerGen: () => HTMLElement, state: any) {
        super(containerGen, template, state);

        this.prevHeight = 0;

        this.render();
    }

    setState(newState: INavOptionState | null) {
        if (!newState) newState = {prevHeight: 0, navOptions: []};
        newState.prevHeight = this.prevHeight;
        super.setState(newState);
    }

    @eventHandler(optionsContainerSelector, 'animationend')
    private saveHeight(e: Event) {
        this.prevHeight = this.getElement(optionsContainerSelector).offsetHeight;
    }
}

export interface INavOptionState {
    prevHeight: number;
    navOptions: ISingleNavOption[];
}

interface ISingleNavOption {
    optionName: string;
    optionLink: string | URL;
}
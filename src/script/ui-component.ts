interface IUiEventHandler {
    selector: string;
    eventName: string;
    handlerFunc: (e: Event) => void;
}

export abstract class UiComponent {
    protected eventHandlers: IUiEventHandler[];
    protected lastRenderedState: any;
    protected shadowContainer!: HTMLElement;

    protected constructor(
        protected containerGenerator: () => HTMLElement,
        protected template: (context: any) => string,
        protected state: any
    ) {
        // @ts-ignore: decorator accesses this
        // I couldn't find a way to make the decorator run after the ctor
        if (!this.eventHandlers) this.eventHandlers = [];

        this.createShadowContainer();

        this.lastRenderedState = {};
    }

    public render() {
        // Make sure there is a container to render into
        if (!this.shadowContainer.isConnected) this.createShadowContainer();

        this.lastRenderedState = this.state;

        this.preRender();
        this.shadowContainer.innerHTML = this.template(this.state);
        this.postRender();
        this.bindAllHandlers();
    }

    public setState(newState: any) {
        this.state = newState;
        this.render();
    }

    protected getElement(selector: string): HTMLElement {
        return this.shadowContainer.querySelector(selector) as HTMLElement;
    }

    private createShadowContainer() {
        let shadow: ShadowRoot;
        shadow = this.containerGenerator().attachShadow({mode: 'open'});
        this.shadowContainer = document.createElement('div');
        shadow.appendChild(this.shadowContainer);
    }

    public preRender(): void  {}
    public postRender(): void {}

    public addEventHandler(elementSelector: string, eventName: string, handler: (e: Event) => void) {
        // Make sure if the extends hasn't run yet (decorator), this still works
        if (!this.eventHandlers) this.eventHandlers = [];
        let newHandler = {
            selector: elementSelector,
            eventName: eventName,
            handlerFunc: handler
        };
        this.eventHandlers.push(newHandler);
        // Bind now (if handler was added after render)
        this.bindEventHandler(newHandler);
    }

    private bindAllHandlers() {
        // Save reference to the object as closure later on overrides this
        const self = this;
        self.eventHandlers.forEach(function (handler: IUiEventHandler) {
            self.bindEventHandler(handler);
        })
    }

    private bindEventHandler(handlerObject: IUiEventHandler) {
        // If there is no container we can't add any events to it.
        const self = this;
        if (!self.shadowContainer) return;

        self.shadowContainer.querySelectorAll<HTMLElement>(handlerObject.selector)
            .forEach(function (element: HTMLElement) {
                element.addEventListener(handlerObject.eventName, handlerObject.handlerFunc.bind(self));
            })
    }
}

export function eventHandler(selector: string, event: string) {
    return function (target: UiComponent, key: string | symbol, descriptor: PropertyDescriptor) {
        target.addEventHandler(selector, event, descriptor.value);
    }
}

interface IUiEventHandler {
    selector: string;
    eventName: string;
    handlerFunc: (e: Event) => void;
}

export abstract class UiComponent {
    protected eventHandlers: IUiEventHandler[];
    protected shadowRoot!: ShadowRoot;
    protected lastRenderedState: any;

    protected constructor(
        protected containerGenerator: () => HTMLElement,
        protected template: (context: any) => string,
        protected state: any
    ) {
        // @ts-ignore: decorator accesses this
        // I couldn't find a way to make the decorator run after the ctor
        if (!this.eventHandlers) this.eventHandlers = [];

        this.createShadowContainer();

        this.lastRenderedState = null;
    }

    public render() {
        let didChangeState = this.lastRenderedState != this.state;

        // Make sure there is a container to render into
        if (!this.shadowRoot.isConnected) {
            let oldContainer = this.shadowRoot;
            this.createShadowContainer();
        }

        // If no new container and no new state don't do anything
        if (!didChangeState) return;
        this.lastRenderedState = this.state;

        this.shadowRoot.innerHTML = this.template(this.state);
        this.bindAllHandlers();
    }

    public setState(newState: any) {
        this.state = newState;
        this.render();
    }

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

    public downloadStateFrom(url: string): Promise<void> {
        const self = this;
        return new Promise<void>(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    self.setState(JSON.parse(xhr.responseText));
                    resolve();
                } else {
                    reject(
                        `Failed to get state for${self.constructor.name} from: ${url} returned ${xhr.status}`);
                }
            };
            xhr.send();
        });
    }

    protected getElement(selector: string): HTMLElement {
        return this.shadowRoot.querySelector(selector) as HTMLElement;
    }

    private createShadowContainer() {
        let shadow = this.containerGenerator().attachShadow({mode: 'open'});
        if (this.shadowRoot) shadow.innerHTML = this.shadowRoot.innerHTML;
        this.shadowRoot = shadow;
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
        if (!self.shadowRoot) return;

        self.shadowRoot.querySelectorAll<HTMLElement>(handlerObject.selector)
            .forEach(function (element: HTMLElement) {
                element.addEventListener(
                    handlerObject.eventName,
                    handlerObject.handlerFunc.bind(self)
                );
            })
    }
}

export function eventHandler(selector: string, event: string) {
    return function (
        target: UiComponent,
        key: string | symbol,
        descriptor: PropertyDescriptor) {
        target.addEventHandler(selector, event, descriptor.value);
    }
}

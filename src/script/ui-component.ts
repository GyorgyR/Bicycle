interface IUiEventHandler {
    selector: string;
    eventName: string;
    handlerFunc: (e: Event) => void;
}

export abstract class UiComponent {
    protected eventHandlers: IUiEventHandler[];

    protected constructor(
        protected container: HTMLElement,
        protected template: any,
        protected state: any
    ) {
        // @ts-ignore: decorator accesses this
        // I couldn't find a way to make the decorator run after the ctor
        if (!this.eventHandlers) this.eventHandlers = [];
    }

    public setState(newState: any) {
        this.state = newState;
        this.render();
    }

    public render() {
        this.container.innerHTML = this.template(this.state);
        this.afterRender();
		this.bindAllHandlers();
    }

    public afterRender(): void {
    }

    public addEventHandler(elementSelector: string, eventName: string, handler: (e: Event) => void) {
        // Make sure if the ctor hasn't run yet (decorator), this still works
        if (!this.eventHandlers) this.eventHandlers = [];
        let newHandler = {
			selector: elementSelector,
			eventName: eventName,
			handlerFunc: handler
		};
        this.eventHandlers.push(newHandler);
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
    	if (!this.container) return;

    	this.container.querySelectorAll<HTMLElement>(handlerObject.selector)
			.forEach(function (element: HTMLElement) {
			element.addEventListener(handlerObject.eventName, handlerObject.handlerFunc);
		})
	}
}

export function eventHandler(selector: string, event: string) {
    return function (target: UiComponent, key: string | symbol, descriptor: PropertyDescriptor) {
        target.addEventHandler(selector, event, descriptor.value);
    }
}


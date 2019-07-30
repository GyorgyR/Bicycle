export abstract class UiComponent {
	protected constructor(
		protected container: HTMLElement,
		protected template: any,
		protected state: any
		) {

	}

	public render() {
		this.container.innerHTML = this.template(this.state);
	}

	abstract afterRender();
}

class DynamicForm extends HTMLFormElement {
  constructor() {
    super();
    // Initialize any custom state or bindings here
    this.handleSubmit = this.handleSubmit.bind(this);
    console.log('constructor called')
  }

  connectedCallback() {
    console.log('connected')
    this.addEventListener('submit', this.handleSubmit);
  }

  disconnectedCallback() {
    this.removeEventListener('submit', this.handleSubmit);
  }

  inTransitionClass(action, transition) {
    // action is add or remove
    // transition is 'in-flight' or 'error'
    const attr = transition === 'in-flight' ?
      'add-class-in-flight' : 'add-class-error';
    const className = this.getAttribute(attr);
    if (className && action === 'add') {
      this.classList.add(className);
      return;
    } else if (className && action === 'remove') {
      this.classList.remove(className);
      return;
    }
  }

  emitEvent(eventName, data) {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      ...data
    })
    this.dispatchEvent(event)
  }

  async handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    const method = this.getAttribute('method') || 'POST';
    const action = this.getAttribute('action');

    try {
      const formData = new FormData(this);

      this.emitEvent('form-submit-request', { formData })
      this.inTransitionClass('add', 'in-flight');
      const response = await fetch(action, {
        method,
        body: formData,
        headers: { "Accept": "text/html" }
      });

      if (!response.ok) throw new Error('Server responded with an error.');

      const content = await response.text();
      this.inTransitionClass('remove', 'in-flight');
      console.log('replacing outerHTML with', content)
      this.emitEvent(
        'form-submit-success',
        { bubbles: true, composed: true, formData, detail: { content } }
      );
      this.innerHTML = content;
      console.log('this.outerHTML=', this.innerHTML)

      // Optionally emit a custom event to indicate success

    } catch (error) {

      this.inTransitionClass('remove', 'in-flight')
      this.inTransitionClass('add', 'error')

      this.dispatchEvent(new CustomEvent('form-submit-error', { bubbles: true, composed: true, detail: { error } }));
    }
  }
}

export default DynamicForm;

customElements.define('dynamic-form', DynamicForm, { extends: 'form' });

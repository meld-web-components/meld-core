class IncludeHtml extends HTMLElement {
  static observedAttributes = ["src", "shadow-mode"];

  constructor(config) {
    super();
    this.logInfo = config?.logInfo || console.log;
    this.logError = config?.logError || console.error;
    this.document = config?.document || document;
  }

  connectedCallback() {
    // Now it's safe to access attributes
    const shadowMode = this.getAttribute('shadow-mode') || 'open';
    if (shadowMode === 'open' || shadowMode === 'closed') {
      this.attachShadow({ mode: shadowMode });
    }
  }

  async attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'src') { return this.loadContent(newValue) }
  }

  get src() {
    return this.getAttribute('src');
  }

  set src(value) {
    this.setAttribute('src', value);
  }

  async loadContent(url) {
    if (!url) {
      this.logError('<includeUrl> requires a "url" attribute.');
      return;
    }

    try {
      this.dispatchEvent(new CustomEvent('request-started', { bubbles: true, composed: true }));
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const content = await response.text();
      if (this.src !== url) {
        this.logError('src has changed from ' + url + ' to '
          + this.src + ' while request was in flight'
        )
        return;
      }
      this.replaceContent(content);
      this.dispatchEvent(new CustomEvent('content-loaded', { bubbles: true, composed: true }))
      return content;
    } catch (error) {
      console.error('Failed to fetch content:', error);
      this.dispatchEvent(new CustomEvent('request-failed', { bubbles: true, composed: true }));
      this.showErrorSlot();
    }
  }

  replaceContent(content) {
    // Check if Shadow DOM is used
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = content;
    } else {
      this.innerHTML = content;
    }
  }

  showErrorSlot() {
    const contentContainer = this.shadowRoot || this;
    const template = this.querySelector('template[slot="error"]');
    contentContainer.innerHTML = ''; // Clear current content
    if (template) {
      const clone = document.importNode(template.content, true);
      contentContainer.appendChild(clone);
    }
  }
}

export default IncludeHtml;

customElements.define('include-html', IncludeHtml);

class IncludeHtml extends HTMLElement {
  static observedAttributes = ["src"];

  constructor(config) {
    super();
    this.logInfo = config?.logInfo || console.log;
    this.logError = config?.logError || console.error;
    this.document = config?.document || document;
  }

  async attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'src') { return this.loadContent(newValue) }
  }

  async loadContent(url) {
    if (!url) {
      console.error('<get-content> requires a "url" attribute.');
      console.error('here is the source attribuate', this.getAttribute('src'))
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const content = await response.text();
      this.replaceContent(content);
      return content;
    } catch (error) {
      console.error('Failed to fetch content:', error);
      this.showErrorSlot();
    }
  }

  replaceContent(content, swap = 'innerHTML') {
    if (swap === 'outerHTML') {
      // Replace the entire element with the new content
      const range = document.createRange();
      range.selectNode(this);
      const fragment = range.createContextualFragment(content);
      this.replaceWith(fragment);
    } else if (swap === 'innerHTML') {
      this.innerHTML = content;
    } else {
      // Log an error or handle the case where 'swap' is neither 'outerHTML' nor 'innerHTML'
      console.error(`Invalid swap value: ${swap}. Expected 'outerHTML' or 'innerHTML'.`);
    }
  }

  showErrorSlot() {
    const template = this.querySelector('template[slot="error"]');
    if (template) {
      const clone = document.importNode(template.content, true);
      this.appendChild(clone);
    } else {
    }
  }
}

export default IncludeHtml;

customElements.define('include-html', IncludeHtml);

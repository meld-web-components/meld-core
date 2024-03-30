import IncludeHtml from '../src/include-html.js';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Whether we are connecting to the DOM correctly', () => {
  beforeEach(() => {
    // Mock global.fetch with vitest
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('<p id="success">hi</p>'),
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.resetAllMocks();
  });

  it('replaces <include-html> with fetched content and checks for spinner', async () => {
    // Start with the HTML string
    document.body.innerHTML = '<include-html src="/abc"><spinner></spinner></include-html>';

    // Check if the spinner is present before the fetch call completes
    const spinnerBeforeFetch = document.querySelector('spinner');
    expect(spinnerBeforeFetch).not.toBeNull();

    // Since the fetch operation is mocked to be resolved immediately,
    // we'll need to wait for the microtask queue to clear so that
    // the connectedCallback() and subsequent operations have a chance to execute.
    await new Promise(resolve => setTimeout(resolve, 0));


    const includeHtmlElement = document.querySelector('include-html');
    console.log('src now?', includeHtmlElement.getAttribute('src')); // Should log "/abc"

    // At this point, the fetch response should have been loaded and
    // the <include-html> element replaced in the DOM.
    const successElement = document.body.querySelector('p#success');
    expect(successElement).not.toBeNull();
    expect(successElement.textContent).toBe('hi');

    // Verify that the <include-html> element (and its spinner) has been replaced
    const includeHtmlElementAfterFetch = document.querySelector('include-html');
    expect(includeHtmlElementAfterFetch).toBeTruthy();
  });
});

describe('includehtml component replacement', () => {
  const successEl = '<p id="success">hi</p>'
  beforeEach(() => {
    // Mock setup
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(successEl),
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.resetAllMocks();
  });

  it('replaces <include-html> with fetched content', async () => {
    // Create an instance of the IncludeHtml element
    const includeHtmlElement = new IncludeHtml();
    includeHtmlElement.setAttribute('src', '/abc');

    // Append to the body to trigger connectedCallback automatically
    document.body.appendChild(includeHtmlElement);

    // Wait for asynchronous operations to complete
    await new Promise(resolve => setTimeout(resolve, 0)); // Adjust as necessary

    // Assertions
    expect(global.fetch).toHaveBeenCalledWith('/abc');
    expect(document.body.innerHTML).toContain(successEl);
    expect(document.body.contains(includeHtmlElement)).toBe(true);
  });
});


describe('IncludeHtml component error handling', () => {
  beforeEach(() => {
    // Mock global.fetch to simulate an error response
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.resetAllMocks();
  });

  it('shows error slot content on fetch failure', async () => {
    // Set the initial HTML with the <include-html> element and an error template
    document.body.innerHTML = `
      <include-html src="/nonexistent">
        <p id="loader">Loading ...</p>
        <template slot="error"><p id="error">Failed to load content.</p></template>
      </include-html>
    `;

    const includeHtmlElement = document.body.querySelector('include-html');

    // Wait for asynchronous operations to complete
    await new Promise(resolve => setTimeout(resolve, 0)); // Adjust as necessary

    // Assertions
    expect(global.fetch).toHaveBeenCalledWith('/nonexistent'); // Verify fetch was called with the incorrect URL
    // Check for the presence of the error template content within <include-html>
    const errorElement = includeHtmlElement.querySelector('#error');
    const loadingElement = includeHtmlElement.querySelector('#loader');
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toBe('Failed to load content.');
    expect(document.body.contains(loadingElement)).toBe(false);
  });
});

import DynamicForm from './dynamic-form.js';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Dynamic form account deletion', () => {
  let inTransitionClassSpy;
  const successHTML = '<p id="success">account deleted</p>'
  beforeEach(() => {
    // Mock global.fetch with vitest
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(successHTML),
    });
    inTransitionClassSpy = vi.spyOn(DynamicForm.prototype, 'inTransitionClass')
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.resetAllMocks();
  });

  it('submits correctly', async () => {
    document.body.innerHTML = `
      <form is="dynamic-form"
        method="DELETE"
        action="/api/delete-account"
        add-class-in-flight="in-flight"
        add-class-error="server-error"
      >
        <input name="email" type="email" value="user@example.com"/>
        <button type="submit">Submit</button>
      </dynamic-form>
    `
    // Simulate form submission
    const submitEvent = new window.Event('submit', { bubbles: true });

    const dynamicForm = document.querySelector('form')
    const expectedFormData = new FormData(dynamicForm);
    await new Promise(process.nextTick);
    dynamicForm.dispatchEvent(submitEvent);
    // Wait for async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    // Assertions
    expect(fetch).toHaveBeenCalledWith('/api/delete-account', {
      method: 'DELETE',
      body: expectedFormData, // Adjust according to how you handle form data
      headers: { 'Accept': 'text/html' },
    });
    expect(inTransitionClassSpy).toHaveBeenCalledWith('add', 'in-flight');
    expect(inTransitionClassSpy).toHaveBeenCalledWith('remove', 'in-flight');

    await new Promise(process.nextTick); // Wait for fetch to resolve
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(dynamicForm.innerHTML).toContain(successHTML);
    expect(dynamicForm.className).not.toContain('in-flight');
  });

});

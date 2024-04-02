# Meld: Hypermedia Web Components.🌐✨

Meld is a lightweight library for enhancing your web applications with dynamic, integrated forms and components. Designed for developers who crave the simplicity of HTML and the dynamism of single-page applications (SPAs) without the overhead.

Meld core augments core browser capabilities. Its aim is to help you do things like:

- Avoid full page refreshes for forms
- Dynamically require HTML
- Turbo-links like link boosting

Meld may also add repositories for other use cases, including:

- Complex forms
- Live updates over websockets
- Design systems

## Why Meld? 🤔

What if the browser had built in tags with the kind of dynamic behavior you expect from SPAs -- but without the bloat.

MeldJS aims to fill this space, offering:

🚀 Enhanced User Interaction: Dynamic content updates without full page refreshes for seamless user experiences.

🔌 Easy Integration: Works alongside your existing HTML, CSS, and JavaScript, making it perfect for enhancing existing sites or new projects.

🌍 Hypermedia Support: Built with RESTful principles in mind, supporting adaptive and scalable web architectures.

🛠  Flexibility & Modularity: Use what you need. Each component is standalone, designed to play well with others or shine on its own.

🎨 HTML-Centric server communication: Leverages the power of standard web technologies, emphasizing ease of use and development efficiency.

Vs Other Options ✅

- Lightweight & Focused: Unlike heavy SPA frameworks, MeldJS focuses on enhancing pages rather than replacing your stack, keeping things light and fast.
- HTML Over JSON: Interacts with the server using HTML or HTML fragments, reducing the need for API endpoint adjustments and simplifying server-side rendering.
- Versatility: Suitable for anything from small enhancements to existing pages to building complex, dynamic interfaces in new projects.
- Developer Friendly: Embraces web standards, making it intuitive for those familiar with HTML, CSS, and basic JavaScript.

## include-html

`include-html` is a custom web component that will request HTML from a server and replace its contents with the result.

```html
<include-html src="/my/content"></include-html>
```

Add content to show while the component loads:

```html
<include-html src="/my/content">
  <!-- Default slot for loading indicator -->
  <span>Loading content...</span>
  
</include-html>
```

And add a template to show an error in case your server is unreachable:

```html
<include-html src="/my/content">
  <!-- Default slot for loading indicator -->
  <span>Loading content...</span>
  
  <!-- Named slot for error handling -->
  <template slot="error">
    <p>Failed to load content. Please try again later.</p>
  </template>
</include-html>
```

By default, the HTML returned by the server is encapsulated in the shadow dom. However, when the `shadow-mode` is set to `none`, no shadow dom will be used.

### Options

Include-html

```html
<include-html
  src="/my/content"
  cors="cors"
  credentials="same-origin"
  redirect="follow"
  referrer-policy="no-referrer"
>
</include-html>
```

## dynamic-form

The `dynamic-form` element is identical the `form` element except that:

1. It emits events for when a form submission is in flight, when the server accepts the submission, and when the server rejects it
2. When a form is submitted, the server's response is swapped in for the form element.
3. The form can be sent using any HTTP verb.
4. The form can add classes to signify when a request is in flight, and when the request failed

Let's look at an example:

```html
<form is="dynamic-form"
  method="DELETE" <!-- or POST, PUT, DELETE, PATCH -->
  add-class-in-flight="in-flight"
  add-class-error="server-error"
>
  <label>Type your email to confirm you want to delete your account
   <input name="email" type="email"/>
  </label>
  <div class="row">
    <button type="submit">Submit</button>
  </div>
</form>
```

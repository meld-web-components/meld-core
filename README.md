# Meld: Hypermedia Web Components


## <include-html>

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

### Options

```html
<include-html
  src="/my/content"
  swap="outerHTML" <!-- Defaults to innerHTML -->
>
</include-html>
```

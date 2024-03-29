# Meld: Hypermedia Web Components

## get-content

`get-content` will request HTML from the server and replace itself with the result.

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

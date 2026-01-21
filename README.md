## prettier-plugin-czech-nbsp

Prettier plugin that inserts **Unicode NBSP (U+00A0)** after Czech one-letter prepositions/conjunctions:
`k, s, v, z, o, u, i, a`

### What it does
- Only changes **text between HTML tags**
- Does **not** touch tag names or attributes
- Skips content inside: `script, style, pre, code, noscript, svg, textarea, template`
- Skips Handlebars moustache blocks: `{{ ... }}`

### Install
npm i -D prettier prettier-plugin-czech-nbsp

### Usage
Add the plugin to your Prettier config.

`package.json`
```json
{
  "prettier": {
    "plugins": ["prettier-plugin-czech-nbsp"]
  }
}
```

Then run Prettier as usual:
```
npx prettier . --write
```

### Example
Input:
```
<p>Byl jsem v Praze a v Brne.</p>
```

Output:
```
<p>Byl jsem v&nbsp;Praze a&nbsp;v&nbsp;Brne.</p>
```

### Supported formats
This plugin targets HTML output produced by Prettier for:
- `html`
- `vue`
- `svelte`
- `astro`
- `md`, `mdx` (only in inline HTML)

### Configuration
This plugin has no custom options. It runs automatically when the plugin is enabled.

### Development
```
npm install
npm test
```

### License
MIT
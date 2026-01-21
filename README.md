## prettier-plugin-czech-nbsp

Prettier plugin that inserts **Unicode NBSP (U+00A0)** after Czech one-letter prepositions/conjunctions:
`k, s, v, z, o, u, i, a`

### What it does
- Only changes **text between HTML tags**
- Does **not** touch tag names or attributes
- Skips content inside: `script, style, pre, code, noscript, svg, textarea, template`
- Skips Handlebars moustache blocks: `{{ ... }}`

### Install
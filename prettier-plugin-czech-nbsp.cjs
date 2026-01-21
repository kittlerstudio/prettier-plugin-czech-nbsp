// Safe, non-destructive Prettier plugin:
// - never re-serializes HTML
// - only edits TEXT BETWEEN TAGS
// - skips excluded tag bodies (<script>, <style>, <pre>, <code>, <noscript>)
// - skips Handlebars moustache blocks {{ ... }}

const PREPOSITIONS = ['k', 's', 'v', 'z', 'o', 'u', 'i', 'a']
const EXCLUDED_TAGS = new Set(['script', 'style', 'pre', 'code', 'noscript', 'svg', 'textarea', 'template'])
const NBSP = '\u00A0'

// Matches: start or whitespace + one-letter token + whitespace(s)
const NBSP_RE = new RegExp(`(^|\\s)(${PREPOSITIONS.join('|')})\\s+`, 'gmi')

function applyNbspToPlainText(text) {
  return text.replace(NBSP_RE, (_m, prefix, token) => `${prefix}${token}${NBSP}`)
}

function applyNbspSkippingMoustache(text) {
  const parts = text.split(/(\{\{[\s\S]*?\}\})/g)
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (part.startsWith('{{') && part.endsWith('}}')) continue
    parts[i] = applyNbspToPlainText(part)
  }
  return parts.join('')
}

function parseTagName(tagToken) {
  if (tagToken.startsWith('<!--')) return null
  if (tagToken.startsWith('<!')) return null
  const m = tagToken.match(/^<\s*\/?\s*([a-zA-Z0-9:-]+)/)
  return m ? m[1].toLowerCase() : null
}

function isClosingTag(tagToken) {
  return /^<\s*\//.test(tagToken)
}

function addNbspInHtmlTextNodesOnly(html) {
  const tagRe = /<!--[\s\S]*?-->|<[^>]*>/g

  let excludedDepth = 0
  const excludedStack = []

  let out = ''
  let lastIndex = 0
  let match

  while ((match = tagRe.exec(html)) !== null) {
    const tagStart = match.index
    const tagToken = match[0]

    const textChunk = html.slice(lastIndex, tagStart)
    if (textChunk) {
      out += excludedDepth > 0 ? textChunk : applyNbspSkippingMoustache(textChunk)
    }

    out += tagToken

    const tagName = parseTagName(tagToken)
    if (tagName && EXCLUDED_TAGS.has(tagName)) {
      if (isClosingTag(tagToken)) {
        for (let i = excludedStack.length - 1; i >= 0; i--) {
          const popped = excludedStack.pop()
          excludedDepth = Math.max(0, excludedDepth - 1)
          if (popped === tagName) break
        }
      } else {
        const isSelfClosing = /\/\s*>$/.test(tagToken)
        if (!isSelfClosing) {
          excludedStack.push(tagName)
          excludedDepth += 1
        }
      }
    }

    lastIndex = tagRe.lastIndex
  }

  const tail = html.slice(lastIndex)
  if (tail) out += excludedDepth > 0 ? tail : applyNbspSkippingMoustache(tail)

  return out
}

module.exports = {
  parsers: {
    html: {
      ...require('prettier/parser-html').parsers.html,
      preprocess(text) {
        return addNbspInHtmlTextNodesOnly(text)
      }
    }
  }
}
import DOMPurify from 'dompurify'
import { marked } from 'marked'

/* tiny escapes */
function escHtml(s: string) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}
function escAttr(s: string) {
    return escHtml(s).replace(/"/g, '&quot;')
}

/**
 * LITM/Brumes inline extension
 *
 * Order mirrors your classifier:
 *   1) weakness:  {!name}
 *   2) status:    {name-<digits or empty>}
 *   3) limit:     {name:<digits or empty>}
 *   4) tag/power: {name}
 *
 * Notes:
 * - names may contain hyphens/spaces/etc. (anything except "}" really)
 * - status/limit value may be empty => data-* attribute is ""
 */
const litmInlineExt = {
    name: 'litm',
    level: 'inline' as const,

    start(src: string) {
        return src.indexOf('{')
    },

    tokenizer(src: string) {
        let m: RegExpExecArray | null

        // 1) {!name}  (weakness)
        if ((m = /^\{\!([^{}]+)\}/.exec(src))) {
            return {
                type: 'litm',
                raw: m[0],
                variant: 'weakness',
                name: m[1].trim(),
            }
        }

        // 2) {name-<digits or empty>}  (status)
        //    name can contain anything except "}" and we require a "-" before the closing "}"
        if ((m = /^\{([^{}]*?)-(\d*)\}/.exec(src))) {
            return {
                type: 'litm',
                raw: m[0],
                variant: 'status',
                name: m[1].trim(),
                value: m[2], // may be ""
            }
        }

        // 3) {name:<digits or empty>}   (limit)
        if ((m = /^\{([^{}]*?):(\d*)\}/.exec(src))) {
            return {
                type: 'litm',
                raw: m[0],
                variant: 'limit',
                name: m[1].trim(),
                value: m[2], // may be ""
            }
        }

        // 4) {name}  (generic tag / "power")
        if ((m = /^\{([^{}]+)\}/.exec(src))) {
            return {
                type: 'litm',
                raw: m[0],
                variant: 'tag',
                name: m[1].trim(),
            }
        }

        return false
    },

    renderer(token: any) {
        switch (token.variant) {
            case 'weakness':
                // Both class systems for easy theming
                return `<span class="litm-weakness brumes-weakness" data-tag-name="${escAttr(token.name)}">${escHtml(token.name)}</span>`

            case 'status': {
                const text =
                    token.value === ''
                        ? token.name
                        : `${token.name}-${token.value}`
                return `<span class="litm-status brumes-status" data-status-name="${escAttr(token.name)}" data-status-value="${escAttr(token.value ?? '')}">${escHtml(text)}</span>`
            }

            case 'limit':
                // number shown via ::after from data-limit-value; if empty => nothing displayed
                return `<span class="litm-limit brumes-limit" data-limit-name="${escAttr(token.name)}" data-limit-value="${escAttr(token.value ?? '')}">${escHtml(token.name)}</span>`

            case 'tag':
            default:
                // generic tag == "power" in your classifier
                return `<span class="litm-tag brumes-power" data-tag-name="${escAttr(token.name)}">${escHtml(token.name)}</span>`
        }
    },
} as const

let litmRegistered = false

function ensureLitmRegistered() {
    if (!litmRegistered) {
        marked.use({
            gfm: true,
            breaks: false,
            extensions: [litmInlineExt], // your existing single-token extension
        })
        litmRegistered = true
    }
}

/** Block renderer (keeps paragraphs, lists, etc.) */
export function renderLitmMarkdown(md: string) {
    ensureLitmRegistered()
    const html = marked.parse(md ?? '')
    return DOMPurify.sanitize(String(html))
}

/** Inline renderer (no <p> wrapper; perfect for single tokens/phrases). */
export function renderLitmInline(text: string) {
    ensureLitmRegistered()
    const html = marked.parseInline(text ?? '')
    return DOMPurify.sanitize(String(html))
}

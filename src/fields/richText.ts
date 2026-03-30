type UnknownRecord = Record<string, unknown>

export type LexicalRichTextValue = {
  root: {
    type: 'root'
    children: ParagraphNode[]
    direction: null
    format: ''
    indent: 0
    version: 1
  }
}

type TextNode = {
  type: 'text'
  detail: number
  format: number
  mode: 'normal'
  style: string
  text: string
  version: 1
}

type LineBreakNode = {
  type: 'linebreak'
  version: 1
}

type ParagraphChildNode = TextNode | LineBreakNode

type ParagraphNode = {
  type: 'paragraph'
  children: ParagraphChildNode[]
  direction: null
  format: ''
  indent: 0
  textFormat: 0
  textStyle: ''
  version: 1
}

const EMPTY_PARAGRAPH: ParagraphNode = {
  type: 'paragraph' as const,
  children: [],
  direction: null,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  textStyle: '',
  version: 1 as const,
}

const createTextNode = (text: string): TextNode => ({
  type: 'text' as const,
  detail: 0,
  format: 0,
  mode: 'normal' as const,
  style: '',
  text,
  version: 1 as const,
})

const createLineBreakNode = (): LineBreakNode => ({
  type: 'linebreak' as const,
  version: 1 as const,
})

const asRecord = (value: unknown): UnknownRecord | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as UnknownRecord
}

const looksLikeSerializedJson = (value: string): boolean => {
  const trimmed = value.trim()

  return (
    (trimmed.startsWith('{') && trimmed.endsWith('}'))
    || (trimmed.startsWith('[') && trimmed.endsWith(']'))
    || (trimmed.startsWith('"') && trimmed.endsWith('"'))
  )
}

export const isLexicalRichTextValue = (value: unknown): value is LexicalRichTextValue => {
  const documentRecord = asRecord(value)
  const rootRecord = asRecord(documentRecord?.root)

  return Boolean(rootRecord && rootRecord.type === 'root' && Array.isArray(rootRecord.children))
}

const tryParseSerializedLexicalRichText = (
  value: string,
  depth = 0,
): LexicalRichTextValue | null => {
  if (depth > 2 || !looksLikeSerializedJson(value)) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as unknown

    if (typeof parsed === 'string') {
      return tryParseSerializedLexicalRichText(parsed, depth + 1)
    }

    return isLexicalRichTextValue(parsed) ? parsed : null
  } catch {
    return null
  }
}

export const createLexicalRichTextFromPlainText = (value: string): LexicalRichTextValue => {
  const normalizedText = value.replace(/\r\n/g, '\n').trim()
  const paragraphs = normalizedText
    ? normalizedText
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
    : []

  const children =
    paragraphs.length > 0
      ? paragraphs.map((paragraph) => {
          const lines = paragraph.split('\n')
          const paragraphChildren = lines.flatMap((line, index) => {
            const nodes: ParagraphChildNode[] = [createTextNode(line)]

            if (index < lines.length - 1) {
              nodes.push(createLineBreakNode())
            }

            return nodes
          })

          return {
            ...EMPTY_PARAGRAPH,
            children: paragraphChildren,
          }
        })
      : [EMPTY_PARAGRAPH]

  return {
    root: {
      type: 'root',
      children,
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

export const coerceLexicalRichTextValue = (value: unknown): unknown => {
  if (isLexicalRichTextValue(value)) {
    return value
  }

  if (typeof value === 'string') {
    return tryParseSerializedLexicalRichText(value) || createLexicalRichTextFromPlainText(value)
  }

  return value
}

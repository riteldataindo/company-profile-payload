export function extractText(richText: any): string {
  if (!richText) return ''
  if (typeof richText === 'string') return richText

  const root = richText?.root
  if (!root?.children) return ''

  return root.children
    .map((node: any) => extractNodeText(node))
    .filter(Boolean)
    .join('\n')
}

function extractNodeText(node: any): string {
  if (!node) return ''
  if (node.type === 'text') return node.text || ''
  if (node.children) {
    return node.children.map((child: any) => extractNodeText(child)).join('')
  }
  return ''
}

export function extractParagraphs(richText: any): string[] {
  if (!richText) return []
  if (typeof richText === 'string') return [richText]

  const root = richText?.root
  if (!root?.children) return []

  return root.children
    .map((node: any) => {
      if (node.children) {
        return node.children.map((child: any) => extractNodeText(child)).join('')
      }
      return ''
    })
    .filter(Boolean)
}

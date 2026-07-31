import type { ReactNode } from 'react'
import {
  extractText,
  safeRichTextHref,
  slugifyHeading,
} from '@/lib/richtext'

type RichTextNode = {
  type?: string
  tag?: string
  text?: string
  format?: number | string
  url?: string
  fields?: {
    url?: string
    newTab?: boolean
    linkType?: string
    doc?: { value?: { slug?: string } }
  }
  children?: RichTextNode[]
  listType?: string
  start?: number
}

function TextNode({ node }: { node: RichTextNode }) {
  let content: ReactNode = node.text || ''
  const format = typeof node.format === 'number' ? node.format : 0

  if (format & 16) content = <code>{content}</code>
  if (format & 1) content = <strong>{content}</strong>
  if (format & 2) content = <em>{content}</em>
  if (format & 8) content = <u>{content}</u>
  if (format & 4) content = <s>{content}</s>
  if (format & 32) content = <sub>{content}</sub>
  if (format & 64) content = <sup>{content}</sup>

  return content
}

export function LexicalRichText({
  data,
  className = '',
}: {
  data: any
  className?: string
}) {
  const headingCounts = new Map<string, number>()

  function renderChildren(node: RichTextNode): ReactNode {
    return node.children?.map((child, index) => renderNode(child, index))
  }

  function renderNode(node: RichTextNode, key: number | string): ReactNode {
    if (!node) return null
    if (node.type === 'text') return <TextNode key={key} node={node} />
    if (node.type === 'linebreak') return <br key={key} />

    const children = renderChildren(node)
    switch (node.type) {
      case 'root':
        return children
      case 'paragraph':
        return <p key={key}>{children}</p>
      case 'heading': {
        const title = extractText({ root: { children: [node] } }).trim()
        const baseId = slugifyHeading(title)
        const count = (headingCounts.get(baseId) || 0) + 1
        headingCounts.set(baseId, count)
        const id = count === 1 ? baseId : `${baseId}-${count}`
        const tag = ['h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tag || '')
          ? node.tag as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
          : 'h2'
        const Heading = tag
        return <Heading id={id} key={key}>{children}</Heading>
      }
      case 'quote':
        return <blockquote key={key}>{children}</blockquote>
      case 'list':
        return node.listType === 'number'
          ? <ol key={key} start={node.start}>{children}</ol>
          : <ul key={key}>{children}</ul>
      case 'listitem':
        return <li key={key}>{children}</li>
      case 'link':
      case 'autolink': {
        const href = safeRichTextHref(node.fields?.url || node.url)
        if (!href) return <span key={key}>{children}</span>
        const newTab = node.fields?.newTab === true
        return (
          <a
            href={href}
            key={key}
            rel={newTab ? 'noopener noreferrer' : undefined}
            target={newTab ? '_blank' : undefined}
          >
            {children}
          </a>
        )
      }
      default:
        return <span key={key}>{children}</span>
    }
  }

  if (typeof data === 'string') {
    return <div className={`rich-text ${className}`.trim()}><p>{data}</p></div>
  }
  if (!Array.isArray(data?.root?.children)) return null

  return (
    <div className={`rich-text ${className}`.trim()}>
      {renderNode(data.root, 'root')}
    </div>
  )
}

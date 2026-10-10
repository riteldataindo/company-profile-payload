export type ProductText = { en: string; id: string }

export type ProductScreen = {
  id: string
  solution: 'retail' | 'mall'
  /** Path under /public, for example `/product/retail-overview.webp`. */
  src: string
  width: number
  height: number
  alt: ProductText
  title: ProductText
  /** Where the data comes from, for example "Actual SmartCounter interface with demo data." */
  dataNote: ProductText
  /** Numbered notes pinned to the screenshot; x and y are percentages of the image. */
  callouts: Array<{ x: number; y: number; text: ProductText }>
}

// Approved screenshots only. Put the file in public/product/ and add an entry here when
// it shows the actual SmartCounter interface, all data is demo or anonymized (no
// customer, store, tenant, or person names), and the owner approved it for the public
// site. While this list is empty the homepage and demo page hide the section.
export const productScreens: ProductScreen[] = []

export function screensFor(solution?: 'retail' | 'mall', screens: ProductScreen[] = productScreens) {
  return solution ? screens.filter((screen) => screen.solution === solution) : screens
}

export function productScreenProblems(screen: ProductScreen, fileExists: (src: string) => boolean): string[] {
  const problems: string[] = []
  const texts: Array<[string, ProductText]> = [
    ['alt', screen.alt],
    ['title', screen.title],
    ['dataNote', screen.dataNote],
    ...screen.callouts.map((callout, index): [string, ProductText] => [`callout ${index + 1}`, callout.text]),
  ]
  if (!screen.src.startsWith('/product/')) problems.push('src must live under /product/')
  else if (!fileExists(screen.src)) problems.push(`missing file public${screen.src}`)
  if (!(screen.width > 0 && screen.height > 0)) problems.push('width and height are required')
  for (const [name, value] of texts) {
    if (!value.en.trim() || !value.id.trim()) problems.push(`${name} needs English and Indonesian text`)
  }
  for (const [index, callout] of screen.callouts.entries()) {
    if (callout.x < 0 || callout.x > 100 || callout.y < 0 || callout.y > 100) {
      problems.push(`callout ${index + 1} must be positioned inside the image`)
    }
  }
  return problems
}

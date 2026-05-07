export interface CheckGuidance {
  what: string
  why: string
  fix: string
  good: string
  bad: string
}

export const SEO_GUIDANCE: Record<string, CheckGuidance> = {
  'Title Length': {
    what: 'The page title shown in Google search results (meta title)',
    why: 'Google truncates titles over 60 chars. Titles of 50-60 characters display fully and attract more clicks.',
    fix: 'Click "Fix" to auto-generate, or write manually within 50-60 characters including your primary keyword.',
    good: 'People Counting AI — SmartCounter Retail Analytics (51 chars)',
    bad: 'SmartCounter — The Best AI People Counting Platform for Retail Visitor Analytics in Indonesia (93 chars — gets cut off)',
  },
  'Title Unique': {
    what: 'Every page must have a different title',
    why: 'Duplicate titles confuse Google — it won\'t know which page to show in search results.',
    fix: 'Click "Fix" to generate a unique title. Make sure each page has a distinct angle.',
    good: 'Page A: "Heatmap Feature — SmartCounter" | Page B: "People Counting — SmartCounter"',
    bad: 'Both pages: "SmartCounter — Features"',
  },
  'Title Natural': {
    what: 'Title must read naturally, not look auto-generated or spammy',
    why: 'Unnatural titles lower CTR (click-through rate) in search results. Users skip robotic-looking titles.',
    fix: 'Click "Fix" to regenerate. Avoid excessive repetition and weird symbols (——, ...).',
    good: 'How People Counting Works with CCTV AI',
    bad: 'People Counting People Counting — People Counting System...',
  },
  'OG Image': {
    what: 'Preview image shown when page is shared on social media or chat apps',
    why: 'Content with images gets 156% more engagement. AI search also prioritizes multi-modal content.',
    fix: 'Upload a 1200x630px image in the SEO panel. Click "Fix" if available, or upload manually.',
    good: '1200x630 image with article title and relevant illustration',
    bad: 'No image — shows gray box when shared',
  },
  'OG Image Alt': {
    what: 'Alternative text for the OG image (read by screen readers and search engines)',
    why: 'Alt text helps Google understand image content. Important for accessibility and image SEO.',
    fix: 'Open Media library in Payload → edit the image → fill in the "Alt Text" field with a short description.',
    good: 'SmartCounter dashboard showing retail store traffic heatmap',
    bad: 'image.png / empty / blog-post-1',
  },
  'Content Image Alt': {
    what: 'Alternative text on the featured image of the page',
    why: 'Google can\'t "see" images — alt text explains image content to search engines.',
    fix: 'Edit the featured image in Payload → fill "Alt Text" with 10-125 characters.',
    good: 'CCTV AI camera counting visitors at retail store entrance',
    bad: 'photo1.jpg / image / (empty)',
  },
  'Desc Length': {
    what: 'Page description shown below the title in Google search results (meta description)',
    why: '120-150 characters displays fully in Google and attracts clicks. Too short = Google replaces it with random text from your page.',
    fix: 'Click "Fix" to auto-generate a 120-150 character description. Write compelling, informative sentences.',
    good: 'SmartCounter counts store visitors with 99.9% accuracy using CCTV AI. Optimize staffing and layout with real-time data. (120 chars)',
    bad: 'SmartCounter is an analytics platform. (39 chars — too short)',
  },
  'Desc Natural': {
    what: 'Description must be complete, natural sentences',
    why: 'Truncated or incomplete descriptions lower trust. Users skip search results with broken text.',
    fix: 'Click "Fix" to regenerate. Ensure description ends with proper punctuation (. ! ?) and contains verbs.',
    good: 'Learn how CCTV AI counts visitors with 99.9% accuracy for retail stores.',
    bad: 'People counting CCTV AI retail analytics visitor counter store...',
  },
  'E-E-A-T: Author': {
    what: 'Article author name — shows who is responsible for the content',
    why: 'Google evaluates content credibility by authorship. Content without an author is considered less trustworthy for B2B.',
    fix: 'Click "Edit" → in Payload editor, set the "Author" field → select or create a user. The name will appear in the byline and JSON-LD schema.',
    good: 'Tim Ritel Data Indonesia (author set, shown in byline)',
    bad: '(empty — no author assigned)',
  },
  'E-E-A-T: Date': {
    what: 'Article publication date',
    why: 'Content without dates looks unmaintained. Google and readers trust dated content more.',
    fix: 'Click "Edit" → in Payload editor, set the "Published At" field.',
    good: 'Published At: 2026-05-07',
    bad: '(empty — undated article)',
  },
  'E-E-A-T: Excerpt': {
    what: 'Short summary of the article (1-2 sentences)',
    why: 'Excerpt is used for SERP snippets and social media previews. Without it, Google grabs random text.',
    fix: 'Click "Edit" → in Payload editor, fill "Excerpt" field with 150-200 characters.',
    good: 'People counting system automatically counts store visitors. Learn how it works and its benefits for retail.',
    bad: '(empty)',
  },
  'E-E-A-T: Depth': {
    what: 'Content depth for feature or use case pages',
    why: 'Shallow content doesn\'t demonstrate expertise. Detailed descriptions build trust and improve rankings.',
    fix: 'Click "Edit" → expand the short/long description in Payload. Explain features, benefits, and usage examples.',
    good: '200+ word description covering features, how it works, benefits, and examples',
    bad: 'One sentence: "Heatmap feature for stores."',
  },
  'Opening Definition': {
    what: '"X is..." definition in the first 60 words of your content',
    why: 'AI search (Google AI Overview, ChatGPT, Perplexity) extracts definitions from the beginning of pages. No definition = won\'t be cited.',
    fix: 'Click "Edit" → add to the first paragraph:\n"{Title} is [short definition in 1 sentence]."\nExample: "People counting system is an AI technology that automatically counts visitors using CCTV cameras with 99.9% accuracy."',
    good: '"People counting system is an AI technology that automatically counts visitors using CCTV cameras."',
    bad: '"Welcome to the SmartCounter blog..." (no definition)',
  },
  'Citability Blocks': {
    what: 'Paragraphs that AI can quote as answers (100-200 words each)',
    why: 'AI search extracts paragraphs of 134-167 words as citations. Short paragraphs (<50 words) can\'t be cited standalone.',
    fix: 'Click "Edit" → in your content:\n1. Merge small paragraphs with the same topic\n2. Each section = 1 paragraph of 100-200 words that reads independently\n3. Start each section with a question: "How does...?" / "What are the benefits of...?"',
    good: 'A 150-word section that fully answers one question — AI can extract it without extra context',
    bad: 'Many 1-2 sentence paragraphs (20-30 words) — AI can\'t extract them standalone',
  },
  'Content Depth': {
    what: 'Total word count of the page content',
    why: 'Blog posts need 800+ words for comprehensive topic coverage. Thin content (<400 words) struggles to rank.',
    fix: 'Click "Edit" → add more content in Payload:\n• Add a "Case Study" or "Implementation Example" section\n• Add a "FAQ / Common Questions" section\n• Expand each section to 100-200 words',
    good: 'Blog post with 800-1500 words across 5-7 comprehensive sections',
    bad: 'Blog post with 200 words — too thin to rank',
  },
  'Topic Indicator': {
    what: 'Whether the primary keyword (people counting, CCTV AI, etc.) is in the title or content',
    why: 'Google needs to know the page topic. Keywords in the title = strongest signal.',
    fix: 'Click "Fix" to add keyword to the title. Or write manually — make sure the primary keyword is in the title.',
    good: 'Title: "How People Counting Works with CCTV AI" — keywords "people counting" and "CCTV AI" are in the title',
    bad: 'Title: "How Our System Works" — no specific keywords',
  },
}

export interface CheckGuidance {
  what: string
  why: string
  fix: string
  good: string
  bad: string
}

export const SEO_GUIDANCE: Record<string, CheckGuidance> = {
  'Meta Title': {
    what: 'A page-specific title that can be used in search previews.',
    why: 'A missing or vague title makes the page harder to identify. Search engines may rewrite or truncate any title depending on the result layout.',
    fix: 'Write a concise title that accurately distinguishes this page. Character count is context, not a pass/fail target.',
    good: 'Retail Heatmap Analytics for Store Layouts',
    bad: '(empty) or a generic title reused by several pages',
  },
  'Title Unique': {
    what: 'Whether this CMS title differs from the other audited items.',
    why: 'Distinct titles make page purpose clearer to users and crawlers.',
    fix: 'Give each page a specific angle and avoid copying the same title across several records.',
    good: 'Feature and use-case pages each describe their own subject.',
    bad: 'Several pages all use “SmartCounter Features”.',
  },
  'Title Readability': {
    what: 'A basic formatting and repetition check.',
    why: 'Generation artifacts and repeated phrases make previews hard to understand.',
    fix: 'Remove duplicated phrases, placeholder brackets, repeated punctuation, and broken separators.',
    good: 'How Visitor Counting Supports Retail Operations',
    bad: 'People Counting People Counting — — [1]',
  },
  'Meta Description': {
    what: 'Accurate preview copy summarizing the page.',
    why: 'Descriptions help readers decide whether a result is relevant. They are not a ranking factor and search engines may rewrite them.',
    fix: 'Summarize the page accurately in natural language. Do not pad copy to hit an exact character range.',
    good: 'See how aggregate visitor traffic and occupancy data support retail staffing and layout reviews.',
    bad: '(empty) or copy that promises results not supported by the page',
  },
  'Description Readability': {
    what: 'A basic formatting check for preview copy.',
    why: 'Broken punctuation and generation artifacts reduce clarity.',
    fix: 'Rewrite the description as complete, factual preview copy.',
    good: 'A complete and specific summary.',
    bad: 'Keyword keyword... [placeholder]',
  },
  'Social Image': {
    what: 'The image used when a page is shared.',
    why: 'A configured image makes social and chat previews more consistent.',
    fix: 'Choose a relevant image from the Media library. Verify the actual preview before publishing.',
    good: 'A page-specific image with correct dimensions and content.',
    bad: 'No image or an unrelated generic asset.',
  },
  'Social Image Alt': {
    what: 'Alternative text stored with the social image.',
    why: 'Meaningful alt text supports accessibility and asset management.',
    fix: 'Describe the useful visual content in the Media library without keyword stuffing.',
    good: 'Store dashboard showing hourly visitor traffic.',
    bad: 'image.png or an empty field.',
  },
  'Content Image Alt': {
    what: 'Alternative text for a content or featured image.',
    why: 'Alt text communicates meaningful visual content when the image cannot be seen.',
    fix: 'Describe the image’s purpose in context. Leave decorative imagery out of content when appropriate.',
    good: 'Heatmap overlay showing high-traffic zones near the entrance.',
    bad: 'photo1.jpg or repeated keywords.',
  },
  'Public Content': {
    what: 'Whether the record has body content available for its public page.',
    why: 'A public page needs useful, accurate content. There is no universal minimum word count.',
    fix: 'Add enough original information to satisfy the page’s user intent, then review accuracy and usefulness manually.',
    good: 'Clear explanation, limitations, use cases, and next steps.',
    bad: 'An empty body or a sentence written only to target a keyword.',
  },
  'Author Attribution': {
    what: 'The accountable author or editorial team for an article.',
    why: 'Authorship helps readers understand who is responsible for the content.',
    fix: 'Assign a real author or accountable editorial team in Payload.',
    good: 'Named author with an accurate profile.',
    bad: 'A fabricated person or no accountable owner.',
  },
  'Publication Date': {
    what: 'The article publication date.',
    why: 'Dates help readers assess context and freshness.',
    fix: 'Set the actual publication date and update content when facts materially change.',
    good: 'A date matching the article’s publication history.',
    bad: 'A false freshness date.',
  },
  'Editorial Summary': {
    what: 'A short factual summary for the article.',
    why: 'A summary improves scanning and gives previews reliable source copy.',
    fix: 'Write one or two factual sentences that match the article.',
    good: 'A precise summary without unsupported outcomes.',
    bad: 'Promotional copy unrelated to the article.',
  },
  'Claim Verification': {
    what: 'A basic scan for quantified outcomes, leadership claims, guarantees, and certifications.',
    why: 'High-risk claims should have evidence, scope, and an owner before publication.',
    fix: 'Open the record, attach evidence in the editorial workflow, scope the wording, or remove the claim. This scan cannot prove a claim is true.',
    good: 'A measured claim with source, date, sample, conditions, and approval.',
    bad: '“#1”, guaranteed ROI, certification, or performance percentages without evidence.',
  },
}

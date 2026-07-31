export const BLOG_PAGE_SIZE = 6
export const MAX_BLOG_PAGE = 1000

export type ParsedBlogPage = {
  page: number
  shouldRedirect: boolean
}

export function parseBlogPage(value: string | string[] | undefined): ParsedBlogPage {
  if (value === undefined) return { page: 1, shouldRedirect: false }
  if (Array.isArray(value) || !/^[1-9]\d*$/.test(value)) {
    return { page: 1, shouldRedirect: true }
  }

  const page = Number(value)
  if (!Number.isSafeInteger(page) || page > MAX_BLOG_PAGE) {
    return { page: 1, shouldRedirect: true }
  }

  return {
    page,
    shouldRedirect: page === 1,
  }
}

export function blogPageHref(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}?page=${page}`
}

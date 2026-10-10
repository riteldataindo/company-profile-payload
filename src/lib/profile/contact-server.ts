import { cache } from 'react'
import { getSiteSettings } from '@/lib/data'
import { resolveCompanyContact, type CompanyContact } from './contact'

export const getCompanyContact = cache(async (locale: string): Promise<CompanyContact> => {
  return resolveCompanyContact(await getSiteSettings(locale))
})

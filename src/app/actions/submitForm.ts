'use server'

import { z } from 'zod'
import { getPayload } from '@/lib/payload'
import { sendFormNotificationEmail } from '@/lib/email'

const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const solutionSchema = z.enum(['shared', 'retail', 'mall']).default('shared')
const privacyConsentSchema = z.literal(true, 'Privacy consent is required')

const contactFormSchema = z.object({
  formType: z.literal('contact'),
  solution: solutionSchema,
  name: z.string().min(2, 'Name is required (min 2 characters)').max(120),
  email: z.string().email('Valid email required').max(254),
  phone: z.string().max(40).optional(),
  company: z.string().max(160).optional(),
  message: z.string().min(10, 'Message is required (min 10 characters)').max(5000),
  privacyConsent: privacyConsentSchema,
})

const demoFormSchema = z.object({
  formType: z.literal('demo'),
  solution: solutionSchema,
  name: z.string().min(2, 'Name is required').max(120),
  email: z.string().email('Valid email required').max(254),
  phone: z.string().min(8, 'Valid WhatsApp number required').max(40).regex(/\d/, 'Valid number required'),
  company: z.string().min(2, 'Company name is required').max(160),
  storeCount: z.string().max(40).optional(),
  message: z.string().max(5000).optional(),
  privacyConsent: privacyConsentSchema,
})

const formSchema = z.discriminatedUnion('formType', [contactFormSchema, demoFormSchema])

export async function submitForm(data: Record<string, unknown>) {
  try {
    // Honeypot responses are intentionally indistinguishable from successful submissions.
    if (typeof data.website === 'string' && data.website.trim().length > 0) {
      return { success: true }
    }

    // Validate before consuming quota so malformed requests cannot exhaust it.
    const submittedData = { ...data }
    delete submittedData.website
    const parsed = formSchema.parse(submittedData)

    const payload = await getPayload()
    const recentSubmissions = await payload.count({
      collection: 'form-submissions',
      where: {
        and: [
          { email: { equals: parsed.email.toLocaleLowerCase() } },
          {
            createdAt: {
              greater_than: new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString(),
            },
          },
        ],
      },
    })
    if (recentSubmissions.totalDocs >= RATE_LIMIT_MAX) {
      return {
        success: false,
        error: 'Too many submissions. Please try again later.',
      }
    }

    const docData = {
      formType: parsed.formType,
      solution: parsed.solution,
      email: parsed.email.toLocaleLowerCase(),
      status: 'new' as const,
      data: parsed,
    }

    // Save to database
    await payload.create({
      collection: 'form-submissions',
      data: docData,
    })

    // Send email notification (non-blocking)
    sendFormNotificationEmail(parsed).catch((err) => {
      console.error('Failed to send form notification email:', err)
    })

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.issues[0]
      return {
        success: false,
        error: fieldError.message || 'Validation error',
        field: fieldError.path[0],
      }
    }

    console.error('Form submission error:', error)
    return {
      success: false,
      error: 'Failed to submit form. Please try again later.',
    }
  }
}

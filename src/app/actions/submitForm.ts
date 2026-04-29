'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { getPayload } from '@/lib/payload'
import { sendFormNotificationEmail } from '@/lib/email'

// Simple in-memory rate limiting: Map<IP, timestamp[]>
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

const contactFormSchema = z.object({
  formType: z.literal('contact'),
  name: z.string().min(2, 'Name is required (min 2 characters)'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, 'Message is required (min 10 characters)'),
})

const demoFormSchema = z.object({
  formType: z.literal('demo'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Valid WhatsApp number required').regex(/\d/, 'Valid number required'),
  company: z.string().min(2, 'Company name is required'),
  storeCount: z.string().optional(),
  message: z.string().optional(),
})

const formSchema = z.discriminatedUnion('formType', [contactFormSchema, demoFormSchema])

type FormData = z.infer<typeof formSchema>

function getClientIP(): string {
  const headersList = headers()
  return (
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
    headersList.get('x-real-ip') ||
    'unknown'
  )
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW_MS

  const timestamps = rateLimitMap.get(ip) || []
  const recentTimestamps = timestamps.filter(t => t > windowStart)

  if (recentTimestamps.length >= RATE_LIMIT_MAX) {
    return false
  }

  recentTimestamps.push(now)
  rateLimitMap.set(ip, recentTimestamps)

  // Cleanup old entries periodically (every 100 requests)
  if (Math.random() < 0.01) {
    for (const [key, times] of rateLimitMap.entries()) {
      const filtered = times.filter(t => t > windowStart)
      if (filtered.length === 0) {
        rateLimitMap.delete(key)
      } else {
        rateLimitMap.set(key, filtered)
      }
    }
  }

  return true
}

export async function submitForm(data: Record<string, unknown>) {
  try {
    // Rate limiting
    const ip = getClientIP()
    if (!checkRateLimit(ip)) {
      return {
        success: false,
        error: 'Too many submissions. Please try again later.',
      }
    }

    // Validate input
    const parsed = formSchema.parse(data)

    // Get Payload instance
    const payload = await getPayload()

    // Prepare document data
    const docData = {
      formType: parsed.formType,
      email: parsed.email,
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
      const fieldError = error.errors[0]
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

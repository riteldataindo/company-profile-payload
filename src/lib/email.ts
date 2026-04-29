import nodemailer from 'nodemailer'

interface ContactFormData {
  formType: 'contact'
  name: string
  email: string
  phone?: string
  company?: string
  message: string
}

interface DemoFormData {
  formType: 'demo'
  name: string
  email: string
  phone: string
  company: string
  storeCount?: string
  message?: string
}

type FormData = ContactFormData | DemoFormData

function isConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  )
}

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  })
}

function getEmailTemplate(formData: FormData): { subject: string; html: string } {
  if (formData.formType === 'contact') {
    const { name, email, phone, company, message } = formData as ContactFormData
    return {
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">New Contact Form Submission</h2>

            <div style="margin-bottom: 15px;">
              <strong style="color: #555;">Name:</strong>
              <p style="margin: 5px 0 0 0; color: #333;">${escapeHtml(name)}</p>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #555;">Email:</strong>
              <p style="margin: 5px 0 0 0; color: #333;"><a href="mailto:${escapeHtml(email)}" style="color: #0066cc;">${escapeHtml(email)}</a></p>
            </div>

            ${phone ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Phone:</strong>
                <p style="margin: 5px 0 0 0; color: #333;">${escapeHtml(phone)}</p>
              </div>
            ` : ''}

            ${company ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Company:</strong>
                <p style="margin: 5px 0 0 0; color: #333;">${escapeHtml(company)}</p>
              </div>
            ` : ''}

            <div style="margin-bottom: 15px;">
              <strong style="color: #555;">Message:</strong>
              <p style="margin: 5px 0 0 0; color: #333; white-space: pre-wrap;">${escapeHtml(message)}</p>
            </div>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              Submitted at ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })} WIB
            </p>
          </div>
        </div>
      `,
    }
  } else {
    const { name, email, phone, company, storeCount, message } = formData as DemoFormData
    return {
      subject: `New Demo Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">New Demo Request</h2>

            <div style="margin-bottom: 15px;">
              <strong style="color: #555;">Name:</strong>
              <p style="margin: 5px 0 0 0; color: #333;">${escapeHtml(name)}</p>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #555;">Email:</strong>
              <p style="margin: 5px 0 0 0; color: #333;"><a href="mailto:${escapeHtml(email)}" style="color: #0066cc;">${escapeHtml(email)}</a></p>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #555;">WhatsApp:</strong>
              <p style="margin: 5px 0 0 0; color: #333;">${escapeHtml(phone)}</p>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #555;">Company:</strong>
              <p style="margin: 5px 0 0 0; color: #333;">${escapeHtml(company)}</p>
            </div>

            ${storeCount ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Number of Stores:</strong>
                <p style="margin: 5px 0 0 0; color: #333;">${escapeHtml(storeCount)}</p>
              </div>
            ` : ''}

            ${message ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Questions/Comments:</strong>
                <p style="margin: 5px 0 0 0; color: #333; white-space: pre-wrap;">${escapeHtml(message)}</p>
              </div>
            ` : ''}

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              Submitted at ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })} WIB
            </p>
          </div>
        </div>
      `,
    }
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, m => map[m])
}

export async function sendFormNotificationEmail(formData: FormData): Promise<void> {
  // Skip if SMTP is not configured
  if (!isConfigured()) {
    console.log('SMTP not configured. Skipping email notification.')
    return
  }

  try {
    const transporter = getTransporter()
    const { subject, html } = getEmailTemplate(formData)

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'info@riteldata.id',
      subject,
      html,
    })
  } catch (error) {
    console.error('Error sending form notification email:', error)
    throw error
  }
}

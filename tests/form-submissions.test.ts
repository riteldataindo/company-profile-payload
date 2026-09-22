import assert from 'node:assert/strict'
import test from 'node:test'
import { submitForm } from '../src/app/actions/submitForm.ts'
import { formCopy, readContactQuery } from '../src/lib/profile/form-query.ts'
import { getPayload } from '../src/lib/payload.ts'

// Skip the Next.js HMR socket that Payload opens outside production and test.
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  process.env.NODE_ENV = 'test'
}

type PayloadWithPool = {
  destroy: () => Promise<void>
  db: {
    pool?: {
      end: () => Promise<void>
      _clients?: Array<{ release?: () => void }>
      _idle?: Array<{ client: { release?: () => void } }>
    }
  }
}

// connect() checks out one client for error listening and never releases it, so pool.end() would hang.
async function closePayload(payload: PayloadWithPool) {
  const pool = payload.db.pool
  await payload.destroy()
  if (!pool) return
  const idle = new Set((pool._idle ?? []).map((item) => item.client))
  for (const client of pool._clients ?? []) {
    if (!idle.has(client)) client.release?.()
  }
  await pool.end()
}

function submissionId(result: { success: boolean; id?: string }): string {
  assert.equal(result.success, true)
  if (typeof result.id !== 'string' || result.id.length === 0) {
    assert.fail('expected a non-empty submission id')
  }
  return result.id
}

test('contact query keeps mall solution and package, and Indonesian labels differ from English', () => {
  const query = readContactQuery('?solution=mall&package=Core%20Platform')
  assert.equal(query.solution, 'mall')
  assert.equal(query.packageName, 'Core Platform')
  assert.equal(readContactQuery('').solution, 'shared')
  assert.equal(formCopy('id').name, 'Nama')
  assert.equal(formCopy('id').context, 'Konteks')
  assert.match(formCopy('id').shared, /belum pasti/)
  assert.equal(formCopy('en').name, 'Name')
  assert.match(formCopy('en').shared, /not sure/)
})

test('submitForm stores contact and demo submissions and returns ids', { timeout: 180_000 }, async () => {
  const payload = await getPayload()
  const createdIds: string[] = []
  const contactEmail = `profile-test-${Date.now()}@example.com`
  const demoEmail = `profile-test-${Date.now()}@example.com`

  try {
    const contact = await submitForm({
      formType: 'contact',
      solution: 'mall',
      packageName: 'Core Platform',
      name: 'Profile Test',
      email: contactEmail,
      company: 'Mall Operator',
      message: 'Please tell me about visitor counting for a mall site.',
      privacyConsent: true,
    })
    const contactId = submissionId(contact)
    createdIds.push(contactId)

    const contactDoc = await payload.findByID({
      collection: 'form-submissions',
      id: contactId,
    })
    assert.equal(contactDoc.formType, 'contact')
    assert.equal(contactDoc.solution, 'mall')
    assert.equal(contactDoc.email, contactEmail.toLocaleLowerCase())
    assert.equal((contactDoc.data as { packageName?: string }).packageName, 'Core Platform')

    const demo = await submitForm({
      formType: 'demo',
      solution: 'mall',
      name: 'Demo Tester',
      email: demoEmail,
      phone: '081234567890',
      company: 'Acme Mall',
      privacyConsent: true,
    })
    const demoId = submissionId(demo)
    createdIds.push(demoId)

    const demoDoc = await payload.findByID({
      collection: 'form-submissions',
      id: demoId,
    })
    assert.equal(demoDoc.formType, 'demo')
    assert.equal(demoDoc.email, demoEmail.toLocaleLowerCase())
  } finally {
    try {
      for (const id of createdIds) {
        await payload.delete({
          collection: 'form-submissions',
          id,
        })
      }
    } finally {
      await closePayload(payload)
    }
  }
})

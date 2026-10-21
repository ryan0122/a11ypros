// Server-side integration with Twenty CRM (https://a11y-pros.twenty.com/)
//
// Preferred setup: Twenty Workflow Webhook trigger.
// Copy the workflow's Webhook URL from its trigger settings in Twenty and store
// it as the server-only environment variable `TWENTY_WEBHOOK_URL` in Netlify
// (and `.env.local` for local dev). Never prefix it with `NEXT_PUBLIC_`.

export interface TwentyLeadPayload {
  email: string
  firstName?: string
  lastName?: string
  organization?: string
  phone?: string
  formName?: string
  resourceTitle?: string
  resourceUrl?: string
  postSlug?: string
  message?: string
}

/**
 * Forwards lead data (`{ email, ... }`) from the server-side API route to a
 * Twenty CRM Workflow Webhook URL configured via `TWENTY_WEBHOOK_URL`.
 */
export async function syncLeadToTwenty(lead: TwentyLeadPayload): Promise<boolean> {
  const webhookUrl = process.env.TWENTY_WEBHOOK_URL
  if (!webhookUrl) {
    return false
  }

  const email = lead.email.trim().toLowerCase()
  if (!email) return false

  const payload: Record<string, string> = {
    email,
  }

  if (lead.firstName?.trim()) payload.firstName = lead.firstName.trim()
  if (lead.lastName?.trim()) payload.lastName = lead.lastName.trim()
  if (lead.organization?.trim()) payload.organization = lead.organization.trim()
  if (lead.phone?.trim()) payload.phone = lead.phone.trim()
  if (lead.formName?.trim()) payload.formName = lead.formName.trim()
  if (lead.resourceTitle?.trim()) payload.resourceTitle = lead.resourceTitle.trim()
  if (lead.resourceUrl?.trim()) payload.resourceUrl = lead.resourceUrl.trim()
  if (lead.postSlug?.trim()) payload.postSlug = lead.postSlug.trim()
  if (lead.message?.trim()) payload.message = lead.message.trim()

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Twenty webhook failed (${res.status}): ${errText.slice(0, 200)}`)
  }

  return true
}

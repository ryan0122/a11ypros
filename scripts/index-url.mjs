import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

/**
 * Helper to generate JWT token for Google Indexing API from Service Account JSON
 */
function generateJwtToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  const base64UrlEncode = (str) =>
    Buffer.from(str)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const unsignedToken = `${encodedHeader}.${encodedPayload}`

  const sign = crypto.createSign('RSA-SHA256')
  sign.update(unsignedToken)
  const signature = sign.sign(serviceAccount.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${unsignedToken}.${signature}`
}

/**
 * Get OAuth2 Access Token from Google
 */
async function getAccessToken(serviceAccount) {
  const jwt = generateJwtToken(serviceAccount)
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Google OAuth error: ${JSON.stringify(data)}`)
  }
  return data.access_token
}

/**
 * Submit URL to Google Indexing API
 */
export async function notifyGoogleIndexing(targetUrl, actionType = 'URL_UPDATED') {
  const keyPath = path.join(process.cwd(), 'gsc-key.json')
  
  if (!fs.existsSync(keyPath)) {
    console.warn(`[Google Indexing API] gsc-key.json not found. Skipping auto-submission for ${targetUrl}.`)
    return false
  }

  try {
    const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf-8'))
    const token = await getAccessToken(serviceAccount)

    console.log(`[Google Indexing API] Submitting ${targetUrl} to Google...`)

    const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: targetUrl,
        type: actionType,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error('[Google Indexing API Error]', data)
      return false
    }

    console.log(`[Google Indexing API Success] Submitted ${targetUrl}!`)
    console.log('Response:', data.urlNotificationMetadata?.latestUpdate)
    return true
  } catch (err) {
    console.error('[Google Indexing API Failed]', err.message)
    return false
  }
}

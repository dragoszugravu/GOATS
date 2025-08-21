export function getConfig() {
  return {
    region: import.meta.env.VITE_AWS_REGION || 'eu-west-1',
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    clientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID,
    domain: import.meta.env.VITE_COGNITO_DOMAIN,
    redirectUri: window.location.origin,
  }
}

export function getLoginUrl() {
  const { domain, clientId, redirectUri } = getConfig()
  const url = new URL(`${domain}/oauth2/authorize`)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid email profile')
  url.searchParams.set('redirect_uri', redirectUri)
  return url.toString()
}

export function getLogoutUrl() {
  const { domain, clientId, redirectUri } = getConfig()
  const url = new URL(`${domain}/logout`)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('logout_uri', redirectUri)
  return url.toString()
}

export async function exchangeCodeForTokens(code) {
  const { domain, clientId, redirectUri } = getConfig()
  const url = new URL(`${domain}/oauth2/token`)
  const form = new URLSearchParams()
  form.set('grant_type', 'authorization_code')
  form.set('client_id', clientId)
  form.set('code', code)
  form.set('redirect_uri', redirectUri)
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form.toString()
  })
  if (!res.ok) throw new Error('Token exchange failed')
  return res.json()
}

export function saveTokens(tokens) {
  localStorage.setItem('goats_tokens', JSON.stringify(tokens))
}

export function getTokens() {
  const raw = localStorage.getItem('goats_tokens')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function clearTokens() {
  localStorage.removeItem('goats_tokens')
}



import { supabaseAdmin } from '../lib/supabaseAdmin.js'

export async function verifyAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }

  const token = authHeader.replace('Bearer ', '')

  const { data, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  req.user = data.user
  next()
}
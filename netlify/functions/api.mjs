import crypto from 'node:crypto'
import { MongoClient, ObjectId } from 'mongodb'

const DEFAULT_SETTINGS = {
  test_duration: 60,
  show_errors: true,
  sound_enabled: false,
  smooth_caret: true,
  quick_restart: true,
  font_size: '16',
}

let clientPromise

function getMongoUri() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not set')
  }
  return uri
}

async function getDb() {
  if (!clientPromise) {
    const uri = getMongoUri()
    const client = new MongoClient(uri)
    clientPromise = client.connect()
  }

  const dbName = process.env.MONGODB_DB_NAME || 'keyflow'
  const client = await clientPromise
  return client.db(dbName)
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },
    body: JSON.stringify(body),
  }
}

function parseBody(event) {
  if (!event.body) return {}
  try {
    return JSON.parse(event.body)
  } catch {
    return {}
  }
}

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64UrlDecode(input) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4
  const withPadding = padding ? normalized + '='.repeat(4 - padding) : normalized
  return Buffer.from(withPadding, 'base64').toString('utf8')
}

function getJwtSecret() {
  return process.env.JWT_SECRET || 'replace-this-in-production'
}

function signToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const completePayload = {
    ...payload,
    iat: now,
    exp: now + 60 * 60 * 24 * 30,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(completePayload))
  const data = `${encodedHeader}.${encodedPayload}`
  const signature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${data}.${signature}`
}

function verifyToken(token) {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [encodedHeader, encodedPayload, signature] = parts
  const data = `${encodedHeader}.${encodedPayload}`
  const expectedSignature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  if (signature !== expectedSignature) return null

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload))
    const now = Math.floor(Date.now() / 1000)
    if (!payload.exp || payload.exp < now) return null
    return payload
  } catch {
    return null
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, storedHash) {
  const [salt, originalHash] = String(storedHash || '').split(':')
  if (!salt || !originalHash) return false

  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'))
  } catch {
    return false
  }
}

function normalizeUser(user) {
  if (!user) return null
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar || null,
    provider: user.provider || 'email',
  }
}

function normalizeTest(test) {
  const createdAt = test.createdAt instanceof Date ? test.createdAt.toISOString() : new Date().toISOString()
  return {
    id: test._id.toString(),
    wpm: Number(test.wpm || 0),
    accuracy: Number(test.accuracy || 0),
    duration: Number(test.duration || 0),
    correct_words: Number(test.correct_words || 0),
    incorrect_words: Number(test.incorrect_words || 0),
    total_words: Number(test.total_words || 0),
    text_content: test.text_content || '',
    created_at: createdAt,
    completed_at: createdAt,
  }
}

function periodStart(period) {
  const now = new Date()

  switch (period) {
    case 'today': {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }
    case 'week': {
      const day = now.getDay() || 7
      const start = new Date(now)
      start.setDate(now.getDate() - day + 1)
      start.setHours(0, 0, 0, 0)
      return start
    }
    case 'month':
      return new Date(now.getFullYear(), now.getMonth(), 1)
    case 'year':
      return new Date(now.getFullYear(), 0, 1)
    case 'all':
    default:
      return null
  }
}

function extractPath(event) {
  const rawPath = event.path || '/'
  if (rawPath.startsWith('/.netlify/functions/api')) {
    const next = rawPath.slice('/.netlify/functions/api'.length)
    return next || '/'
  }
  return rawPath
}

async function getAuthUser(event, db) {
  const authHeader = event.headers?.authorization || event.headers?.Authorization
  if (!authHeader || !String(authHeader).startsWith('Bearer ')) return null

  const token = String(authHeader).slice(7)
  const payload = verifyToken(token)
  if (!payload?.sub) return null

  let userId
  try {
    userId = new ObjectId(String(payload.sub))
  } catch {
    return null
  }

  const user = await db.collection('users').findOne({ _id: userId })
  return user
}

async function handleRegister(event, db) {
  const body = parseBody(event)
  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  const passwordConfirmation = String(body.password_confirmation || '')

  if (!name || !email || !password) {
    return json(422, { message: 'Name, email and password are required' })
  }
  if (password.length < 6) {
    return json(422, { message: 'Password must be at least 6 characters' })
  }
  if (password !== passwordConfirmation) {
    return json(422, { message: 'Password confirmation does not match' })
  }

  const existing = await db.collection('users').findOne({ email })
  if (existing) {
    return json(422, { message: 'Email is already registered' })
  }

  const now = new Date()
  const insert = await db.collection('users').insertOne({
    name,
    email,
    password_hash: hashPassword(password),
    provider: 'email',
    avatar: null,
    createdAt: now,
    updatedAt: now,
  })

  const user = await db.collection('users').findOne({ _id: insert.insertedId })
  const token = signToken({ sub: insert.insertedId.toString(), email })

  return json(201, {
    data: {
      access_token: token,
      token_type: 'Bearer',
      user: normalizeUser(user),
    },
  })
}

async function handleLogin(event, db) {
  const body = parseBody(event)
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  if (!email || !password) {
    return json(422, { message: 'Email and password are required' })
  }

  const user = await db.collection('users').findOne({ email })
  if (!user || !verifyPassword(password, user.password_hash)) {
    return json(401, { message: 'Invalid credentials' })
  }

  const token = signToken({ sub: user._id.toString(), email: user.email })
  return json(200, {
    data: {
      access_token: token,
      token_type: 'Bearer',
      user: normalizeUser(user),
    },
  })
}

async function handleMe(event, db) {
  const user = await getAuthUser(event, db)
  if (!user) return json(401, { message: 'Unauthorized' })
  return json(200, { data: normalizeUser(user) })
}

async function handleSaveTypingTest(event, db) {
  const user = await getAuthUser(event, db)
  if (!user) return json(401, { message: 'Unauthorized' })

  const body = parseBody(event)
  const payload = {
    userId: user._id,
    wpm: Number(body.wpm || 0),
    accuracy: Number(body.accuracy || 0),
    duration: Number(body.duration || 0),
    correct_words: Number(body.correct_words || 0),
    incorrect_words: Number(body.incorrect_words || 0),
    total_words: Number(body.total_words || 0),
    text_content: String(body.text_content || '').slice(0, 1000),
    createdAt: new Date(),
  }

  const insert = await db.collection('typing_tests').insertOne(payload)
  const test = await db.collection('typing_tests').findOne({ _id: insert.insertedId })

  return json(201, {
    data: normalizeTest(test),
    message: 'Typing test saved',
  })
}

async function handleStatistics(event, db) {
  const user = await getAuthUser(event, db)
  if (!user) return json(401, { message: 'Unauthorized' })

  const [stats] = await db
    .collection('typing_tests')
    .aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$userId',
          best_wpm: { $max: '$wpm' },
          avg_wpm: { $avg: '$wpm' },
          avg_accuracy: { $avg: '$accuracy' },
          tests_taken: { $sum: 1 },
          total_words_typed: { $sum: '$total_words' },
          total_time: { $sum: '$duration' },
        },
      },
    ])
    .toArray()

  if (!stats) {
    return json(200, {
      data: {
        best_wpm: 0,
        avg_wpm: 0,
        avg_accuracy: 0,
        tests_taken: 0,
        total_words_typed: 0,
        total_time: 0,
      },
    })
  }

  return json(200, {
    data: {
      best_wpm: Math.round(Number(stats.best_wpm || 0)),
      avg_wpm: Math.round(Number(stats.avg_wpm || 0)),
      avg_accuracy: Number(Number(stats.avg_accuracy || 0).toFixed(1)),
      tests_taken: Number(stats.tests_taken || 0),
      total_words_typed: Number(stats.total_words_typed || 0),
      total_time: Number(stats.total_time || 0),
    },
  })
}

async function handleRecentActivity(event, db) {
  const user = await getAuthUser(event, db)
  if (!user) return json(401, { message: 'Unauthorized' })

  const limit = Math.max(1, Math.min(100, Number(event.queryStringParameters?.limit || 10)))

  const tests = await db
    .collection('typing_tests')
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()

  return json(200, {
    data: tests.map(normalizeTest),
  })
}

async function loadLeaderboardRows(db, period = 'all') {
  const since = periodStart(period)
  const match = since ? { createdAt: { $gte: since } } : {}

  const rows = await db
    .collection('typing_tests')
    .aggregate([
      { $match: match },
      {
        $group: {
          _id: '$userId',
          best_wpm: { $max: '$wpm' },
          avg_accuracy: { $avg: '$accuracy' },
          total_tests: { $sum: 1 },
        },
      },
    ])
    .toArray()

  if (!rows.length) return []

  const userIds = rows
    .map((r) => r._id)
    .filter(Boolean)

  const users = await db
    .collection('users')
    .find({ _id: { $in: userIds } })
    .project({ name: 1, avatar: 1 })
    .toArray()

  const userMap = new Map(users.map((u) => [u._id.toString(), u]))

  return rows.map((row) => {
    const id = row._id?.toString?.() || ''
    const user = userMap.get(id)
    const bestWpm = Number(row.best_wpm || 0)
    const avgAccuracy = Number(Number(row.avg_accuracy || 0).toFixed(1))
    const totalTests = Number(row.total_tests || 0)

    return {
      user: {
        id,
        name: user?.name || 'Unknown',
        avatar: user?.avatar || null,
      },
      best_wpm: bestWpm,
      avg_accuracy: avgAccuracy,
      total_tests: totalTests,
      combined_score: Number((bestWpm * avgAccuracy) / 100),
    }
  })
}

function rankRows(rows, metric, limit, minTests) {
  let filtered = rows
  if (metric === 'accuracy' || metric === 'combined') {
    filtered = filtered.filter((row) => row.total_tests >= minTests)
  }

  const sorted = [...filtered].sort((a, b) => {
    if (metric === 'wpm') return b.best_wpm - a.best_wpm
    if (metric === 'accuracy') return b.avg_accuracy - a.avg_accuracy
    if (metric === 'tests') return b.total_tests - a.total_tests
    return b.combined_score - a.combined_score
  })

  return sorted.slice(0, limit).map((row, index) => ({
    rank: index + 1,
    ...row,
  }))
}

async function handleLeaderboard(event, db, metric) {
  const period = event.queryStringParameters?.period || 'all'
  const limit = Math.max(1, Math.min(100, Number(event.queryStringParameters?.limit || 50)))
  const minTests = Math.max(1, Number(event.queryStringParameters?.min_tests || 5))

  const rows = await loadLeaderboardRows(db, period)
  const leaderboard = rankRows(rows, metric, limit, minTests)

  return json(200, {
    data: {
      leaderboard,
    },
  })
}

async function handleMyRank(event, db) {
  const user = await getAuthUser(event, db)
  if (!user) return json(401, { message: 'Unauthorized' })

  const period = event.queryStringParameters?.period || 'all'
  const rows = await loadLeaderboardRows(db, period)

  const wpmRanked = rankRows(rows, 'wpm', Number.MAX_SAFE_INTEGER, 1)
  const accuracyRanked = rankRows(rows, 'accuracy', Number.MAX_SAFE_INTEGER, 5)
  const testsRanked = rankRows(rows, 'tests', Number.MAX_SAFE_INTEGER, 1)
  const combinedRanked = rankRows(rows, 'combined', Number.MAX_SAFE_INTEGER, 5)

  const userId = user._id.toString()
  const findRank = (list) => {
    const found = list.find((item) => item.user.id === userId)
    return found ? found.rank : null
  }

  return json(200, {
    data: {
      ranks: {
        wpm: findRank(wpmRanked),
        accuracy: findRank(accuracyRanked),
        tests: findRank(testsRanked),
        combined: findRank(combinedRanked),
      },
      period,
    },
  })
}

async function getOrCreateSettings(db, userId) {
  const settingsCollection = db.collection('user_settings')
  const existing = await settingsCollection.findOne({ userId })
  if (existing) return existing

  const doc = {
    userId,
    ...DEFAULT_SETTINGS,
    updatedAt: new Date(),
  }

  const insert = await settingsCollection.insertOne(doc)
  return settingsCollection.findOne({ _id: insert.insertedId })
}

function normalizeSettings(settings) {
  return {
    test_duration: Number(settings?.test_duration || DEFAULT_SETTINGS.test_duration),
    show_errors: settings?.show_errors ?? DEFAULT_SETTINGS.show_errors,
    sound_enabled: settings?.sound_enabled ?? DEFAULT_SETTINGS.sound_enabled,
    smooth_caret: settings?.smooth_caret ?? DEFAULT_SETTINGS.smooth_caret,
    quick_restart: settings?.quick_restart ?? DEFAULT_SETTINGS.quick_restart,
    font_size: String(settings?.font_size || DEFAULT_SETTINGS.font_size),
  }
}

async function handleSettingsGet(event, db) {
  const user = await getAuthUser(event, db)
  if (!user) return json(401, { message: 'Unauthorized' })

  const settings = await getOrCreateSettings(db, user._id)
  return json(200, { data: { settings: normalizeSettings(settings) } })
}

async function handleSettingsUpdate(event, db) {
  const user = await getAuthUser(event, db)
  if (!user) return json(401, { message: 'Unauthorized' })

  const body = parseBody(event)
  const update = {}

  if (body.test_duration !== undefined) update.test_duration = Number(body.test_duration)
  if (body.show_errors !== undefined) update.show_errors = Boolean(body.show_errors)
  if (body.sound_enabled !== undefined) update.sound_enabled = Boolean(body.sound_enabled)
  if (body.smooth_caret !== undefined) update.smooth_caret = Boolean(body.smooth_caret)
  if (body.quick_restart !== undefined) update.quick_restart = Boolean(body.quick_restart)
  if (body.font_size !== undefined) update.font_size = String(body.font_size)

  update.updatedAt = new Date()

  await db.collection('user_settings').updateOne(
    { userId: user._id },
    { $set: update, $setOnInsert: { userId: user._id, ...DEFAULT_SETTINGS } },
    { upsert: true }
  )

  const settings = await getOrCreateSettings(db, user._id)
  return json(200, { data: { settings: normalizeSettings(settings) } })
}

async function handleSettingsReset(event, db) {
  const user = await getAuthUser(event, db)
  if (!user) return json(401, { message: 'Unauthorized' })

  await db.collection('user_settings').updateOne(
    { userId: user._id },
    { $set: { ...DEFAULT_SETTINGS, updatedAt: new Date() }, $setOnInsert: { userId: user._id } },
    { upsert: true }
  )

  const settings = await getOrCreateSettings(db, user._id)
  return json(200, { data: { settings: normalizeSettings(settings) } })
}

function unsupportedFeature(name) {
  return json(501, {
    message: `${name} is not implemented in the Netlify serverless backend yet`,
  })
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return json(204, {})
  }

  let db
  try {
    db = await getDb()
  } catch (error) {
    return json(500, {
      message: 'Database connection failed',
      error: String(error?.message || error),
    })
  }

  const method = event.httpMethod
  const path = extractPath(event)
  const normalizedPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  const apiPath =
    normalizedPath === '/api' || normalizedPath.startsWith('/api/')
      ? normalizedPath
      : `/api${normalizedPath}`

  try {
    if (method === 'GET' && apiPath === '/api/health') {
      return json(200, {
        status: 'ok',
        service: 'keyflow-netlify-api',
        timestamp: new Date().toISOString(),
      })
    }

    if (method === 'POST' && apiPath === '/api/v1/auth/register') return handleRegister(event, db)
    if (method === 'POST' && apiPath === '/api/v1/auth/login') return handleLogin(event, db)
    if (method === 'GET' && apiPath === '/api/v1/auth/me') return handleMe(event, db)
    if (method === 'POST' && apiPath === '/api/v1/auth/logout') return json(200, { message: 'Logged out' })

    if (method === 'POST' && apiPath === '/api/v1/auth/forgot-password') {
      return json(200, { message: 'If this email exists, password reset instructions were sent.' })
    }
    if (method === 'POST' && apiPath === '/api/v1/auth/reset-password') {
      return unsupportedFeature('Password reset')
    }

    if (apiPath === '/api/v1/auth/social/google' || apiPath === '/api/v1/auth/social/github') {
      return unsupportedFeature('OAuth')
    }
    if (apiPath === '/api/v1/auth/social/google/callback' || apiPath === '/api/v1/auth/social/github/callback') {
      return unsupportedFeature('OAuth callback')
    }

    if (method === 'POST' && apiPath === '/api/v1/typing-tests') return handleSaveTypingTest(event, db)
    if (method === 'GET' && apiPath === '/api/v1/typing-tests/statistics') return handleStatistics(event, db)
    if (method === 'GET' && apiPath === '/api/v1/typing-tests/recent-activity') return handleRecentActivity(event, db)

    if (method === 'GET' && apiPath === '/api/v1/leaderboard/wpm') return handleLeaderboard(event, db, 'wpm')
    if (method === 'GET' && apiPath === '/api/v1/leaderboard/accuracy') return handleLeaderboard(event, db, 'accuracy')
    if (method === 'GET' && apiPath === '/api/v1/leaderboard/tests') return handleLeaderboard(event, db, 'tests')
    if (method === 'GET' && apiPath === '/api/v1/leaderboard/combined') return handleLeaderboard(event, db, 'combined')
    if (method === 'GET' && apiPath === '/api/v1/leaderboard/my-rank') return handleMyRank(event, db)

    if (method === 'GET' && apiPath === '/api/v1/settings') return handleSettingsGet(event, db)
    if (method === 'PUT' && apiPath === '/api/v1/settings') return handleSettingsUpdate(event, db)
    if (method === 'DELETE' && apiPath === '/api/v1/settings') return handleSettingsReset(event, db)

    return json(404, { message: 'Not found' })
  } catch (error) {
    return json(500, {
      message: 'Internal server error',
      error: String(error?.message || error),
    })
  }
}

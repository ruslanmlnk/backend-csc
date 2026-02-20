import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Home } from './globals/Home'
import { Blog } from './globals/Blog'
import { PartnershipsPage } from './globals/PartnershipsPage'
import { ConferencesPage } from './globals/ConferencesPage'
import { ServicesPage } from './globals/ServicesPage'
import { JobsPage } from './globals/JobsPage'
import { ForumPage } from './globals/ForumPage'
import { LoginPage } from './globals/LoginPage'
import { RegisterPage } from './globals/RegisterPage'
import { Articles } from './collections/Articles'
import { Categories } from './collections/Categories'
import { Banners } from './collections/Banners'
import { Comments } from './collections/Comments'
import { Threads } from './collections/Threads'
import { ServiceCategories } from './collections/ServiceCategories'
import { Services } from './collections/Services'
import { PartnershipCategories } from './collections/PartnershipCategories'
import { Partnerships } from './collections/Partnerships'
import { Jobs } from './collections/Jobs'
import { JobLocations } from './collections/JobLocations'
import { JobExperiences } from './collections/JobExperiences'
import { JobFormats } from './collections/JobFormats'
import { ConferencesVerticals } from './collections/ConferencesVerticals'
import { Conferences } from './collections/Conferences'
import { ContactRequests } from './collections/ContactRequests'
import { ForumCategories } from './collections/ForumCategories'
import { ForumSubCategories } from './collections/ForumSubCategories'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const normalizeOrigin = (value: string | undefined): string | null => {
  if (!value) return null

  const trimmed = value.trim()
  if (!trimmed) return null

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    return new URL(withProtocol).origin
  } catch {
    return null
  }
}

const normalizeURL = (value: string | undefined): string | null => {
  if (!value) return null

  const trimmed = value.trim()
  if (!trimmed) return null

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    return new URL(withProtocol).toString().replace(/\/$/, '')
  } catch {
    return null
  }
}

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'https://heliometrical-welcomeless-angelina.ngrok-free.dev',
]

const envOriginCandidates = [
  process.env.SERVER_URL,
  process.env.PAYLOAD_PUBLIC_SERVER_URL,
  process.env.DEPLOY_URL,
  process.env.URL,
  process.env.BACKEND_URL,
  process.env.NEXT_PUBLIC_BACKEND_URL,
  process.env.FRONTEND_URL,
  process.env.NEXT_PUBLIC_FRONTEND_URL,
  process.env.RENDER_EXTERNAL_URL,
  process.env.VERCEL_URL,
  process.env.RAILWAY_PUBLIC_DOMAIN,
]

const envAllowedOrigins = envOriginCandidates
  .map((value) => normalizeOrigin(value))
  .filter((origin): origin is string => Boolean(origin))

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envAllowedOrigins]))
const serverURL =
  normalizeURL(process.env.SERVER_URL) ??
  normalizeURL(process.env.PAYLOAD_PUBLIC_SERVER_URL) ??
  normalizeURL(process.env.BACKEND_URL) ??
  normalizeURL(process.env.NEXT_PUBLIC_BACKEND_URL) ??
  normalizeURL(process.env.DEPLOY_URL) ??
  normalizeURL(process.env.URL) ??
  normalizeURL(process.env.RENDER_EXTERNAL_URL) ??
  normalizeURL(process.env.VERCEL_URL) ??
  normalizeURL(process.env.RAILWAY_PUBLIC_DOMAIN) ??
  ''

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Banners,
    Articles,
    Categories,
    ServiceCategories,
    Services,
    PartnershipCategories,
    Partnerships,
    Conferences,
    ConferencesVerticals,
    JobLocations,
    JobExperiences,
    JobFormats,
    Jobs,
    ContactRequests,
    ForumCategories,
    ForumSubCategories,
    Comments,
    Threads,
  ],
  serverURL,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  globals: [
    Home,
    Blog,
    PartnershipsPage,
    ConferencesPage,
    ServicesPage,
    JobsPage,
    ForumPage,
    LoginPage,
    RegisterPage,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})

// reload trigger
// reload after types

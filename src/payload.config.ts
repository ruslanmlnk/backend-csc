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
import { Articles } from './collections/Articles'
import { Categories } from './collections/Categories'
import { Banners } from './collections/Banners'
import { Comments } from './collections/Comments'
import { Threads } from './collections/Threads'
import { ServiceCategories } from './collections/ServiceCategories'
import { Services } from './collections/Services'
import { Jobs } from './collections/Jobs'
import { JobLocations } from './collections/JobLocations'
import { JobExperiences } from './collections/JobExperiences'
import { JobFormats } from './collections/JobFormats'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
]

const envAllowedOrigins = [
  process.env.BACKEND_URL,
  process.env.NEXT_PUBLIC_BACKEND_URL,
  process.env.FRONTEND_URL,
  process.env.NEXT_PUBLIC_FRONTEND_URL,
]
  .filter(Boolean)
  .map((origin) => origin!.replace(/\/$/, ''))

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envAllowedOrigins]))

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
    JobLocations,
    JobExperiences,
    JobFormats,
    Jobs,
    Comments,
    Threads,
  ],
  cors: allowedOrigins,
  csrf: allowedOrigins,
  globals: [Home, Blog],
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

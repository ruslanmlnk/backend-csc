import type { GlobalConfig } from 'payload'
import { seoFields } from '../fields/seo'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page',
  access: {
    read: () => true,
  },
  fields: seoFields,
}

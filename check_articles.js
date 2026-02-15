import { getPayload } from 'payload'
import config from './src/payload.config'

async function check() {
    const payload = await getPayload({ config })
    const articles = await payload.find({
        collection: 'articles',
    })
    console.log('Articles found:', JSON.stringify(articles.docs.map(d => ({ title: d.title, slug: d.slug })), null, 2))
    process.exit(0)
}

check()

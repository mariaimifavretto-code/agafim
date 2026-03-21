import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  LinkFeature,
  UploadFeature,
  HeadingFeature,
  OrderedListFeature,
  UnorderedListFeature,
  BlockquoteFeature,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { News } from './collections/News'
import { Denuncias } from './collections/Denuncias'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts, News, Denuncias],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures, // Traz o básico (Bold, Italic, etc)
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }), // H1 é reservado para o título da página no Astro
      LinkFeature({
        enabledCollections: ['posts', 'noticias'], // Permite criar links internos facilmente
      }),
      UploadFeature({
        collections: {
          media: {
            fields: [
              {
                name: 'caption',
                type: 'text',
                label: 'Legenda da Imagem',
              },
            ],
          },
        },
      }),
      OrderedListFeature(),
      UnorderedListFeature(),
      BlockquoteFeature(),
    ],
  }),
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

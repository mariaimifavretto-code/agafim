import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { lexicalEditor, LinkFeature, UploadFeature } from '@payloadcms/richtext-lexical';

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.roles?.includes('admin') || user?.roles?.includes('editor')) return true
      return { _status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => Boolean(user?.roles?.includes('admin') || user?.roles?.includes('editor')),
    update: ({ req: { user } }) => Boolean(user?.roles?.includes('admin') || user?.roles?.includes('editor')),
    delete: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      fieldToUse: 'title',
    }),
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Resumo do post para exibição em listas',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          LinkFeature({
            enabledCollections: ['noticias', 'posts'], 
          }),
          UploadFeature({
            collections: {
              media: {
                fields: [
                  {
                    name: 'caption',
                    type: 'text',
                  },
                ],
              },
            },
          }),
        ],
      }),
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Jurídico', value: 'jurídico' },
        { label: 'Parlamentar', value: 'parlamentar' },
      ],
      defaultValue: 'jurídico',
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        condition: (data) => !data.author,
      },
      hooks: {
        beforeChange: [
          ({ req, operation, value }) => {
            if (operation === 'create' && !value && req.user) {
              return req.user.id
            }
            return value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Rascunho', value: 'draft' },
        { label: 'Publicado', value: 'published' },
        { label: 'Arquivado', value: 'archived' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Data de Publicação',
      required: true,
      admin: {
        condition: (data) => data?.status === 'published',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'd/MM/yyyy HH:mm',
        },
        position: 'sidebar', 
      },
      defaultValue: () => new Date(), 
      index: true, 
    },
  ],
  timestamps: true,
  versions: {
    drafts: true,
  },
}
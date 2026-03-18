import type { CollectionConfig } from 'payload'

export const Denuncias: CollectionConfig = {
  slug: 'denuncias',
  admin: {
    useAsTitle: 'description',
    defaultColumns: ['type', 'description', 'email', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
    create: () => true, // Permitir criação pública para denúncias
    update: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
    delete: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Denúncia', value: 'denuncia' },
        { label: 'Sugestão', value: 'sugestao' },
        { label: 'Outro', value: 'outro' },
      ],
      required: true,
      admin: {
        description: 'Tipo da denúncia ou comunicação',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Descrição detalhada da denúncia ou sugestão',
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'E-mail opcional do denunciante para contato',
      },
    },
  ],
  timestamps: true,
}
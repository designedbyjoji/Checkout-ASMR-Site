import { revalidateTag } from 'next/cache'
import type { Access, CollectionConfig } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'

const readApprovedOrAdmin: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  return { status: { equals: 'approved' } }
}

export const AsmrTracks: CollectionConfig = {
  slug: 'asmr-tracks',
  labels: {
    singular: 'ASMR Track',
    plural: 'ASMR Tracks',
  },
  access: {
    create: () => true,
    delete: isAdmin,
    read: readApprovedOrAdmin,
    update: isAdmin,
  },
  admin: {
    group: 'ASMR Library',
    useAsTitle: 'title',
    defaultColumns: ['title', 'creatorName', 'category', 'origin', 'status', 'createdAt'],
  },
  upload: {
    mimeTypes: ['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/ogg', 'audio/wav', 'audio/x-wav', 'audio/webm'],
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if (
          operation === 'create' &&
          req.user?.collection !== 'admins' &&
          req.context.publicAsmrUpload
        ) {
          return {
            ...data,
            status: 'pending',
            featured: false,
          }
        }
        return data
      },
    ],
    afterChange: [
      ({ req }) => {
        if (!req.context.skipAsmrRevalidation) {
          revalidateTag('asmr-tracks', 'max')
        }
      },
    ],
    afterDelete: [
      ({ req }) => {
        if (!req.context.skipAsmrRevalidation) {
          revalidateTag('asmr-tracks', 'max')
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 80,
    },
    {
      name: 'creatorName',
      type: 'text',
      label: 'Creator name',
      required: true,
      maxLength: 50,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Tapping', value: 'tapping' },
        { label: 'Whisper', value: 'whisper' },
        { label: 'Nature', value: 'nature' },
        { label: 'Roleplay', value: 'roleplay' },
        { label: 'Texture', value: 'texture' },
      ],
    },
    {
      // 新增：錄製地點（例如「台灣・台北」），讓資料庫可以呈現「來自世界各地」
      name: 'origin',
      type: 'text',
      label: 'Recorded in',
      maxLength: 40,
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 240,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      required: true,
      index: true,
      access: {
        create: ({ req }) => req.user?.collection === 'admins',
        update: ({ req }) => req.user?.collection === 'admins',
      },
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Pending review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create: ({ req }) => req.user?.collection === 'admins',
        update: ({ req }) => req.user?.collection === 'admins',
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}

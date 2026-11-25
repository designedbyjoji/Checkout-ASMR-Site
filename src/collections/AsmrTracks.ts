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
    mimeTypes: [
      'audio/mpeg',
      'audio/mp4',
      'audio/x-m4a',
      'audio/ogg',
      'audio/wav',
      'audio/x-wav',
      'audio/webm',
    ],
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
      async ({ doc, req }) => {
        // 封面跟著聲音的審核狀態：通過 → 公開；待審／退回 → 隱藏
        const coverId = typeof doc.cover === 'object' && doc.cover ? doc.cover.id : doc.cover
        if (coverId) {
          await req.payload.update({
            collection: 'asmr-covers',
            id: coverId,
            data: { visible: doc.status === 'approved' },
            overrideAccess: true,
            req,
          })
        }
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
      // 封面照片（選填；投稿者上傳，跟聲音一起審核）。沒有封面時網站顯示 Checkout. Logo
      name: 'cover',
      type: 'upload',
      relationTo: 'asmr-covers',
      label: 'Cover image',
    },
    {
      // 錄製地點（目前網站上不顯示，保留舊資料）（例如「台灣・台北」），讓資料庫可以呈現「來自世界各地」
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

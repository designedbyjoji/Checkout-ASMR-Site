import type { Access, CollectionConfig } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'

/**
 * 聲音封面（使用者上傳的照片）
 * - 投稿時一起上傳，預設不公開（visible = false）
 * - 管理員把對應的聲音改成 approved 時，AsmrTracks 會自動把封面設成公開
 * - 沒有封面的聲音，網站會顯示 Checkout. 的 Logo
 */
export const AsmrCovers: CollectionConfig = {
  slug: 'asmr-covers',
  labels: {
    singular: 'ASMR Cover',
    plural: 'ASMR Covers',
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: ({ req }) => {
      if (req.user?.collection === 'admins') return true
      return { visible: { equals: true } }
    },
    update: isAdmin,
  },
  admin: {
    group: 'ASMR Library',
    defaultColumns: ['filename', 'visible', 'createdAt'],
  },
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  fields: [
    {
      name: 'visible',
      type: 'checkbox',
      label: 'Public (follows the track’s approval)',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}

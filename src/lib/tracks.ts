import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import type { Track } from '@/app/ui/site-content'

/** 讀取「已通過審核」的聲音；後台修改時會自動更新 */
export const getApprovedTracks = unstable_cache(
  async (): Promise<Track[]> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'asmr-tracks',
      overrideAccess: false,
      depth: 1,
      limit: 60,
      sort: '-featured,-createdAt',
    })

    return result.docs
      .filter((track) => typeof track.url === 'string')
      .map((track) => ({
        id: String(track.id),
        title: track.title,
        creatorName: track.creatorName,
        category: track.category,
        origin: track.origin ?? '',
        description: track.description ?? '',
        url: track.url ?? '',
        // 封面要「已公開」才讀得到；讀不到就是空字串 → 網站改顯示 Checkout. Logo
        cover:
          typeof track.cover === 'object' && track.cover?.visible ? (track.cover.url ?? '') : '',
      }))
  },
  ['approved-asmr-tracks-v4'],
  { tags: ['asmr-tracks'] },
)

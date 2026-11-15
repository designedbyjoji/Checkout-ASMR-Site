import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import type { Track } from '@/app/(frontend)/content'

/** 讀取「已通過審核」的聲音；後台修改時會自動更新 */
export const getApprovedTracks = unstable_cache(
  async (): Promise<Track[]> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'asmr-tracks',
      overrideAccess: false,
      depth: 0,
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
      }))
  },
  ['approved-asmr-tracks-v3'],
  { tags: ['asmr-tracks'] },
)

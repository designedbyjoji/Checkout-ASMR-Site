import { getPayload } from 'payload'
import config from '@payload-config'

/** Payload instance for server components and route handlers. */
export async function getPayloadClient() {
  const payloadConfig = await config
  return getPayload({ config: payloadConfig })
}

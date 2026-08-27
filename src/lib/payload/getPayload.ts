import { getPayload as getPayloadRoot } from 'payload'
import config from '@/payload.config'

export async function getPayload() {
  return await getPayloadRoot({ config: await config })
}

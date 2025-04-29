import config from '@/payload.config'
import { getPayload as getPayloadRoot } from 'payload'

export async function getPayload() {
  return await getPayloadRoot({ config: await config })
}

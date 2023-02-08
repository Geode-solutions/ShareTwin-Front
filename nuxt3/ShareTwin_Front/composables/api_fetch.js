import { use_cloud_store } from '@/stores/cloud'
const cloud_store = use_cloud_store()
const { ID } = storeToRefs(cloud_store)

export async function api_fetch (request, options) {
  const config = useRuntimeConfig()
  const base_url = `${config.GEODE_PROTOCOL}://${config.API_URL}/${ID.value}`
  return useFetch(request, { baseURL: base_url, ...options })
}

export default api_fetch
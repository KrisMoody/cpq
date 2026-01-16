import { initializeAIService } from '../services/aiQuoteService'

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()

  initializeAIService({
    anthropicApiKey: config.anthropicApiKey as string | undefined,
  })
})

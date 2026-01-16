export default defineEventHandler(async () => {
  const storage = useStorage()
  const keys = await storage.getKeys('assets')
  return {
    keys,
    courseKeys: await useStorage('assets:course').getKeys(),
  }
})

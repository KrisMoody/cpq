import { ALLOWED_MODULES, getCourseContent } from '../../utils/courseContent'

export default defineEventHandler(async (event) => {
  const moduleId = getRouterParam(event, 'module')

  if (!moduleId) {
    throw createError({
      statusCode: 400,
      message: 'Module ID is required',
    })
  }

  // Security: Only allow known module IDs
  if (!ALLOWED_MODULES.includes(moduleId)) {
    throw createError({
      statusCode: 404,
      message: 'Module not found',
    })
  }

  const content = await getCourseContent(moduleId)

  if (!content) {
    throw createError({
      statusCode: 404,
      message: 'Module not found',
    })
  }

  return {
    id: moduleId,
    filename: `${moduleId}.md`,
    content,
  }
})

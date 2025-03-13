export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => messageSchema.safeParse(body))

  if (!result.success)
    throw result.error.issues

  const agent = new ClassificationAgent(
    new GovModel(),
    // new GeminiModel(),
    ENTITIES_CLASSIFICATION_SYSTEM_INSTRUCTIONS,
    {
      ...ENTITIES_CLASSIFICATION_EXAMPLES,
      ...ACTIONS_CLASSIFICATION_EXAMPLES,
    },
    allOptions
  )

  return await agent.classify(result.data.message)
})

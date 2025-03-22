defineRouteMeta({
  openAPI: {
    requestBody: {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
              },
              vendor: {
                type: 'string',
              },
              model: {
                type: 'string',
              },
            },
            required: ['message'],
            additionalProperties: false,
          },
        },
      },
    },
  },
})

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => inferBodySchema.safeParse(body))
  const macros = useModelMacros()

  if (!result.success)
    throw result.error.issues

  let model

  if ('vendor' in result.data) {
    if (result.data.vendor === Vendors.google) {
      model = new GeminiModel(result.data.model)
    }
    else if (result.data.vendor === Vendors.gov) {
      model = new GovModel(result.data.model)
    }
    else if (result.data.vendor === Vendors.ollama) {
      model = new OllamaModel(result.data.model)
    }
    else {
      throw new Error('invalid vendor')
    }
  }
  else {
    model = new OllamaModel()
  }

  const temperature = result.data.fails
    ? macros.failsToTemperature(result.data.fails, result.data.failsRange)
    : undefined

  const agent = new ClassificationAgent(
    model,
    ENTITIES_CLASSIFICATION_SYSTEM_INSTRUCTIONS,
    {
      ...ENTITIES_CLASSIFICATION_EXAMPLES,
      ...ACTIONS_CLASSIFICATION_EXAMPLES,
    },
    allOptions,
    temperature,
  )

  const classifiedResponse = await agent.classify(result.data.message)
  const status = CLASSIFY_RESPONSE[classifiedResponse.status]

  setResponseStatus(event, status.code, status.message)

  return classifiedResponse.result
})

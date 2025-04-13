export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => checkOrgSchema.safeParse(body))
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

  const orgData = ENTITIES_CLASSIFICATION_EXAMPLES[result.data.org]

  const agent = new VerificationAgent(
    model,
    result.data.org,
    orgData.description,
    orgData.examples,
    temperature,
  )

  const checkResponse = await agent.verify(result.data.message)

  const status = CHECK_RESPONSE[checkResponse.status]

  setResponseStatus(event, status.code, status.message)

  return checkResponse.result
})

defineRouteMeta({
  openAPI: {
    description: 'Verifica o orgão é correspondente a mensagem.',
    requestBody: {
      required: true,
      description: 'Dados necessários para a validação do órgão.',
      content: {
        'application/json': {
          schema: { // Referenciar o schema Zod seria ideal, mas descrever manualmente é uma alternativa
            type: 'object',
            properties: {
              org: {
                type: 'string',
                description: 'O nome do órgão a ser validado.',
                example: 'DETRAN',
              },
              message: {
                type: 'string',
                description: 'A mensagem original do usuário (contexto opcional).',
                example: 'Quero saber sobre minha CNH.',
              },
              vendor: {
                type: 'string',
                default: 'ollama',
                description: 'Provedor do modelo de IA (opcional).',
              },
              model: {
                type: 'string',
                default: 'gemma3',
                description: 'Modelo de IA específico do provedor (opcional).',
              },
              fails: {
                type: 'number',
                description: 'Número de tentativas anteriores (afeta a temperatura, opcional).',
                example: 0,
              },
              failsRange: {
                type: 'number',
                default: 3,
                description: 'Número máximo de tentativas (afeta a temperatura, opcional).',
              },
            },
            required: ['org', 'message'], // org e message são obrigatórios
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Retorna `true` se o órgão for válido, `false` caso contrário.',
        content: {
          'application/json': {
            schema: {
              type: 'boolean',
              example: true,
            },
          },
        },
      },
      400: {
        description: 'Erro de validação nos dados de entrada.',
      },
      500: {
        description: 'Falha interna do servidor ou erro na comunicação com o modelo de IA.',
      },
    },
  },
})

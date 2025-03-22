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

defineRouteMeta({
  openAPI: {
    description: '',
    responses: {
      200: {
        description: 'A AI retornou o dado perfeitamente.',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              example: 'DETRAN',
            },
          },
        },
      },
      202: {
        description: 'A AI retornou o dado com espaços extra ou letras menúsculas. Porém a resposta foi corrigida.',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              example: 'DETRAN',
            },
          },
        },
      },
      203: {
        description: 'A AI desobedeceu o formato de saída, porém foi encontrada uma categoria escrita explicitamente dentro do texto.',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              example: 'DETRAN',
            },
          },
        },
      },
      500: {
        description: 'Houve uma falha na resposta da AI, talvez alucinação ou categorias inválidas.',
      },
    },
    requestBody: {
      required: false,
      description: 'Responsável pela categorização de mensagens relacionadas a órgãos públicos, o endpoint `[post] api/v1/infer` cataloga e retorna uma das categorias disponíveis.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Olá, eu gostaria de fazer uma denúncia...',
                description: 'A mensagem do usuário a ser catalogada',
              },
              vendor: {
                type: 'string',
                default: 'ollama',
                description: 'Referente ao conector do modelo, mais informações em `/api/v1/models`.',
              },
              model: {
                type: 'string',
                default: 'gemma3',
                description: 'O modelo de LLM relativo ao conector `vendor`.',
              },
              fails: {
                type: 'number',
                description: 'O número da iteração atual (em caso de chamada repetida). Essa iteração afeta diretamente a temperatura do modelo, a reduzindo a cada rodada.',
              },
              failsRange: {
                type: 'number',
                default: 3,
                description: 'O número máximo de iterações a serem feitas.',
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

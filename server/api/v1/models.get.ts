export default defineEventHandler(() => MODEL_DEFAULTS)

defineRouteMeta({
  openAPI: {
    description: '',
    responses: {
      200: {
        description: 'Resposta de objeto estático',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              title: 'Schema para Objeto Dinâmico de Modelos',
              description: 'Este schema valida um objeto JSON dinâmico que representa modelos de diferentes provedores.',
              additionalProperties: {
                type: 'object',
                description: 'Um provedor de modelos. A chave é o nome do provedor.',
                additionalProperties: {
                  type: 'object',
                  description: 'Um modelo específico dentro do provedor. A chave é o nome ou identificador do modelo.',
                  properties: {
                    name: {
                      type: 'string',
                      description: 'O nome do modelo.',
                    },
                    contentIndex: {
                      type: 'integer',
                      description: 'Opcional. Um índice de conteúdo associado ao modelo.',
                      nullable: true,
                    },
                  },
                  required: [
                    'name',
                  ],
                  additionalProperties: false,
                },
              },
            },
          },
        },
      },
    },
  },
})

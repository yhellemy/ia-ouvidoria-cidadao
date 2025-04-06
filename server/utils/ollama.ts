import { Ollama } from 'ollama'
// import { zodToJsonSchema } from 'zod-to-json-schema'

export class OllamaModel implements IModel {
  constructor(public ollamaModelName: OllamaModelEnum = OllamaModelEnum.gemma3) {
    // eslint-disable-next-line no-console
    console.log('running Ollama ', ollamaModelName)
  }

  async process(prompt: IPrompt): Promise<string> {
    const config = useRuntimeConfig()

    const ollama = new Ollama({ host: config.OLLAMA_BASE_URL })

    const apiResponse = await ollama.chat({
      model: OLLAMA_MODELS[this.ollamaModelName].name,
      messages: [
        { role: 'system', content: prompt.systemInstruction },
        { role: 'user', content: prompt.message },
      ],
      options: {
        temperature: prompt.temperature,
      },

      // hide format on chain of thoughts models
      /*       ...![OllamaModelEnum.deepseek_r1_8b].includes(this.ollamaModelName)
        ? {
            format: zodToJsonSchema(prompt.schema, 'output'),
          }
        : {}, */
    })

    let agentOutput = apiResponse.message.content

    if (this.ollamaModelName === OllamaModelEnum.deepseek_r1_8b || this.ollamaModelName === OllamaModelEnum.deepseek_r1_14b) {
      // Hide the chain of thoughts
      agentOutput = agentOutput.replace(/<think>(?:(?!<\/think>).)*<\/think>\s*/gs, '')
      agentOutput = decodeURIComponent(agentOutput)
    }
    if (agentOutput.startsWith('"') && agentOutput.endsWith('"')) {
      agentOutput = agentOutput.slice(1, -1)
    }

    if (!agentOutput)
      throw new Error('Invalid agent output')
    return agentOutput
  }
}

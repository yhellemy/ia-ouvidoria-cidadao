// import { z } from 'zod';
// import { zodToJsonSchema } from 'zod-to-json-schema';

export class GovModel implements IModel {
  constructor(
    public model: GovModelEnum = GovModelEnum.llama3_1_8b,
  ) {}

  async process(prompt: IPrompt): Promise<string> {
    const config = useRuntimeConfig()

    const govRes = await $fetch<{ message: string }>('https://api.go.gov.br/ia/modelos-linguagem-natural/v2.0/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.GOV_API_KEY}`,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        model: GOV_MODELS[this.model].name,
        messages: [
          {
            role: 'system',
            content: prompt.systemInstruction,
          },
          {
            role: 'user',
            content: prompt.message,
          },
        ],
        stream: false,
        keep_alive: '5m',
        options: {
          seed: 0,
          temperature: 0.7,
          top_p: 0.9,
          top_k: 50,
          num_predict: 250,
          repeat_penalty: 1.2,
          num_ctx: 2048,
        },
      },
    })

    return govRes.message?.split(' ')[0]
  }
}

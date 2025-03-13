export class GovModel implements IModel {
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
        model: 'llama3.1:8b',
        messages: [
          {
            role: 'system',
            content: prompt.systemInstruction,
          },
          {
            role: 'user',
            content: prompt.message,
          }
        ],
        stream: false,
        format: '',
        keep_alive: '5m',
        options: {
          seed: 42,
          temperature: 0.7,
          top_p: 0.9,
          top_k: 50,
          num_predict: 250,
          repeat_penalty: 1.2,
          num_ctx: 2048,
        },
      },
    })

    console.log(govRes)

    return govRes.message
  }
}

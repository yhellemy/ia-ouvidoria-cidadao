// import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { GoogleGenerativeAI } from '@google/generative-ai'
// import { z } from 'zod'

export class GeminiModel implements IModel {
  constructor(public googleModelName: GoogleModelEnum = GoogleModelEnum.gemma3) {}
  async process(prompt: IPrompt): Promise<string> {
    /*     const registry = new OpenAPIRegistry()
    const openApiSchema = registry.register(
      'Prompt',
      prompt.schema,
    )
    const openApi = new OpenApiGeneratorV3(registry.definitions) */
    const googleModelData = GOOGLE_MODELS[this.googleModelName]
    const config = useRuntimeConfig()
    const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY)

    let systemInstruction
    let message

    // Models that not suport systemInstruction
    if ([GoogleModelEnum.gemma3].includes(this.googleModelName)) {
      message = `${prompt.systemInstruction}\n\n${prompt.message}`
      systemInstruction = undefined
    }
    else {
      message = prompt.message
      systemInstruction = prompt.systemInstruction
    }

    const model = genAI.getGenerativeModel({ model: googleModelData.name, systemInstruction })
    const chat = model.startChat({
      generationConfig: GOOGLE_GENERATION_SETTINGS,
      safetySettings: GOOGLE_SAFETY_SETTINGS,
    })
    const apiResponse = await chat.sendMessage(message)
    /* const { candidates, usageMetadata } = apiResponse.response */
    const agentOutput = apiResponse.response.text()

    if (!agentOutput)
      throw new Error('Invalid agent output')
    return agentOutput
  }
}

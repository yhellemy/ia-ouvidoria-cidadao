import { GoogleGenerativeAI } from '@google/generative-ai'

export class GeminiModel implements IModel {
  constructor(public googleModelName: GoogleModelEnum = GoogleModelEnum.flash) {}
  async process(prompt: IPrompt): Promise<string> {
    const googleModelData = GOOGLE_MODELS[this.googleModelName]
    const config = useRuntimeConfig()
    const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: googleModelData.name, systemInstruction: prompt.systemInstruction })
    const chat = model.startChat({
      generationConfig: GOOGLE_GENERATION_SETTINGS,
      safetySettings: GOOGLE_SAFETY_SETTINGS,
    })
    const apiResponse = await chat.sendMessage(prompt.message)
    const { candidates /* usageMetadata */ } = apiResponse.response
    const agentOutput = candidates?.at(-1)?.content.parts?.at(googleModelData.contentIndex)?.text

    if (!agentOutput)
      throw new Error('Invalid agent output')
    return agentOutput
  }
}

export class GptModel implements IModel {
  async process(prompt: IPrompt): Promise<string> {
    const unifiedPrompt = `${prompt.systemInstruction}\n\n${prompt.systemInstruction}`
    return 'any'
  }
}

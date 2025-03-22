import type { z } from 'zod'
import { string, ZodError } from 'zod'

export type ISchema<T extends z.ZodType<string> = z.ZodType<string>> = T
export interface IPrompt {
  systemInstruction: string
  message: string
  schema: ISchema
  temperature: number
}

export interface IModel {
  process: (prompt: IPrompt) => Promise<string>
}

export interface ClassificationCategory {
  [key: string]: { description: string, examples: string[] }
}

export class ClassificationAgent {
  constructor(
    private readonly model: IModel,
    private readonly systemInstruction: string,
    private readonly categories: ClassificationCategory,
    private readonly schema: ISchema,
    private readonly temperature: number = 0.6,
  ) {}

  private buildPrompt(input: string): IPrompt {
    const examples = Object.entries(this.categories)
      .map(([category, samples]) =>
        `######\n\nCategory: ${category}\nDescription:${samples.description}\nExamples:\n${samples.examples.join('\n')}\n\n######`,
      )
      .join('\n\n')

    const options = Object.entries(this.categories)
      .map(([category]) =>
        category,
      )
      .join(', ')

    return {
      systemInstruction: `${this.systemInstruction}\n\nAvailable Categories:\n${examples}\n\nSelect between ${options}`,
      message: `Input to classify: "${input}"\nCategory:`,
      schema: this.schema,
      temperature: this.temperature,
    }
  }

  async classify(input: string): Promise<{ status: AIResponseStatus, result: string }> {
    const prompt = this.buildPrompt(input)
    const result = await this.model.process(prompt)

    // eslint-disable-next-line no-console
    console.log(`\n\n#############\n\nMensagem: ${input}\n\nResposta: ${result}`)

    if (typeof result !== 'string')
      throw new Error('AI Returned an invalid datatype')

    const trimmedRes = result.trim().toUpperCase()
    const poorlyFormatted = trimmedRes !== result

    const validatedRes = this.schema.safeParse(trimmedRes)

    if (validatedRes.success) {
      return {
        status: poorlyFormatted
          ? AIResponseStatus.PoorlyFormatted
          : AIResponseStatus.Success,
        result: validatedRes.data,
      }
    }

    const validCategories = Object.keys(this.categories)

    for (const category in validCategories) {
      if (validCategories[category] === undefined) {
        continue
      }
      if (trimmedRes.includes(validCategories[category])) {
        return { status: AIResponseStatus.Fished, result: validCategories[category] as string }
      }
    }

    throw new Error('Erro ao classificar resposta da AI', {
      cause: result,
    })
  }
}

// Exemplo de uso
/* class SimpleModel implements IModel {
  async process(prompt: IPrompt): Promise<string> {
    // Simulação de modelo de classificação
    return "positive"; // Na prática, seria a resposta do modelo real
  }
} */

// Configuração do agente
/* const systemInstruction = `Classify text into one of the following categories based on intent. Respond ONLY with the category name.`;

const categories = {
  "positive": ["I love this", "Awesome product", "Great experience"],
  "negative": ["Poor quality", "Very disappointed",ZodEnum<T> "Would not recommend"],
  "neutral": ["Just okay", "No strong opinion", "It's average"]
};

const agent = new ClassificationAgent(
  new SimpleModel(),
  systemInstruction,
  categories
);

// Uso
agent.classify("This is amazing!").then(console.log); // Deve retornar "positive" */

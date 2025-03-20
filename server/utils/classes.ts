import type { z } from 'zod'

export type ISchema<T extends z.ZodType<string> = z.ZodType<string>> = T
export interface IPrompt {
  systemInstruction: string
  message: string
  schema: ISchema
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
    }
  }

  async classify(input: string): Promise<string> {
    const prompt = this.buildPrompt(input)
    const result = await this.model.process(prompt)

    console.log(`${prompt.systemInstruction}\n\n${prompt.message}\n\nResponse:${result}`)

    if (typeof result === 'string') {
      return this.schema.parse(result.trim())
    }

    return this.schema.parse(result)
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

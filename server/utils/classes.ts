import { z } from "zod"

export interface IPrompt {
  systemInstruction: string
  message: string
}

export interface IModel {
  process: (prompt: IPrompt) => Promise<string>
}

export interface ClassificationCategory {
  [key: string]: string[]
}

export class ClassificationAgent <T extends [string, ...string[]]> {
  constructor(
    private readonly model: IModel,
    private readonly systemInstruction: string,
    private readonly categories: ClassificationCategory,
    private readonly schema: z.ZodEnum<T>
  ) {}

  private buildPrompt(input: string): IPrompt {
    const examples = Object.entries(this.categories)
      .map(([category, samples]) =>
        `Category: ${category}\nExamples:\n${samples.join('\n')}`,
      )
      .join('\n\n')

    return {
      systemInstruction: `${this.systemInstruction}\n\nAvailable Categories:\n${examples}`,
      message: `Input to classify: "${input}"\nCategory:`,
    }
  }

  async classify(input: string): Promise<string> {
    const prompt = this.buildPrompt(input)
    const result = await this.model.process(prompt)

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
  "negative": ["Poor quality", "Very disappointed", "Would not recommend"],
  "neutral": ["Just okay", "No strong opinion", "It's average"]
};

const agent = new ClassificationAgent(
  new SimpleModel(),
  systemInstruction,
  categories
);

// Uso
agent.classify("This is amazing!").then(console.log); // Deve retornar "positive" */

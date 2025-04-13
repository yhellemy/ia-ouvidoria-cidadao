import { z } from 'zod'

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

export class VerificationAgent {
  constructor(
    private readonly model: IModel,
    private readonly orgName: EntitiesValues, // O órgão específico a ser verificado
    private readonly orgDescription: string, // Descrição do órgão
    private readonly orgExamples: string[], // Exemplos do órgão
    private readonly temperature: number = 0.1, // Temperatura mais baixa para tarefas de verificação
  ) {}

  private buildPrompt(inputMessage: string): IPrompt {
    const examplesString = this.orgExamples.join('\n - ')

    const systemInstruction = `${CHECK_ORG_SYSTEM_INSTRUCTIONS}\n\nÓrgão a verificar: ${this.orgName}\nDescrição do ${this.orgName}: ${this.orgDescription}\nExemplos de tópicos do ${this.orgName}:\n - ${examplesString}`

    const message = `Mensagem do usuário: "${inputMessage}"\nA mensagem acima pertence ao órgão ${this.orgName}? Responda APENAS 'true' ou 'false'.\nResposta:`

    return {
      systemInstruction,
      message,
      temperature: this.temperature,
      schema: z.string(),
    }
  }

  async verify(inputMessage: string): Promise<{ status: AIResponseStatus, result: boolean }> {
    const prompt = this.buildPrompt(inputMessage)
    const rawResult = await this.model.process(prompt)

    // eslint-disable-next-line no-console
    console.log(`\n\n############# CHECK ORG #############\n\nMensagem: ${inputMessage}\nÓrgão: ${this.orgName}\n\nResposta Bruta: ${rawResult}`)

    if (typeof rawResult !== 'string') {
      console.error('AI Returned an invalid datatype for verification')
      throw new Error('AI Returned an invalid datatype')
    }

    const trimmedRes = rawResult.trim().toLowerCase()
    const poorlyFormatted = trimmedRes !== rawResult.toLowerCase() // Verifica se houve espaços ou case diferente

    // Tenta validar como booleano diretamente (true/false)
    if (trimmedRes === 'true' || trimmedRes === 'false') {
      const resultBoolean = trimmedRes === 'true'
      // Valida com o schema Zod para garantir
      const validatedRes = z.boolean().safeParse(resultBoolean)

      if (validatedRes.success) {
        return {
          status: poorlyFormatted
            ? AIResponseStatus.PoorlyFormatted // Foi ' True ' ou 'TRUE' etc.
            : AIResponseStatus.Success,
          result: validatedRes.data,
        }
      }
    }

    console.error('Erro ao verificar resposta da AI (não é booleano claro)', {
      cause: rawResult,
    })
    throw new Error('Erro ao verificar resposta da AI: formato inválido', {
      cause: rawResult,
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

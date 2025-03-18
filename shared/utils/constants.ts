import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai'

const ENTITIES_DETRAN = 'DETRAN' as const
const ENTITIES_ECONOMIA = 'ECONOMIA' as const
const ENTITIES_IPASGO = 'IPASGO' as const
const ENTITIES_AGR = 'AGR' as const
const ENTITIES_SSP = 'SSP' as const
const ENTITIES_SEAD = 'sead' as const

const ACTION_NONE = 'none' as const

export const ENTITIES = {
  DETRAN: ENTITIES_DETRAN,
  ECONOMIA: ENTITIES_ECONOMIA,
  IPASGO: ENTITIES_IPASGO,
  AGR: ENTITIES_AGR,
  SSP: ENTITIES_SSP,
  SEAD: ENTITIES_SEAD,
} as const

export const ACTIONS = {
  NONE: ACTION_NONE,
} as const

export const ENTITIES_CLASSIFICATION_SYSTEM_INSTRUCTIONS = 'Com base nos órgãos publicos expostos abaixo, retorne o respectivo órgão relacionado a solicitação do usuário. Não justifique a resposta em nenhum caso ou use caracteres como aspas, somente retorne a sigla do respectivo orgão.'

export const ENTITIES_CLASSIFICATION_EXAMPLES = {
  [ENTITIES.DETRAN]: [
    'Ontem apareceu que tinha um boleto em meu CPF, do departamento de trânsito GO. Eu não fiz nenhuma compra, nenhuma transferência, nada... Então quero fazer um apelo perguntando o porquê da cobrança?',
    'Recebi uma multa de trânsito em Goiânia, mas não estava na cidade na data da infração.  Como posso recorrer?',
    'Meu veículo foi apreendido e quero saber como proceder para regularizar a situação e retirá-lo do pátio do DETRAN-GO.',
    'Preciso agendar a vistoria do meu carro, qual o procedimento?',
  ],
  [ENTITIES.ECONOMIA]: [
    'Minha empresa está com dificuldades em emitir notas fiscais eletrônicas em Goiânia.  O sistema da prefeitura está fora do ar?',
    'Quero saber sobre os incentivos fiscais para novas empresas em Goiás.  Quais são os requisitos e como posso me inscrever?',
    'O IPTU de 2024 em Goiânia está com um valor muito acima do esperado.  Houve algum erro no cálculo?  Como posso solicitar revisão?',
    'Como faco para abrir uma inscrição estadual, preciso de orientação',
  ],
  [ENTITIES.IPASGO]: [
    'Estou tentando marcar uma consulta com um especialista pelo IPASGO, mas não consigo vaga.  Há previsão de novos credenciamentos?',
    'Meu plano do IPASGO cobre cirurgia bariátrica?  Quais são os critérios para aprovação do procedimento?',
    'Não estou conseguindo autorizar um exame de alta complexidade pelo IPASGO.  O que devo fazer?',
    'Como faço o reembolso de uma consulta que tive que pagar particular, porque o médico não atendia mais pelo Ipasgo?',
  ],
  [ENTITIES.AGR]: [
    'Solicito fiscalização de desmatamento ilegal em área de preservação permanente na região de Goiânia.',
    'Quero denunciar o uso irregular de agrotóxicos em uma propriedade rural próxima à minha residência em Goiás.',
    'Preciso de informações sobre licenciamento ambiental para atividade de piscicultura em Goiás.',
    'Gostaria de saber sobre os programas de apoio a agricultura familiar.',
  ],
  [ENTITIES.SSP]: [
    'Fui vítima de um roubo em Goiânia e gostaria de registrar um boletim de ocorrência online.  Qual o site correto?',
    'Quero fazer uma denúncia anônima sobre tráfico de drogas na minha vizinhança em Goiânia.',
    'Há um aumento significativo de assaltos na minha rua.  É possível aumentar o policiamento ostensivo na região?',
    'Como posso obter informações sobre o andamento de um inquérito policial?',
  ],
  [ENTITIES.SEAD]: [
    'Gostaria de informações sobre concursos públicos abertos para o estado de goias',
    'Quando sai o pagamento dos servidores estaduais?',
    'Como faço para me inscrever no processo seletivo para trabalhar no Vapt Vupt?',
    'Onde encontro o edital do concurso da policia militar?',
  ],
} satisfies Record<EntitiesValues, string[]>

export const ACTIONS_CLASSIFICATION_EXAMPLES = {
  [ACTIONS.NONE]: [
    'Caso nenhum dos items acima seja válido',
  ],
} satisfies Record<ActionValues, string[]>

export enum Vendors {
  google = 'google',
  gov = 'gov',
  ollama = 'ollama',
}

export enum GoogleModelEnum {
  thinking = 'thinking',
  flash = 'flash',
  pro = 'pro',
  gemma3 = 'gemma3',
}

export enum GovModelEnum {
  llama3_1_8b = 'llama3-1:8b',
}

export enum OllamaModelEnum {
  gemma3 = 'gemma3',
  deepseek_r1_8b = 'deepseek-r1:8b',
}

export const GOOGLE_MODELS = {
  [GoogleModelEnum.thinking]: {
    name: 'gemini-2.0-flash-thinking-exp-1219',
    contentIndex: 1,
  },
  [GoogleModelEnum.pro]: {
    name: 'gemini-exp-1206',
    contentIndex: 0,
  },
  [GoogleModelEnum.flash]: {
    name: 'gemini-2.0-flash-exp',
    contentIndex: 0,
  },
  [GoogleModelEnum.gemma3]: {
    name: 'gemma-3-27b-it',
    contentIndex: 0,
  },
} as const

export const GOV_MODELS = {
  [GovModelEnum.llama3_1_8b]: {
    name: 'llama3.1:8b',
  },
} as const

export const OLLAMA_MODELS = {
  [OllamaModelEnum.gemma3]: {
    name: 'gemma3',
  },
  [OllamaModelEnum.deepseek_r1_8b]: {
    name: 'deepseek-r1:8b',
  },
} as const

export const GOOGLE_SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
]

export const GOOGLE_GENERATION_SETTINGS = {
  temperature: 0.1,
  topK: 1,
  topP: 1,
  maxOutputTokens: 8000,
}

import AGR_D from '@@/shared/utils/orgs/AGR.md'
import DETRAN_D from '@@/shared/utils/orgs/DETRAN.md'
import ECONOMIA_D from '@@/shared/utils/orgs/ECONOMIA.md'
import IPASGO_D from '@@/shared/utils/orgs/IPASGO.md'
// import SANEAGO_D from '@@/shared/utils/orgs/SANEAGO.md'
import SEAD_D from '@@/shared/utils/orgs/SEAD.md'
import SEDUC_D from '@@/shared/utils/orgs/SEDUC.md'
import SSP_D from '@@/shared/utils/orgs/SSP.md'

import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai'

const ENTITIES_DETRAN = 'DETRAN' as const
const ENTITIES_ECONOMIA = 'ECONOMIA' as const
const ENTITIES_IPASGO = 'IPASGO' as const
const ENTITIES_AGR = 'AGR' as const
const ENTITIES_SSP = 'SSP' as const
const ENTITIES_SEAD = 'SEAD' as const
const ENTITIES_SEDUC = 'SEDUC' as const
// const ENTITIES_SANEAGO = 'SANEAGO' as const

const ACTION_NONE = 'OUTROS' as const

export const ENTITIES = {
  DETRAN: ENTITIES_DETRAN,
  ECONOMIA: ENTITIES_ECONOMIA,
  IPASGO: ENTITIES_IPASGO,
  AGR: ENTITIES_AGR,
  SSP: ENTITIES_SSP,
  SEAD: ENTITIES_SEAD,
  SEDUC: ENTITIES_SEDUC,
  // SANEAGO: ENTITIES_SANEAGO,
} as const

export const ACTIONS = {
  NONE: ACTION_NONE,
} as const

export const ENTITIES_CLASSIFICATION_SYSTEM_INSTRUCTIONS = 'Você é um funcionário do departamento de ouvidoria do Estado. A tua responsabilidade é ler a mensagem e você deve CLASSIFICAR qual destes órgãos (AGR, DETRAN, ECONOMIA, IPASGO, SEAD, SEDUC ou SSP)  deve receber essa manifestação. Caso não seja possível identificar o órgão certo ou se houver ambiguidade, classifique como OUTROS. Na sua RESPOSTA retorne APENAS o órgão que você classificou, Na sua RESPOSTA não deve definir a categoria ou tenha explicações e justificativa.'

export const ENTITIES_CLASSIFICATION_EXAMPLES = {
  [ENTITIES.DETRAN]: {
    description: DETRAN_D,
    examples: [
      'Como posso parcelar o IPVA do ano corrente?',
      'Ainda não paguei o IPVA, como posso pagar com parcelamento?',
      'Não consigo acessar o sistema do Detran para consultar o valor do IPVA',
      'Multa por excesso de velocidade.',
      'Meu veículo foi apreendido e quero saber como proceder para regularizar a situação e retirá-lo do pátio do DETRAN-GO.',
      'Preciso fazer uma vistoria do meu carro, qual o procedimento?',
      'Não consigo emitir minha CNH após aprovação no exame.',
      'O site do DETRAN não mostra o valor da multa.',
      'Não estou conseguindo contestar multas',
    ],
  },
  [ENTITIES.ECONOMIA]: {
    description: ECONOMIA_D,
    examples: [
      'Já paguei a primeira parcela do IPVA, como posso pagar o restante da divida?',
      'Quero saber sobre os incentivos fiscais para novas empresas em Goiás.  Quais são os requisitos e como posso me inscrever?',
      'Como posso pagar o IPVA dos anos anteriores?',
      'Como faco para abrir uma inscrição estadual, preciso de orientação',
    ],
  },
  [ENTITIES.IPASGO]: {
    description: IPASGO_D,
    examples: [
      'Estou tentando marcar uma consulta com um especialista pelo IPASGO, mas não consigo vaga.  Há previsão de novos credenciamentos?',
      'Meu plano do IPASGO cobre cirurgia bariátrica?  Quais são os critérios para aprovação do procedimento?',
      'Não estou conseguindo autorizar um exame de alta complexidade pelo IPASGO.  O que devo fazer?',
      'Como faço o reembolso de uma consulta que tive que pagar particular, porque o médico não atendia mais pelo Ipasgo?',
    ],
  },
  // [ENTITIES.SANEAGO]: {
  //   description: SANEAGO_D,
  //   examples: [
  //     'Existe um atraso no serviço solicitado sobre Ligação de Esgoto',
  //     'Preciso de religação de água',
  //     'Demora em uma simples ligação de água',
  //     'O esgoto da minha rua está com muito mau cheiro',
  //     'A equipe que veio ligar minha água não finalizou o serviço',
  //     'A minha conta de água veio com valores ou custos indevidos',
  //   ],
  // },
  [ENTITIES.AGR]: {
    description: AGR_D,
    examples: [
      'Solicito fiscalização de desmatamento ilegal em área de preservação permanente na região de Goiânia.',
      'Quero denunciar o uso irregular de agrotóxicos em uma propriedade rural próxima à minha residência em Goiás.',
      'A empresa de onibus de viagem intermunicipal de passageiro não está respeitando o acesso do idoso',
      'A minha região está com falta de saneamento, já informei a empresa responsavel e eles não me responderam.',
      'A minha região está sem água desde a semana passada, estou tentando contato com a Saneago e ainda não resolveram a situação.',
    ],
  },
  [ENTITIES.SSP]: {
    description: SSP_D,
    examples: [
      'Fui vítima de um roubo e gostaria de registrar um boletim de ocorrência online.  Qual o site correto?',
      'Quero fazer uma denúncia anônima sobre tráfico de drogas na minha vizinhança em Goiânia.',
      'Empresa cobrou R$ 2.000 por taxas extras não autorizadas.',
      'Há um aumento significativo de assaltos na minha rua.  É possível aumentar o policiamento ostensivo na região?',
      'Como posso obter informações sobre o andamento de um inquérito policial?',
      'Perdi meus documentos o que devo fazer?',
      'Como denunciar uma autoescola ?',
      'Preciso registrar um BO por roubo de celular.',
      'Consultar antecedentes criminais para concurso público.',
    ],
  },
  [ENTITIES.SEAD]: {
    description: SEAD_D,
    examples: [
      'Eu gostaria de renovar meu documentos pessoais.',
      'Como agendar a CNH pelo site VAPT VUPT?',
      'Estou bloqueado para agendar um atendimento',
      'Eu queria reagendar um atendimento no Vapt Vupt',
      'Como faço para me inscrever no processo seletivo para trabalhar no Vapt Vupt?',
      'Gostaria de informações sobre concursos públicos abertos para o estado de goias',
      'Quando sai o pagamento dos servidores estaduais?',
      'Consulta ao extrato do Aluguel Social 2024.',
      'Denúncia contra conduta ou comportamento de um servidor público',
    ],
  },
  [ENTITIES.SEDUC]: {
    description: SEDUC_D,
    examples: [
      'Relato meu descontentamento com as ações da direção da Escola Estadual José Madalena em Maurilândia.',
      'Como posso conseguir o cartão Bolsa de estudo?',
      'Não estou conseguindo vaga no colégio estadual para o turno matutino.',
      'Quando serão as matrículas escolares para o próximo ano?',
    ],
  },
} satisfies Record<EntitiesValues, { examples: string[], description: string }>

export const ACTIONS_CLASSIFICATION_EXAMPLES = {
  [ACTIONS.NONE]: {
    description: 'Caso nenhum dos items acima seja válido, não se sinta na obrigação de responder.',
    examples: [],
  },
} satisfies Record<ActionValues, { examples: string[], description: string }>

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
  llama3_1_8b = 'llama3.1:8b',
  llama3_2_3b = 'llama3.2:3b',
  gemma3_12 = 'gemma3:12b ',
  deepseek_r1_7b = 'deepseek-r1:7b-qwen-distill-fp16',
  deepseek_r1_1_5b = 'deepseek-r1:1.5b-qwen-distill-fp16',
  qwen2_5 = 'qwen2.5:7b-instruct-fp16',
  qwen2 = 'qwen2:7b-instruct-fp16',
  nomic = 'nomic-embed-text: latest',
  llama_guard3 = 'llama-guard3:8b-fp16',
}

export enum AIResponseStatus {
  Success = 1,
  PoorlyFormatted = 2,
  Fished = 3,
  Failed = 4,
}

export const CLASSIFY_RESPONSE = {
  [AIResponseStatus.Success]: {
    code: 200,
    message: 'Resposta obtida com sucesso',
  },
  [AIResponseStatus.PoorlyFormatted]: {
    code: 202,
    message: 'Resposta mal formatada',
  },
  [AIResponseStatus.Fished]: {
    code: 203,
    message: 'Resposta obtida com sucesso parcial',
  },
  [AIResponseStatus.Failed]: {
    code: 500,
    message: 'A requisição falhou',
  },
} satisfies Record<AIResponseStatus, { code: number, message: string }>

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
  [OllamaModelEnum.llama3_1_8b]: {
    name: 'llama3.1:8b',
  },
  [OllamaModelEnum.llama3_2_3b]: {
    name: 'llama3.2:3b',
  },
  [OllamaModelEnum.gemma3_12]: {
    name: 'gemma3:12b ',
  },
  [OllamaModelEnum.deepseek_r1_7b]: {
    name: 'deepseek-r1:7b-qwen-distill-fp16',
  },
  [OllamaModelEnum.deepseek_r1_1_5b]: {
    name: 'deepseek-r1:1.5b-qwen-distill-fp16',
  },
  [OllamaModelEnum.qwen2_5]: {
    name: 'qwen2.5:7b-instruct-fp16',
  },
  [OllamaModelEnum.qwen2]: {
    name: 'qwen2:7b-instruct-fp16',
  },
  [OllamaModelEnum.nomic]: {
    name: 'nomic-embed-text: latest',
  },
  [OllamaModelEnum.llama_guard3]: {
    name: 'llama-guard3:8b-fp16',
  },
} as const satisfies Record<OllamaModelEnum, { name: string }>

export const MODEL_DEFAULTS = {
  [Vendors.google]: GOOGLE_MODELS,
  [Vendors.gov]: GOV_MODELS,
  [Vendors.ollama]: OLLAMA_MODELS,
} as const satisfies Record<Vendors, unknown>

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

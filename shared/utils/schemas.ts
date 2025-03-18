import { z } from 'zod'
import { ACTIONS, ENTITIES, GoogleModelEnum, OllamaModelEnum, Vendors } from './constants'

export type EntitiesKeys = keyof typeof ENTITIES
export type EntitiesValues = typeof ENTITIES[EntitiesKeys]

export type ActionKeys = keyof typeof ACTIONS
export type ActionValues = typeof ACTIONS[ActionKeys]

export type MessageSchema = z.infer<typeof messageSchema>
export type EntitySchema = z.infer<typeof entitySchema>

export type DiscriminatedModelSchema = z.infer<typeof discriminatedModelSchema>
export type InferBodySchema = z.infer<typeof inferBodySchema>

export const entitySchema = z.enum(
  Object.values(ENTITIES) as [EntitiesValues],
).describe('invalid entity')

export const actionSchema = z.enum(
  Object.values(ACTIONS) as [ActionValues],
).describe('invalid action')

export const allOptions = z.union([entitySchema, actionSchema])

export const messageSchema = z.object({
  message: z.string(),
})

export const agentResponseSchema = allOptions

export const googleBody = z.object({
  vendor: z.literal(Vendors.google),
  model: z.nativeEnum(GoogleModelEnum).optional(),
})

export const govBody = z.object({
  vendor: z.literal(Vendors.gov),
  model: z.nativeEnum(GovModelEnum).optional(),
})

export const ollamaBody = z.object({
  vendor: z.literal(Vendors.ollama),
  model: z.nativeEnum(OllamaModelEnum).optional(),
})

export const discriminatedModelSchema = z.discriminatedUnion('vendor', [
  googleBody,
  govBody,
  ollamaBody,
])

export const inferBodySchema = z.union([messageSchema, discriminatedModelSchema.and(messageSchema)])

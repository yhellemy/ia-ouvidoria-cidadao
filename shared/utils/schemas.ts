import { z } from 'zod'
import { ACTIONS, ENTITIES } from './constants'

export type EntitiesKeys = keyof typeof ENTITIES
export type EntitiesValues = typeof ENTITIES[EntitiesKeys]

export type ActionKeys = keyof typeof ACTIONS
export type ActionValues = typeof ACTIONS[ActionKeys]

export type MessageSchema = z.infer<typeof messageSchema>
export type EntitySchema = z.infer<typeof entitySchema>

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

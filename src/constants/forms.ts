import data from '@/data/forms'
import { keyBy } from 'es-toolkit'

export const forms = [...data]

export type Form = (typeof data)[number]
export type FormName = Form['name']

export const formsMap = keyBy(forms, (form) => form.name)

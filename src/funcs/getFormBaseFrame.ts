import { PMath } from '@/constants/consts'
import { forms, type Form } from '@/constants/forms'

export function getFormBaseFrame(form: Form): number {
    const index = forms.indexOf(form)

    return PMath.FloorTo(index / 32) * 64 + (index % 32)
}

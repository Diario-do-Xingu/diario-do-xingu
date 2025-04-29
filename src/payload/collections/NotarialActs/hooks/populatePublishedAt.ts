import { FieldHook } from 'payload'

export const populatePublishedAt: FieldHook = ({ value, operation }) => {
  if ((operation === 'create' || operation === 'update') && !value) {
    return new Date()
  }
  return value
}

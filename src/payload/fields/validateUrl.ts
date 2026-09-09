import type { TextFieldSingleValidation } from 'payload'

/**
 * For text fields that end up as an href: only full web URLs. React already refuses to render
 * `javascript:` hrefs, so this is mostly about catching schemeless or mistyped links before they
 * are saved. It replaces Payload's default text validation, hence the required and length checks.
 */
export const validateUrl: TextFieldSingleValidation = (value, { required }) => {
  if (!value) return required ? 'Este campo é obrigatório' : true
  return (
    /^https?:\/\/\S{1,2000}$/i.test(value) ||
    'Informe uma URL completa, começando com http:// ou https://'
  )
}

import type { CollectionBeforeOperationHook, PayloadRequest } from 'payload'
import { describe, expect, it, vi } from 'vitest'
import { assignKeyAndFilename } from './assignKeyAndFilename'

type HookArgs = Parameters<CollectionBeforeOperationHook>[0]
type Data = { key?: string; slug?: string }

/** Minimal stand-in for the operation args: the hook only reads `data`, `id` and `req.file`. */
const run = ({
  operation,
  data,
  id,
  filename,
  storedKey,
}: {
  operation: HookArgs['operation']
  data?: Data
  id?: string | number
  filename?: string
  storedKey?: string | null
}) => {
  const findByID = vi.fn().mockResolvedValue(storedKey === null ? null : { key: storedKey })
  const file = filename ? { name: filename } : undefined
  const args = { data, ...(id === undefined ? {} : { id }) }
  const req = { file, payload: { findByID } } as unknown as PayloadRequest

  return {
    findByID,
    file,
    result: assignKeyAndFilename({ args, operation, req } as unknown as HookArgs),
  }
}

/** `run` with the hook already awaited, for the cases that assert on its side effects. */
const runAwaited = async (options: Parameters<typeof run>[0]) => {
  const call = run(options)
  await call.result
  return call
}

const KEY = /^[0-9a-f]{32}$/

describe('assignKeyAndFilename on create', () => {
  it('generates a hyphen-free key and mirrors it into the slug', async () => {
    const data: Data = {}
    await runAwaited({ operation: 'create', data, filename: 'edital.pdf' })

    expect(data.key).toMatch(KEY)
    expect(data.slug).toBe(data.key)
  })

  it('names the file after the key, keeping only the last extension', async () => {
    const data: Data = {}
    const { file } = await runAwaited({
      operation: 'create',
      data,
      filename: 'edital.final.v2.pdf',
    })

    expect(file?.name).toBe(`na-${data.key}.pdf`)
  })

  it('keeps a key that was supplied explicitly', async () => {
    const data: Data = { key: 'chaveexistente' }
    const { file } = await runAwaited({ operation: 'create', data, filename: 'edital.pdf' })

    expect(data.key).toBe('chaveexistente')
    expect(data.slug).toBeUndefined()
    expect(file?.name).toBe('na-chaveexistente.pdf')
  })

  it('still assigns a key when no file is uploaded', async () => {
    const data: Data = {}
    await runAwaited({ operation: 'create', data })

    expect(data.key).toMatch(KEY)
  })
})

describe('assignKeyAndFilename on update', () => {
  it('names the file after the stored key and replaces the previous upload', async () => {
    const { findByID, file, result } = run({
      operation: 'update',
      id: 'abc123',
      filename: 'novo.pdf',
      storedKey: 'chaveexistente',
    })
    const args = (await result) as { overwriteExistingFiles?: boolean }

    expect(findByID).toHaveBeenCalledWith(expect.objectContaining({ id: 'abc123', depth: 0 }))
    expect(file?.name).toBe('na-chaveexistente.pdf')
    expect(args.overwriteExistingFiles).toBe(true)
  })

  it('rejects a bulk update that carries a file, since there is no key to name it after', async () => {
    const { result } = run({ operation: 'update', filename: 'novo.pdf', storedKey: 'k' })

    await expect(result).rejects.toThrow('Envio de arquivo não é suportado em edição em massa')
  })

  it('leaves the uploaded name alone for acts that predate keys', async () => {
    const { file, result } = run({
      operation: 'update',
      id: 'abc123',
      filename: 'antigo.pdf',
      storedKey: null,
    })
    const args = (await result) as { overwriteExistingFiles?: boolean }

    expect(file?.name).toBe('antigo.pdf')
    expect(args.overwriteExistingFiles).toBeUndefined()
  })

  it('does not look the document up when no file is uploaded', async () => {
    const { findByID } = await runAwaited({ operation: 'update', id: 'abc123' })

    expect(findByID).not.toHaveBeenCalled()
  })
})

describe('assignKeyAndFilename on other operations', () => {
  it('ignores reads and deletes', async () => {
    const data: Data = {}
    const { findByID } = await runAwaited({ operation: 'delete', data, id: 'abc123' })

    expect(data.key).toBeUndefined()
    expect(findByID).not.toHaveBeenCalled()
  })
})

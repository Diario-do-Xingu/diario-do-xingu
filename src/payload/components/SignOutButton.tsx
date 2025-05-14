'use client'

import { Button, useAuth, ConfirmationModal, useModal } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const { logOut } = useAuth()
  const { replace } = useRouter()

  const { openModal } = useModal()

  return (
    <>
      <ConfirmationModal
        modalSlug="signout-modal"
        heading={'Você está saindo do sistema'}
        body={'Deseja confirmar?'}
        onConfirm={() => {
          logOut()
          replace('/admin/login')
        }}
      ></ConfirmationModal>

      <Button
        buttonStyle="secondary"
        className="signout-button"
        onClick={() => {
          openModal('signout-modal')
        }}
      >
        Sair
      </Button>
    </>
  )
}

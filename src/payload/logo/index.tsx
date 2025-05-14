import Image from 'next/image'

import logo from '@/assets/images/default-logo.png'
import icon from '@/assets/images/icon.png'

export function AdminLogo() {
  return (
    <div className="admin-logo">
      <Image src={logo} alt="" priority />
    </div>
  )
}

export function AdminIcon() {
  return (
    <div className="">
      <Image src={icon} alt="" priority />
    </div>
  )
}

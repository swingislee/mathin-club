import Link from 'next/link'
import { useTranslation } from '@/app/i18n'

export default async function Navbar({ lng }) {
  const { t } = await useTranslation(lng)

  return (
    <nav>
      <Link href={`/${lng}/tools`}>
      {t('tools')}
      </Link>
    </nav>
  )
}

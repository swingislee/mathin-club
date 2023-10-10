import Link from 'next/link'
import { useTranslation } from '@/app/i18n'
import ThemeSwitcher from '../Setmenu/Day-to-night/ThemeSwitcher'

export default async function Navbar({ lng }) {
  const { t } = await useTranslation(lng)

  return (
    <nav>
      <Link href={`/${lng}/story`}> {t('story')} </Link>
      <Link href={`/${lng}/games`}> {t('games')} </Link>
      <Link href={`/${lng}/minds`}> {t('minds')} </Link>
      <Link href={`/${lng}/terms`}> {t('terms')} </Link>
      <Link href={`/${lng}/tools`}> {t('tools')} </Link>
      <ThemeSwitcher/>
      
    </nav>
  )
}

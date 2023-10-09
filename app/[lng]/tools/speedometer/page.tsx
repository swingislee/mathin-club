'use client'

import Link from 'next/link'
import { useTranslation } from '@/app/i18n/client'
import { Setlng } from '../../components/Setmenu/Setlanguage/client'
import MainContainer from './components/MainContainer';

export default function Page({ params: { lng } }) {
  const { t } = useTranslation(lng, 'speedometer')
  return (
    <>
      <MainContainer />

      <Link href={`/${lng}`}>
        <button type="button">
          {t('back-to-home')}
        </button>
      </Link>
      <Setlng lng={lng} />
    </>
  )
}
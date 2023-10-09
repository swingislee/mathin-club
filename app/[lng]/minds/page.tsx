import Link from 'next/link'
import { useTranslation } from '../../i18n'
import { Setlng } from "../components/Setmenu/Setlanguage"


export default async function Page({ params: { lng } }) {
  const { t } = await useTranslation(lng, 'minds')
  return (
    <>
      <h1>{t('title')}</h1>
      <Link href={`/${lng}`}>
        {t('back')}
      </Link>
      <br />
      <Link href={`/${lng}/tools/speedometer`}>
        {t('speedometer')}
      </Link>
      <Setlng lng={lng} />
    </>
  )
}
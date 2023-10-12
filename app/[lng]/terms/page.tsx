import Link from 'next/link'
import { useTranslation } from '../../i18n'
import { Setlng } from "../components/Setmenu/Setlanguage"


export default async function Page({ params: { lng } }) {
  const { t } = await useTranslation(lng, 'terms')
  return (
    <div className="absolute w-screen top-12 bottom-0 ">
      <h1 className="text-2xl dl:text-5xl font-bold text-center my-4 dl:my-8">{t('title')}</h1>
    </div>
  )
}
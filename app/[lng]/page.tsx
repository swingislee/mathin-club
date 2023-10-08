import Navbar from "./components/Navbar"
import { useTranslation } from '../i18n'
import { Setlng } from "./components/Setmenu/Setlanguage"

export default async function Page({ params: { lng } }) {
  const { t } = await useTranslation(lng)
  return (
    <>
      <h1>{t('title')}</h1>      
      <Navbar lng={lng} />
      <Setlng lng={lng} />
    </>
  )
}

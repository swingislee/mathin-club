import { useTranslation } from '@/app/i18n/'
import { SetlngBase } from './SetlngBase'

export const Setlng = async ({ lng }) => {
  const { t } = await useTranslation(lng, 'setmenu')
  return <SetlngBase t={t} lng={lng} />
}
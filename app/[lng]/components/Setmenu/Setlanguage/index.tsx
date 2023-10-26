import { Translate } from '@/app/i18n/'
import { SetlngBase } from './SetlngBase'

export const Setlng = async ({ lng }) => {
  const { t } = await Translate(lng, 'setmenu')
  return <SetlngBase t={t} lng={lng} />
}
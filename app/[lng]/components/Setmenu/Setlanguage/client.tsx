'use client'
import { Translate } from '@/app/i18n/client'
import { SetlngBase } from './SetlngBase'

export const Setlng = ({ lng }) => {
  const { t } = Translate(lng, 'setmenu','')
  return <SetlngBase t={t} lng={lng} />
}
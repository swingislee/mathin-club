'use client'
import { useTranslation } from '@/app/i18n/client'
import { SetlngBase } from './SetlngBase'

export const Setlng = ({ lng }) => {
  const { t } = useTranslation(lng, 'setmenu')
  return <SetlngBase t={t} lng={lng} />
}
'use client'

import { useTranslation } from '@/app/i18n/client';
import {SpeedDataProvider} from './components/SpeedDataContext';


export default function PageLayout({children,params: {lng}}) {
  const {t} = useTranslation(lng,"speedometer");

  return (
    <>
      <header>{t('title')}</header>
      <SpeedDataProvider>{children}</SpeedDataProvider>
    </>
  );
}

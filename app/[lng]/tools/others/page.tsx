import { useTranslation } from '@/app/i18n'


export default async function Page({ params: { lng } }) {
  const { t } = await useTranslation(lng, 'tools')
  return (
    <div className="absolute w-screen top-12 bottom-0 ">
      <h1 className="text-2xl dl:text-5xl font-bold text-center my-4 dl:my-8">{t('others')}</h1>
    </div>
  )
}
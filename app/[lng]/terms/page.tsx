import Link from 'next/link'
import { Translate } from '../../i18n'


export default async function Page({ params: { lng } }) {
  const { t } = await Translate(lng, 'terms');

  return (
    <div className="absolute w-screen top-12 bottom-0">
      <h1 className="text-2xl dl:text-5xl font-bold text-center my-4 dl:my-8">{t('termstitle')}</h1>
      <Link href={`/${lng}/terms/stars`} > stars </Link>
    </div>
  )
}
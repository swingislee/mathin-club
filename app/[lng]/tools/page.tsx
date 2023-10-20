import Link from 'next/link'
import { useTranslation } from '../../i18n'
import Navbar from "../components/Navbar"

export default async function Page({ params: { lng } }) {
  const { t } = await useTranslation(lng, 'tools')
  const toolsbox = [
    { path: `/${lng}/tools/speedometer`, title: t('speedometer'), thumbnail: '/tools/speedometer.png' },
    { path: `/${lng}/tools/others`, title: t('others'), thumbnail: '/tools/others.png' },
  ];
  
  return (
    <div className="absolute w-screen top-12 bottom-0 ">
      <h1 className="text-2xl dl:text-5xl font-bold text-center my-4 dl:my-8">{t('toolstitle')}</h1>
      <div className="p-4 flex justify-center flex-wrap">
        {toolsbox.map((tool) => (
          <Link key={tool.path} href={tool.path} className="block w-64 m-2 relative shadow-lg">
              <div className="h-40 bg-center bg-cover" style={{backgroundImage: `url(${tool.thumbnail})`}}></div>
              <div className="mt-2 text-center font-bold shadow">{tool.title}</div>
          </Link>
        ))}
      </div>
      <Navbar lng={lng} page="games"/>
    </div>
  )
} 
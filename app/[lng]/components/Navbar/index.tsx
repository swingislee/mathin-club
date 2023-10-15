import Link from 'next/link'
import { useTranslation } from '@/app/i18n'

export default async function Navbar({ lng ,page}) {
  const { t } = await useTranslation(lng,"translation")
    
    let conbase: any, fontbase: any, linkbase: any;
    if (page === 'home') {
      linkbase = ' rounded-md hover:bg-amber-200 dark:hover:bg-slate-600';
      conbase = "fixed dl:w-auto dl:bottom-auto dl:right-8 dl:top-[5.5rem] dl:gap-4 dl:bg-transparent text-x"           
      fontbase = `${lng === 'en' ? 'text-xl dl:text-3xl' : 'text-2xl dl:text-4xl'} `
    } else if(page === 'toolsbox') {
      
    linkbase = 'sl:px-1 sl:rounded  sl:border-2 sl:border-transparent sl:hover:border-slate-500 sl:dark:hover:border-amber-200';
    conbase = `fixed sl:absolute sl:text-xl top-auto sl:bottom-auto sl:top-0 dl:gap-4 sl:gap-8 sl:justify-center `
    fontbase = `${lng === 'en' ? 'text-xl' : 'text-2xl'} `

    }
    else {
      linkbase = 'dl:px-1 dl:rounded  dl:border-2 dl:border-transparent dl:hover:border-slate-500 dl:dark:hover:border-amber-200';
      conbase = `fixed dl:text-xl top-auto dl:bottom-auto dl:top-0 dl:gap-4 dl:gap-8 dl:justify-center `
      fontbase = `${lng === 'en' ? 'text-xl' : 'text-2xl'} `
    }

    const classValue ="flex items-center rounded-md p-2  dl:px-2 dl:py-0 "+ linkbase ;
    const ContainerCss ="flex justify-evenly  items-center align-middle w-full h-12 bottom-10 bg-amber-100 dark:bg-slate-500 "+ conbase + " " + fontbase ;

  return (
    <nav>
      <div className={ ContainerCss}>
      <Link href={`/${lng}/story`}  className={classValue}> {t('story')} </Link>
      <Link href={`/${lng}/games`}  className={classValue}> {t('games')} </Link>
      <Link href={`/${lng}/minds`}  className={classValue}> {t('minds')} </Link>
      <Link href={`/${lng}/terms`}  className={classValue}> {t('terms')} </Link>
      <Link href={`/${lng}/tools`}  className={classValue}> {t('tools')} </Link>
      </div>
    </nav>
  )
}

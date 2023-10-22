import { dir } from 'i18next'
import { languages } from '../i18n/settings'
import Provider from './components/Setmenu/Day-to-night/Provider'
import './global.css'
import { useTranslation } from '../i18n'
import Footer from './components/Footer'

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export async function generateMetadata({ params: { lng } }) {

  const { t } = await useTranslation(lng,"translation")
  return {
    title: t('title'),
  }
}

export default function RootLayout({
  children,
  params: {
    lng
  }
}) {
  return (
    <html lang={lng} dir={dir(lng)}>
        
          <body><Provider>
            {children}
            <Footer/>
            </Provider>
          </body>
        
    </html>
  )
}
import { dir } from 'i18next'
import { languages } from '../i18n/settings'
import Provider from './components/Setmenu/Day-to-night/Provider'
import './global.css'

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default function RootLayout({
  children,
  params: {
    lng
  }
}) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <head/>
      <Provider>
      <body>
        {children}
      </body>
      </Provider>
    </html>
  )
}
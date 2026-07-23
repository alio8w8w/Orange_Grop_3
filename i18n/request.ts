import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ro'

  return {
    locale,
    // Calea relativă explicită din folderul i18n către messages
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
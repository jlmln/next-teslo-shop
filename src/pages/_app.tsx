import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { Provider } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { CssBaseline, ThemeProvider } from '@mui/material'
import { SWRConfig } from 'swr'

import '@/styles/globals.css'
import { lightTheme } from '@/themes'

//Store
import { store } from '@/app/store'

export default function App({ Component, pageProps: { session, ...pageProps} }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <PayPalScriptProvider options={{ "client-id" : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
          <SWRConfig
            value={{
              // refreshInterval: 3000,
              fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
          >
            <ThemeProvider theme={lightTheme} >
              <CssBaseline/>
              <Component {...pageProps} />
            </ThemeProvider>
          </SWRConfig>
        </PayPalScriptProvider>
      </Provider>
    </SessionProvider>
  )
}

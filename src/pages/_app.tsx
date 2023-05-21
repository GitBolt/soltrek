import '@/styles/globals.css'
import 'reactflow/dist/style.css';
import '@fontsource/inter/';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import type { AppProps } from 'next/app'
import { ReactFlowProvider } from 'reactflow'
import { Wallet } from "@/context/walletContext";
import { NetworkProvider } from '@/context/configContext';
import { ModalProvider } from '@/context/modalContext';
import { DefaultHead } from '@/layouts/DefaultHead';
import { ThemeProvider } from '@/context/themeContext';

export default function SOLTrek({ Component, pageProps }: AppProps) {

  return (
      <Wallet>
        <ThemeProvider>
          <ReactFlowProvider>
            <NetworkProvider>
              <ModalProvider>
                <DefaultHead />
                <Component {...pageProps} />
              </ModalProvider>
            </NetworkProvider>
          </ReactFlowProvider>
        </ThemeProvider>
      </Wallet>
  )
}
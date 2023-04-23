import '@/styles/globals.css'
import 'reactflow/dist/style.css';
import '@fontsource/inter/';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { ReactFlowProvider } from 'reactflow'
import { theme } from '@/util/theme'
import { Wallet } from "@/context/connectWalletContext";


export default function SolBuild({ Component, pageProps }: AppProps) {

  return (
    <Wallet>
      <ChakraProvider theme={theme}>
        <ReactFlowProvider>
          <Component {...pageProps} />
        </ReactFlowProvider>
      </ChakraProvider>
    </Wallet>
  )
}
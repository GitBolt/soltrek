import '@/styles/globals.css'
import 'reactflow/dist/style.css';
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { ReactFlowProvider } from 'reactflow'
import { theme } from '@/util/theme'

export default function SolBuild({ Component, pageProps }: AppProps) {

  return (
    <ChakraProvider theme={theme}>
      <ReactFlowProvider>
        <Component {...pageProps} />
      </ReactFlowProvider>
    </ChakraProvider>
  )
}
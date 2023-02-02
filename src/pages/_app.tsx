import '@/styles/globals.css'
import 'reactflow/dist/style.css';
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { ReactFlowProvider } from 'reactflow'

export default function SolBuild({ Component, pageProps }: AppProps) {

  return (
    <ChakraProvider>
      <ReactFlowProvider>
        <Component {...pageProps} />
      </ReactFlowProvider>
    </ChakraProvider>
  )
}
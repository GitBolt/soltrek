import { Flex, Text } from "@chakra-ui/react"
import { ConnectWalletButton } from "../components/ConnectWalletButton"
import { NetworkSelector } from "../components/NetworkSelector"
import { useEffect, useState } from "react"
import { getUser } from "@/util/program/user"
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react"
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet"
import { MyPlaygroundsButton } from "@/components/MyPlaygroundsButton"

export const Navbar = () => {

  const { publicKey } = useWallet()


  return (
    <Flex w="100%" h="6rem" pos="static" top="0" bg="bg.100" align="center" justify="end">
      {publicKey && <MyPlaygroundsButton />}
      <NetworkSelector />
      <ConnectWalletButton />
    </Flex>
  )
}
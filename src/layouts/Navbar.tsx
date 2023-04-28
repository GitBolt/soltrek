import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react"
import { ConnectWalletButton } from "../components/ConnectWalletButton"
import { NetworkSelector } from "../components/NetworkSelector"
import { useEffect, useState } from "react"
import { getUser } from "@/util/program/user"
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react"
import { useReactFlow } from "reactflow"
import { SavedPlaygrounds } from "@/components/SavedPlaygrounds"

export const Navbar = () => {

  const { toObject } = useReactFlow()
  const { isOpen, onClose, onOpen } = useDisclosure()

  const { publicKey } = useWallet()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (!publicKey) return
    const run = async () => {
      const userReq = await fetch(`/api/user/${publicKey.toBase58()}`)
      let user = await userReq.json()

      if (!userReq.ok) {
        const newUserReq = await fetch(`/api/user/new`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ publicKey }),
        })
        user = await newUserReq.json()

      }
      setUser(user)
    }
    run()
  }, [publicKey])

  const handlePlaygroundSave = async () => {
    if (!user) return
    const response = await fetch('/api/playground/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.id, name: "hi", data: JSON.stringify(toObject()) }),
    })
    const playground = await response.json()
    return playground
  }

  return (
    <Flex w="100%" h="6rem" pos="static" top="0" bg="bg.100" align="center" justify="end">
      <SavedPlaygrounds isOpen={isOpen} onClose={onClose} user={user} />
      {user && <Button variant="filled" onClick={handlePlaygroundSave}>Save</Button>}
      {user && <Button variant="outline" onClick={onOpen}>Load</Button>}
      <NetworkSelector />
      <ConnectWalletButton />
    </Flex>
  )
}
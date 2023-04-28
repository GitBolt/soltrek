import { Button, Divider, Flex, Input, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { ConnectWalletButton } from "../components/ConnectWalletButton"
import { NetworkSelector } from "../components/NetworkSelector"
import { useEffect, useState } from "react"
import { getUser } from "@/util/program/user"
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react"
import { useReactFlow } from "reactflow"
import { SavedPlaygrounds } from "@/components/SavedPlaygrounds"
import { uploadFile } from "@/util/upload"
import html2canvas from "html2canvas"
import { dataURItoBlob } from "@/util/helper"
import { compressImage } from "@/util/compressor"
import { SavedPlaygroundType } from "@/types/playground"
import { useCustomModal } from "@/context/modalContext"

export const Navbar = () => {

  const { toObject } = useReactFlow()

  const { publicKey } = useWallet()
  const [user, setUser] = useState<any>(null)
  const toast = useToast()
  const [currentPlayground, setCurrentPlayground] = useState<SavedPlaygroundType>()
  const { savedPg } = useCustomModal()
  const [name, setName] = useState<string>(currentPlayground?.name || '')

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

    const container = document.getElementById('rf-main');
    const canvas = await html2canvas(container!, {
      ignoreElements: (element) => element.className === "solflare-wallet-adapter-iframe",
      width: window.screen.width,
      height: window.screen.height,
    }); const imageData = canvas.toDataURL()
    const blob = dataURItoBlob(imageData)

    const compressed = await compressImage(blob)

    const file = new File([compressed as Blob], "img.png", { type: "image/png" });

    const preview_uri = await uploadFile(file)

    let response: any
    if (currentPlayground && currentPlayground.id) {
      response = await fetch('/api/playground/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playgroundId: currentPlayground.id,
          name,
          data: JSON.stringify(toObject()),
          preview_uri
        }),
      })

    } else {
      response = await fetch('/api/playground/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: "hi",
          data: JSON.stringify(toObject()),
          preview_uri
        }),
      })
    }

    if (response.ok) {
      toast({
        title: "Created Playground",
        status: "success"
      })
      const data = await response.json()
      setCurrentPlayground(data)
    } else {
      toast({
        title: "Error creating playground",
        status: "error"
      })
    }
  }



  return (
    <Flex w="100%" h="6rem" pos="static" top="0" bg="bg.100" align="center" justify="end" gap="2rem">

      <SavedPlaygrounds user={user} setCurrentPlayground={setCurrentPlayground} />

      {user && <Flex borderRight="2px solid" borderColor="gray.200" p="0 2rem" gap="2rem">
        <Input
          w="25rem"
          h="3.5rem"
          onChange={(e) => {
            setName(e.target.value)
          }}
          fontSize="1.6rem"
          value={name}
          placeholder="Enter Playground Name"
        />
        <Button variant="filled" onClick={handlePlaygroundSave}>Save</Button>
        <Button variant="outline" onClick={savedPg.onOpen}>Load</Button>
      </Flex>
      }
      <NetworkSelector />
      <ConnectWalletButton />
    </Flex>
  )
}
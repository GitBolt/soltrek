import { Button, Divider, Flex, Input, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { ConnectWalletButton } from "../components/ConnectWalletButton"
import { NetworkSelector } from "../components/NetworkSelector"
import { useEffect, useState } from "react"
import { getUser } from "@/util/program/user"
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react"
import { useReactFlow } from "reactflow"
import { SavedPlaygrounds } from "@/components/SavedPlaygrounds"
import { cloudinaryUpload, uploadFile } from "@/util/upload"
import html2canvas from "html2canvas"
import { dataURItoBlob } from "@/util/helper"
import { blobToBase64, compressImage } from "@/util/compressor"
import { SavedPlaygroundType } from "@/types/playground"
import { useCustomModal } from "@/context/modalContext"
import { AddIcon } from "@chakra-ui/icons"
import { AddAccess } from "@/components/AddAccess"
import { useRouter } from "next/router"

export const Navbar = ({ multiplayer = false, editAccess = false }: { multiplayer?: boolean, editAccess?: boolean }) => {

  const { toObject } = useReactFlow()

  const { publicKey } = useWallet()
  const [user, setUser] = useState<any>(null)
  const toast = useToast()
  const [currentPlayground, setCurrentPlayground] = useState<SavedPlaygroundType>()
  const { savedPg, accessModal } = useCustomModal()
  const [name, setName] = useState<string>(currentPlayground?.name || 'Untitled')
  const { setNodes, setEdges, setViewport } = useReactFlow()
  const router = useRouter()

  useEffect(() => {
    if (!currentPlayground) return
    setName(currentPlayground.name)
  }, [currentPlayground])


  useEffect(() => {
    if (!publicKey) {
      setUser(null)
      return
    }
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
      height: window.screen.height + 100,
    }); const imageData = canvas.toDataURL()



    const blob = dataURItoBlob(imageData)

    const compressed = await compressImage(blob)

    // const file = new File([compressed as Blob], "img.png", { type: "image/png" });

    // const imageUri = await cloudinaryUpload(file)

    const imageUri = await blobToBase64(compressed)

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
          preview_uri: imageUri,
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
          name,
          data: JSON.stringify(toObject()),
          preview_uri: imageUri,
        }),
      })
    }

    if (response.ok) {
      toast({
        title: `${currentPlayground ? 'Updated' : 'Created'} Playground`,
        status: "success",
        position: "bottom-right"
      })
      const data = await response.json()
      setCurrentPlayground(data)
    } else {
      toast({
        title: "Error creating playground",
        status: "error",
        position: "bottom-right"
      })
    }
  }


  const startMultiplayer = async () => {

    const response = await fetch('/api/playground/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        name: "Untitled",
        data: "",
        preview_uri: "",
      }),
    })

    if (response.ok) {
      const data = await response.json()
      router.push(`/playground/${data.id}`)
      setCurrentPlayground(data)
      console.log("aaui", user, data, multiplayer && user && data && user.id == data.userId)
    }
  }

  console.log(multiplayer)
  return (
    <Flex w="100%" h="6rem" pos="static" top="0" bg="bg.100" align="center" justify="end" gap="2rem">

      
      <SavedPlaygrounds user={user} setCurrentPlayground={setCurrentPlayground} />
      <AddAccess user={user} playgroundId={Number(currentPlayground?.id)} />

      {user && currentPlayground && user.id == currentPlayground.userId &&
        <Flex borderRight="2px solid" borderColor="gray.200" p="0 2rem" gap="2rem">
          <Button variant="outline" onClick={accessModal.onOpen} w="15rem">Add Access</Button>
        </Flex>
      }


      {user && <Flex borderRight="2px solid" borderColor="gray.200" p="0 2rem" gap="2rem">
        <Button variant="filled" onClick={handlePlaygroundSave}>Save</Button>
        <Button variant="outline" onClick={savedPg.onOpen}>Load</Button>
      </Flex>
      }

      {multiplayer && user && currentPlayground && user.id == currentPlayground.userId ?
        <Input
          w="25rem"

          h="3.5rem"
          onChange={(e) => {
            setName(e.target.value)
          }}
          fontSize="1.6rem"
          value={name}
          defaultValue={name}
          placeholder="Enter Playground Name"
        /> :
        <Text color="blue.100" fontWeight={400} fontSize="2.5rem" textAlign="center" >{name}</Text>

      }
      {!multiplayer && user &&
        <Input
          w="25rem"

          h="3.5rem"
          onChange={(e) => {
            setName(e.target.value)
          }}
          fontSize="1.6rem"
          value={name}
          defaultValue={name}
          placeholder="Enter Playground Name"
        />
      }

      <Button justifySelf="start" variant="filled" bg="magenta.100" w="fit-content" fontSize="1.5rem" p="0 2rem" h="3rem" onClick={() => {
        setCurrentPlayground(undefined)
        setNodes([])
        setEdges([])
        setViewport({ x: 0, y: 0, zoom: 1.5 })
        router.push('/')
      }} leftIcon={<AddIcon />}>Single Player</Button>

      {user && <Button justifySelf="start" variant="filled" w="fit-content" bg="magenta.100" fontSize="1.5rem" h="3rem"
        onClick={startMultiplayer} leftIcon={<AddIcon />}>Multiplayer</Button>}
      <Divider w="2px" h="4rem" bg="gray.200" />
      <NetworkSelector />
      <ConnectWalletButton />
    </Flex>
  )
}
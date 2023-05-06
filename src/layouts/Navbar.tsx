import { Button, Divider, Flex, Input, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure, useToast } from "@chakra-ui/react"
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
import { NewButton } from "@/components/NewButton"

export const Navbar = ({ multiplayer = false, editAccess = false, setEditAccess }: { multiplayer?: boolean, editAccess?: boolean, setEditAccess?: any }) => {

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

    const run = async () => {

      if (!publicKey) {
        setUser(null)
        if (setEditAccess) setEditAccess(null)
        return
      }
      const userReq = await fetch(`/api/user/${publicKey.toBase58()}`)
      let userData = await userReq.json()

      if (!userReq.ok) {
        const newUserReq = await fetch(`/api/user/new`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ publicKey }),
        })
        userData = await newUserReq.json()
      }

      setUser(userData)

      if (multiplayer) {
        const res = await fetch(`/api/playground/get/id/${router.query.id}`)
        const pgData = await res.json()
        setCurrentPlayground(pgData)
        console.log(pgData, userData)
        setEditAccess(
          userData.id == pgData.userId ||
          pgData.edit_access.includes(publicKey.toBase58())
        )
      }
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiplayer, router.query.id, publicKey])




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


  return (
    <Flex w="100%" p="0 1rem" h="6rem" zIndex="5" bg="#1C1C26" pos="static" top="0" align="center" justify="space-between" gap="1rem">


      <SavedPlaygrounds user={user} setCurrentPlayground={setCurrentPlayground} />
      {multiplayer && <AddAccess playground={currentPlayground!} setCurrentPlayground={setCurrentPlayground} />}


      {((multiplayer && user && currentPlayground && user.id == currentPlayground?.userId) || (!multiplayer && user)) &&
        <Flex align="center" gap="1rem">

          <Button variant="filled" h="3rem" fontSize="1.7rem" w="8rem" onClick={handlePlaygroundSave}>Save</Button>
          <Button variant="outline" h="3rem" fontSize="1.7rem" w="8rem" onClick={savedPg.onOpen}>Load</Button>
          <NetworkSelector />
        </Flex>
      }

      {((!user && multiplayer) || (user && currentPlayground && user.id != currentPlayground.userId && multiplayer)) && <NewButton
        setEdges={setEdges}
        setNodes={setNodes}
        setViewport={setViewport}
        setCurrentPlayground={setCurrentPlayground}
        user={user}
      />}

      {multiplayer && user && currentPlayground && user.id == currentPlayground.userId &&
        <Input
          w="22rem"
          h="3rem"
          onChange={(e) => {
            setName(e.target.value)
          }}
          fontSize="1.5rem"
          color="blue.200"
          value={name}
          defaultValue={name}
          placeholder="Enter Playground Name"
        />
      }

      {((multiplayer && !user) || (!multiplayer && !user) || (multiplayer && user && currentPlayground && user.id != currentPlayground.userId)) &&
        <Text color="blue.200" fontWeight={400} fontSize="2.5rem" textAlign="center" >{name}</Text>}

      {!multiplayer && user &&
        <Input
          w="22rem"
          h="3rem"
          onChange={(e) => {
            setName(e.target.value)
          }}
          fontSize="1.5rem"
          color="blue.200"
          value={name}
          defaultValue={name}
          placeholder="Enter Playground Name"
        />
      }

      <Flex borderRight="1px solid" align="center" borderColor="gray.200" gap="1rem">
        {user && currentPlayground && user.id == currentPlayground.userId &&
          <Button variant="filled" h="3rem" w="10rem" fontSize="1.4rem" onClick={accessModal.onOpen}>Give Access</Button>
        }
        {((multiplayer && user && currentPlayground && user.id == currentPlayground.userId) || (!multiplayer)) && (
          <NewButton
            setEdges={setEdges}
            setNodes={setNodes}
            setViewport={setViewport}
            setCurrentPlayground={setCurrentPlayground}
            user={user}
          />
        )}
        <Divider w="2px" h="4rem" bg="gray.200" />
        <ConnectWalletButton />
      </Flex>

    </Flex>
  )
}
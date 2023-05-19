import { Button, Divider, Flex, Input, Text, useToast } from "@chakra-ui/react"
import { NetworkSelector } from "../components/NetworkSelector"
import React, { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useReactFlow } from "reactflow"
import { SavedPlaygrounds } from "@/components/SavedPlaygrounds"
import html2canvas from "html2canvas"
import { dataURItoBlob } from "@/util/helper"
import { blobToBase64, compressImage } from "@/util/compressor"
import { SavedPlaygroundType } from "@/types/playground"
import { useCustomModal } from "@/context/modalContext"
import { AddAccess } from "@/components/AddAccess"
import { useRouter } from "next/router"
import { NewButton } from "@/components/NewButton"
import dynamic from "next/dynamic"

const Wallets = dynamic(() => import("../components/ConnectWalletButton"), { ssr: false });


type Props = {
  multiplayer?: boolean,
  setEditAccess?: any,
  pgName: string,
  setPgName: React.Dispatch<React.SetStateAction<string>>
}

export const Navbar = ({
  multiplayer = false,
  setEditAccess,
  pgName,
  setPgName
}: Props) => {

  const { toObject } = useReactFlow()

  const { publicKey } = useWallet()
  const [user, setUser] = useState<any>(null)
  const toast = useToast()
  const [currentPlayground, setCurrentPlayground] = useState<SavedPlaygroundType>()
  const { savedPg, accessModal } = useCustomModal()
  const { setNodes, setEdges, setViewport } = useReactFlow()
  const router = useRouter()

  // useEffect(() => {
  //   if (!currentPlayground) return
  //   setPgName(currentPlayground.name)
  // }, [currentPlayground])

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
        console.log("RES: ", pgData)
        setCurrentPlayground(pgData)
        setEditAccess(
          userData.id == pgData.userId ||
          (pgData.edit_access &&
            pgData.edit_access.includes(publicKey.toBase58()))
        )
      }
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiplayer, publicKey])




  const handlePlaygroundSave = async () => {
    if (!user) {
      toast({
        status: "error",
        title: "User not found"
      })
      return
    }
    const container = document.getElementById('rf-main');
    const canvas = await html2canvas(container!, {
      ignoreElements: (element) => element.className === "solflare-wallet-adapter-iframe",
      width: window.screen.width,
      height: container?.offsetHeight,
    }); const imageData = canvas.toDataURL()

    const blob = dataURItoBlob(imageData)
    const compressed = await compressImage(blob)

    const imageUri = await blobToBase64(compressed)

    let response: any
    const existingPg = currentPlayground && currentPlayground.data && currentPlayground.preview_url
    if (existingPg) {
      console.log("Updating current")
      response = await fetch('/api/playground/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playgroundId: currentPlayground.id,
          name: pgName,
          data: JSON.stringify(toObject()),
          preview_uri: imageUri,
        }),
      })

    } else {
      console.log("Creating new")
      response = await fetch('/api/playground/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: pgName,
          multiplayer: multiplayer,
          data: JSON.stringify(toObject()),
          preview_uri: imageUri,
        }),
      })
    }

    if (response.ok) {
      const data = await response.json()
      setCurrentPlayground(data)
      toast({
        title: `${existingPg ? 'Updated' : 'Created'} Playground`,
        status: "success",
      })


    } else {
      toast({
        title: "Error creating playground",
        status: "error",
      })
    }
  }

  const handleKeyDown = async (event: any) => {
    if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      if (!publicKey) {
        toast({
          status: "error",
          title: "Connect wallet required",
        })
        return
      }
      await handlePlaygroundSave()
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, user, pgName]);

  return (
    <Flex w="100%" p="0 1rem" h="6rem" zIndex="5" bg="bg.200" pos="static" top="0" align="center" justify="space-between" gap="1rem">


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
            setPgName(e.target.value)
          }}
          fontSize="1.5rem"
          color="blue.200"
          value={pgName}
          defaultValue={pgName}
          placeholder="Enter Playground Name"
        />
      }

      {((multiplayer && !user) || (!multiplayer && !user) || (multiplayer && user && currentPlayground && user.id != currentPlayground.userId)) &&
        <Text color="blue.200" fontWeight={400} fontSize="2.5rem" textAlign="center" >{pgName}</Text>}

      {!multiplayer && user &&
        <Input
          w="22rem"
          h="3rem"
          onChange={(e) => {
            setPgName(e.target.value)
          }}
          fontSize="1.5rem"
          color="blue.200"
          value={pgName}
          defaultValue={pgName}
          placeholder="Enter Playground Name"
        />
      }

      <Flex borderRight="1px solid" align="center" borderColor="gray.200" gap="1rem">
        {multiplayer && user && currentPlayground && user.id == currentPlayground.userId &&
          <Button variant="filled" h="3rem" w="8rem" fontSize="1.4rem" onClick={accessModal.onOpen}>Share</Button>
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
        <NetworkSelector />
        <Wallets />
      </Flex>

    </Flex>
  )
}
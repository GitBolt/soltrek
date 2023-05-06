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

    const run = async () => {
      if (multiplayer) {
        const res = await fetch(`/api/playground/get/id/${router.query.id}`)
        const data = await res.json()
        setCurrentPlayground(data)
      } else {
        const res = await fetch(`/api/playground/get/${publicKey?.toBase58()}`)
        const data = await res.json()
        setCurrentPlayground(data)
      }
    }
    run()
  }, [multiplayer, router.query.id, publicKey])


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
      console.log("aaui", user, data, multiplayer && user && data && user.id == data.userId)
    }
  }

  return (
    <Flex w="100%" h="6rem" pos="static" top="0" bg="bg.100" align="center" justify="end" gap="1rem">


      <SavedPlaygrounds user={user} setCurrentPlayground={setCurrentPlayground} />
      {multiplayer && <AddAccess playground={currentPlayground!} setCurrentPlayground={setCurrentPlayground} />}

      {user && currentPlayground && user.id == currentPlayground.userId &&
        <Flex borderRight="1px solid" borderColor="gray.200" p="0 1rem" gap="1rem">
          <Button variant="outline" h="3rem" w="12rem" fontSize="1.7rem" onClick={accessModal.onOpen}>Give access</Button>
        </Flex>
      }


      {user && <Flex borderRight="1px solid" align="center" borderColor="gray.200" p="0 1rem" gap="1rem">
        <Button variant="filled" h="3rem" fontSize="1.7rem" onClick={handlePlaygroundSave}>Save</Button>
        <Button variant="outline" h="3rem" fontSize="1.7rem" onClick={savedPg.onOpen}>Load</Button>
      </Flex>
      }

      {multiplayer && user && currentPlayground && user.id == currentPlayground.userId ?
        <Input
          w="18rem"
          h="3rem"
          onChange={(e) => {
            setName(e.target.value)
          }}
          fontSize="1.5rem"
          value={name}
          defaultValue={name}
          placeholder="Enter Playground Name"
        /> :
        <Text color="blue.100" fontWeight={400} fontSize="2.5rem" textAlign="center" >{name}</Text>

      }
      {!multiplayer && user &&
        <Input
          w="18rem"
          h="3rem"
          onChange={(e) => {
            setName(e.target.value)
          }}
          fontSize="1.5rem"
          value={name}
          defaultValue={name}
          placeholder="Enter Playground Name"
        />
      }

      {((multiplayer && user) || (!multiplayer && user) || (!multiplayer && !user)) && (
        <Menu>
          <MenuButton
            as={Button}
            w="7rem"
            h="3rem"
            fontSize="1.5rem"
            borderRadius="0.5rem"
            variant="filled"
            color="white"
            bg="magenta.100"
            leftIcon={<AddIcon w="1.2rem" h="1.2rem" />}
          >
            New
          </MenuButton>
          <MenuList
            w="12rem"
            p="0.5rem"
            bg="#1e1c28"
            borderRadius="0.7rem"
            borderColor="gray.200"
            border="1px solid"
          >
            <MenuItem
              bg="#1e1c28"
              color="#ec307f"
              fontSize="1.5rem"
              h="4rem"
              onClick={() => {
                setCurrentPlayground(undefined);
                setNodes([]);
                setEdges([]);
                setViewport({ x: 0, y: 0, zoom: 1.5 });
                router.push("/");
              }}
            >
              Single Player
            </MenuItem>
            {user && (
              <MenuItem
                bg="#1e1c28"
                color="#ec307f"
                fontSize="1.5rem"
                h="4rem"
                onClick={startMultiplayer}
              >
                Multiplayer
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      )}


      <Divider w="2px" h="4rem" bg="gray.200" />
      <NetworkSelector />
      <ConnectWalletButton />
    </Flex>
  )
}
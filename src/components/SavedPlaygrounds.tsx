/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  useDisclosure,
  Box,
  SimpleGrid,
  Flex,
  Divider,
  useToast,
} from '@chakra-ui/react'
import prisma from '@/lib/prisma'
import { useWallet } from '@solana/wallet-adapter-react'
import { useReactFlow } from 'reactflow'
import { SavedPlaygroundType } from '@/types/playground'
import { useCustomModal } from '@/context/modalContext'


type Props = {
  user: any,
  setCurrentPlayground: React.Dispatch<React.SetStateAction<any>>
}

export const SavedPlaygrounds = ({ user, setCurrentPlayground }: Props) => {
  const [playgrounds, setPlaygrounds] = useState<SavedPlaygroundType[]>([])
  const { setEdges, setViewport, setNodes } = useReactFlow()

  const { savedPg } = useCustomModal()
  const toast = useToast()
  const { publicKey } = useWallet()
  useEffect(() => {

    if (!savedPg.isOpen || !user) return

    const run = async () => {
      const res = await fetch(`/api/playground/get/${user.publicKey}`)
      const data = await res.json()
      console.log("Data", data)
      setPlaygrounds(data.playgrounds)
    }
    run()
  }, [savedPg.isOpen, user])


  const handleKeyDown = (event: any) => {
    if (event.key === "l" && event.ctrlKey) {
      console.log(publicKey)
      if (!publicKey) {
        toast({
          status: "error",
          title: "Connect wallet required",
        })
        return
      }
      event.preventDefault();
      savedPg.onOpen();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleLoad = (pg: SavedPlaygroundType) => {
    setCurrentPlayground(pg)
    const parsed = JSON.parse(pg.data)
    setNodes(parsed.nodes || [])
    setEdges(parsed.edges || [])
    setViewport(parsed.viewport || [])
    savedPg.onClose()
  }
  return (
    <>
      <Modal size="10xl" isOpen={savedPg.isOpen} onClose={savedPg.onClose}>
        <ModalOverlay />
        {user && <ModalContent p="1rem 2rem" minH="60vh" bg="#5458792E" style={{ backdropFilter: 'blur(10px)' }} color="white" w="70vw" borderRadius="2rem">
          <ModalHeader mb="1rem" fontSize="2rem" color="magenta.100" borderBottom="1px solid" borderColor="gray.200">My Playgrounds</ModalHeader>
          <ModalCloseButton />
          {playgrounds.length ? (
            <Flex gap="2rem">
              {playgrounds.map((playground) => (
                <Flex
                  transition="100ms"
                  _active={{ transform: 'scale(0.9)' }}
                  _hover={{ filter: "brightness(130%)" }}
                  onClick={() => handleLoad(playground)}
                  w="30%"
                  h="20rem"
                  key={playground.createdAt}
                  borderWidth="1px"
                  borderRadius="1rem"
                  flexFlow="column"
                  align="center"
                  justify="start"
                  overflow="hidden">
                  <Box w="100%" h="15rem" overflow="hidden">
                    <img
                      src={playground.preview_url}
                      alt="Playground preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </Box>

                  <Divider />
                  <Flex

                    p="0rem 1rem"
                    flexFlow="column"
                    justify="center" align="start" w="100%" h="5rem">
                    <Text fontSize="2rem" color="blue.100" fontWeight="500">{playground.name}</Text>
                    <Text fontSize="1.1rem" color="blue.300" fontWeight="200">Created at: {new Date(Date.parse(playground.createdAt)).toLocaleString()}</Text>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          ) : (
            <Text fontSize="xl" p={4}>No playgrounds found.</Text>
          )}
        </ModalContent>}
      </Modal>

    </>
  )
}

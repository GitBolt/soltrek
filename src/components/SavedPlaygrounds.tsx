import { useEffect, useState } from 'react'
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
} from '@chakra-ui/react'
import prisma from '@/lib/prisma'
import { useWallet } from '@solana/wallet-adapter-react'
import { useReactFlow } from 'reactflow'
import { SavedPlaygroundType } from '@/types/playground'


type Props = {
  isOpen: boolean,
  onClose: () => void,
  user: any,
}

export const SavedPlaygrounds = ({ isOpen, onClose, user }: Props) => {
  const [playgrounds, setPlaygrounds] = useState<SavedPlaygroundType[]>([])
  const { setEdges, setViewport, setNodes } = useReactFlow()

  useEffect(() => {

    if (!isOpen) return

    const run = async () => {
      const res = await fetch(`/api/playground/get/${user.publicKey}`)
      const data = await res.json()
      console.log("Data", data)
      setPlaygrounds(data.playgrounds)
    }
    run()
  }, [isOpen, user])

  const handleLoad = (data: string) => {
    console.log(data)
    const parsed = JSON.parse(data)
    setNodes(parsed.nodes || [])
    setEdges(parsed.edges || [])
    setViewport(parsed.viewport || [])
    onClose()
  }
  return (
    <>
      <Modal size="10xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p="1rem 2rem" minH="60vh" bg="bg.300" color="white" w="70vw">
          <ModalHeader fontSize="2xl" textAlign="center">My Playgrounds</ModalHeader>
          <ModalCloseButton />
          {playgrounds.length ? (
            <Flex gap="2rem">
              {playgrounds.map((playground) => (
                <Flex onClick={() => handleLoad(playground.data)} w="30%" h="20rem" bg="bg.400" key={playground.createdAt} borderWidth="1px" borderRadius="1rem" flexFlow="column" align="center" justify="start" overflow="hidden">
                  <Box w="100%" h="16rem" overflow="hidden">
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
                  <Flex justify="space-around" align="center" w="100%" h="4rem">
                    <Text fontSize="xl" fontWeight="bold">{playground.name}</Text>
                    <Text fontSize="xl" fontWeight="bold">{new Date(Date.parse(playground.createdAt)).toLocaleString()}</Text>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          ) : (
            <Text fontSize="xl" p={4}>No playgrounds found.</Text>
          )}
        </ModalContent>
      </Modal>

    </>
  )
}

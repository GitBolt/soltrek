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
} from '@chakra-ui/react'
import prisma from '@/lib/prisma'
import { useWallet } from '@solana/wallet-adapter-react'
import { useReactFlow } from 'reactflow'


type Props = {
  isOpen: boolean,
  onClose: () => void,
  user: any,
}

export const SavedPlaygrounds = ({ isOpen, onClose, user }: Props) => {
  const [playgrounds, setPlaygrounds] = useState([])
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
  }
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>   My Playgrounds
          </ModalHeader>
          <ModalCloseButton />
          {playgrounds.length ? (
            <VStack spacing={4}>
              {playgrounds.map((playground: any) => (
                <Box key={playground.id}>
                  <Text key={playground.id}>{playground.name}</Text>
                  <Button onClick={() => handleLoad(playground.data)}>Load</Button>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text>No playgrounds found.</Text>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

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
      <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white" w="70vw">
          <ModalHeader fontSize="2xl" textAlign="center">My Playgrounds</ModalHeader>
          <ModalCloseButton />
          {playgrounds.length ? (
            <SimpleGrid columns={[10]} spacing={4} p={4}>
              {playgrounds.map((playground: any) => (
                <Box key={playground.id} borderWidth="1px" borderRadius="md" p={2}>
                  <Text fontSize="xl" fontWeight="bold">{playground.name}</Text>
                  <Button size="sm" onClick={() => handleLoad(playground.data)}>Load</Button>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Text fontSize="xl" p={4}>No playgrounds found.</Text>
          )}
        </ModalContent>
      </Modal>

    </>
  )
}

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Text,
  Box,
  Flex,
  Divider,
} from '@chakra-ui/react'
import { useReactFlow } from 'reactflow'
import { SavedPlaygroundType } from '@/types/playground'
import { useCustomModal } from '@/context/modalContext'
import { useRouter } from 'next/router'

type Props = {
  user: any,
  setCurrentPlayground: React.Dispatch<React.SetStateAction<any>>
}

export const SavedPlaygrounds = ({ user, setCurrentPlayground }: Props) => {
  const [playgrounds, setPlaygrounds] = useState<SavedPlaygroundType[]>([])
  const { setEdges, setViewport, setNodes } = useReactFlow()
  const router = useRouter()
  const { savedPg } = useCustomModal()

  useEffect(() => {

    if (!savedPg.isOpen || !user) return

    const run = async () => {
      const res = await fetch(`/api/playground/get/${user.publicKey}`)
      const data = await res.json()
      setPlaygrounds(data.playgrounds || [])
    }
    run()
  }, [savedPg.isOpen, user])


  const handleLoad = (pg: SavedPlaygroundType) => {
    if (pg.multiplayer) {
      router.push(`/playground/${pg.id}`)
      savedPg.onClose()
    } else {
      const parsed = JSON.parse(pg.data)
      setCurrentPlayground(pg)
      setNodes(parsed.nodes || [])
      setEdges(parsed.edges || [])
      setViewport(parsed.viewport || [])
      router.push(`/`)
      savedPg.onClose()
    }
  }
  
  return (
    <>
      <Modal size="10xl" isOpen={savedPg.isOpen} onClose={savedPg.onClose}>
        <ModalOverlay />
        {user && <ModalContent p="1rem 2rem" minH="60vh" bg="#5458792E" style={{ backdropFilter: 'blur(10px)' }} color="white" w="98rem" borderRadius="2rem">
          <ModalHeader mb="1rem" fontSize="2rem" color="magenta.100" borderBottom="1px solid" borderColor="gray.200">My Playgrounds</ModalHeader>
          <ModalCloseButton size="lg" />
          {playgrounds.length ? (
            <Flex gap="2rem" flexWrap="wrap" overflow="auto" w="100%">
              {playgrounds.map((playground) => (
                <Flex
                  transition="100ms"
                  _active={{ transform: 'scale(0.9)' }}
                  _hover={{ filter: "brightness(130%)" }}
                  onClick={() => handleLoad(playground)}
                  w="30rem"
                  h="20rem"
                  key={playground.createdAt}
                  borderWidth="1px"
                  borderRadius="1rem"
                  flexFlow="column"
                  borderColor={playground.multiplayer ? "#621E47" : "gray.100"}
                  align="center"
                  justify="start"
                  overflow="hidden">
                  <Box w="100%" h="14rem" overflow="hidden">
                    <PreviewImage
                      src={playground.preview_url}
                    />
                  </Box>

                  <Divider />
                  <Flex
                    p="0rem 1rem"
                    flexFlow="column"
                    justify="center"
                    align="start"
                    w="100%"
                    h="5rem">
                    <Text fontSize="1.6rem" color="blue.100" fontWeight="500" textOverflow="ellipsis">{playground.name}</Text>
                    <Flex justifyContent="space-between" w="100%">
                      <Text fontSize="1.2rem" color="blue.300" fontWeight="200">Created at {new Date(Date.parse(playground.createdAt)).toLocaleString()}</Text>
                      {playground.multiplayer && <Text fontSize="1.2rem" color="magenta.100" fontWeight="500">Multiplayer</Text>}
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          ) : (
            <Text fontSize="2rem" color="blue.300" p={4}>No playgrounds found.</Text>
          )}
        </ModalContent>}
      </Modal>

    </>
  )
}

const PlaceholderImage = () => (
  <img
    src="/assets/placeholder.png"
    alt="Loading..."
    width="100%"
    height="100%"
    style={{ objectFit: 'cover' }}
  />
);

const PreviewImage = ({ src }: { src: string }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <PlaceholderImage />}
      <img
        src={src}
        alt="Preview image"
        style={{ height: "100%", width: "100%", objectFit: "cover", display: loaded ? 'block' : 'none' }}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
};
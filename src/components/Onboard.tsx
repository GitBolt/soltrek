/* eslint-disable @next/next/no-img-element */
import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Button,
  Flex,
  Divider,
  useDisclosure,
  Text,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react'


export const Onboard = () => {
  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p="1rem 2rem" minH="30vh" bg="#5458792E" style={{ backdropFilter: 'blur(10px)' }} color="white" borderRadius="2rem">

          <ModalHeader fontSize="2.5rem" color="magenta.100" >
            Welcome to SOLTrek
          </ModalHeader>

          <Flex flexFlow="column" gap="1rem" justify="center" align="center">

            <Divider mt="1rem" />
            <Text fontSize="1.8rem" color="blue.200">
              Here are some important points and instructions:
            </Text>
            <UnorderedList fontSize="1.8rem" color="gray.400" textAlign="left" spacing="1.3rem">
              <ListItem>
                On the left side, you have your node panel. Click on a category to open the respective nodes and add them. Drag to move around.
              </ListItem>

              <ListItem>
                Use CTRL + K for an easy-to-use command palette and search feature
              </ListItem>

              <ListItem>
                Connect wallet is not required, but it&apos;s recommended to enable saving, loading, and sharing of your playgrounds.
              </ListItem>

              <ListItem>
                Nodes are the functional blocks, edges are the magenta lines connecting nodes, and handles are the input/output points of nodes.
              </ListItem>

              <ListItem>
                A keypair setup is ready for you. Get started by connecting the button&apos;s handle to the &apos;generate&apos; handle of the Mnemonic. Then, connect the private and public keys to their respective output nodes. Finally, click the button to initiate your first flow!
              </ListItem>
            </UnorderedList>

            <Button onClick={onClose} variant="filled" w="60%" my="2rem">Get started!</Button>
          </Flex>
        </ModalContent>
      </Modal>

    </>
  )
}

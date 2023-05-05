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
  Input,
} from '@chakra-ui/react'
import { useReactFlow } from 'reactflow'
import { SavedPlaygroundType } from '@/types/playground'
import { useCustomModal } from '@/context/modalContext'

type Props = {
  user: any,
  playgroundId: number,
}

export const AddAccess = ({ user, playgroundId }: Props) => {
  const [value, setValue] = useState('')
  const { accessModal } = useCustomModal()
  const toast = useToast()

  const giveAccess = async () => {

    const res = await fetch(`/api/playground/update_access`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ new_wallet: value, playgroundId })
    })
    if (res.ok){
      toast({
        status:"success",
        title:"Gave edit access"
      })
    } else {
      toast({
        status:"error",
        title:"Error giving edit access"
      })
    }
    console.log(res)
  }

  return (
    <>
      <Modal size="lg" isOpen={accessModal.isOpen} onClose={accessModal.onClose}>
        <ModalOverlay />
        <ModalContent p="1rem 2rem" minH="60vh" bg="#5458792E" style={{ backdropFilter: 'blur(10px)' }} color="white" w="98rem" borderRadius="2rem">
          <ModalHeader mb="1rem" fontSize="2rem" color="magenta.100" borderBottom="1px solid" borderColor="gray.200">Give Edit Access</ModalHeader>
          <Flex flexFlow="column" gap="1rem" justify="center" align="center">

            <Input
              pos="static"
              placeholder="Enter public key "
              w="90%"
              mb="1rem"
              h="4rem"
              fontSize="1.8rem"

              onChange={(e) => setValue(e.target.value)} />
            <Button w="90%" variant="filled" onClick={giveAccess}>Give access</Button>
            <Divider mt="2rem" />
            <Text textAlign="start" fontSize="2rem" color="blue.400" fontWeight="600" alignSelf="start">Access Given</Text>
            <Text color="white" opacity="60%" fontSize="2.4rem" alignSelf="start" fontWeight="700">Coming soon</Text>
          </Flex>
        </ModalContent>
      </Modal>

    </>
  )
}


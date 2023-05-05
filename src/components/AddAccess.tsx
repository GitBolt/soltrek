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
import { SavedPlaygroundType } from '@/types/playground'
import { useCustomModal } from '@/context/modalContext'
import { truncatedPublicKey } from '@/util/helper'

type Props = {
  playground: SavedPlaygroundType,
  setCurrentPlayground: React.Dispatch<React.SetStateAction<any>>,
}

export const AddAccess = ({ playground, setCurrentPlayground}: Props) => {
  const [value, setValue] = useState('')
  const { accessModal } = useCustomModal()
  const toast = useToast()

  const giveAccess = async () => {

    const res = await fetch(`/api/playground/update_access`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ new_wallet: value, playgroundId: playground.id })
    })
    if (res.ok) {
      toast({
        status: "success",
        title: "Gave edit access"
      })

      const res = await fetch(`/api/playground/get/id/${playground.id}`)
      const data = await res.json()
      setCurrentPlayground(data)

    } else {
      toast({
        status: "error",
        title: "Error giving edit access"
      })
    }
    console.log(res)
  }

  return (
    <>
      <Modal size="lg" isOpen={accessModal.isOpen} onClose={accessModal.onClose}>
        <ModalOverlay />
        <ModalContent p="1rem 2rem" minH="50vh" bg="#5458792E" style={{ backdropFilter: 'blur(10px)' }} color="white" borderRadius="2rem">
          <ModalHeader mb="1rem" fontSize="2rem" color="magenta.100" >Give Edit Access</ModalHeader>
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

            {playground && playground.edit_access.length ? playground.edit_access.map((item) => (
              <Text key={item} color="white" opacity="80%" fontSize="1.5rem" alignSelf="start" fontWeight="400">{truncatedPublicKey(item, 13)}</Text>
            )) : null}
          </Flex>
        </ModalContent>
      </Modal>

    </>
  )
}


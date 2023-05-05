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

  const giveAccess = async () => {

    const res = await fetch(`/api/playground/update_access`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ new_access: value, playgroundId })
    })

    console.log(res)
  }

  return (
    <>
      <Modal size="10xl" isOpen={accessModal.isOpen} onClose={accessModal.onClose}>
        <ModalOverlay />
        <ModalContent p="1rem 2rem" minH="60vh" bg="#5458792E" style={{ backdropFilter: 'blur(10px)' }} color="white" w="98rem" borderRadius="2rem">
          <ModalHeader mb="1rem" fontSize="2rem" color="magenta.100" borderBottom="1px solid" borderColor="gray.200">Give Edit Access</ModalHeader>
          <Input onChange={(e) => setValue(e.target.value)} />
          <Button onClick={giveAccess}>Give access</Button>
        </ModalContent>
      </Modal>

    </>
  )
}


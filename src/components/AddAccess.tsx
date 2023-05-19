/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Button,
  Text,
  Flex,
  Divider,
  useToast,
  Input,
  useClipboard,
} from '@chakra-ui/react'
import { SavedPlaygroundType } from '@/types/playground'
import { useCustomModal } from '@/context/modalContext'
import { truncatedPublicKey } from '@/util/helper'
import { CheckIcon, CopyIcon } from '@chakra-ui/icons'

type Props = {
  playground: SavedPlaygroundType,
  setCurrentPlayground: React.Dispatch<React.SetStateAction<any>>,
}

export const AddAccess = ({ playground, setCurrentPlayground }: Props) => {
  const [value, setValue] = useState('')
  const { accessModal } = useCustomModal()
  const toast = useToast()
  const { onCopy, hasCopied } = useClipboard(playground ? `${process.env.NEXT_PUBLIC_URL}/playground/${playground.id}` : '')

  const giveAccess = async () => {
    if (!value || value.length < 30) {
      toast({
        status: "error",
        title: "Enter Valid Public Key"
      })
      return
    }
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

            <Flex justify="space-between" w="90%">
              <Button w="50%" variant="filled" onClick={giveAccess} h="3rem" fontSize="1.4rem">Add Editor</Button>
              <Button w="40%" variant="magenta" onClick={onCopy} rightIcon={hasCopied ? <CheckIcon /> : <CopyIcon />} fontSize="1.4rem" h="3rem">Public Link</Button>
            </Flex>


            <Divider mt="2rem" />
            <Text textAlign="start" fontSize="2rem" color="blue.400" fontWeight="600" alignSelf="start">Editors</Text>

            {playground && playground.edit_access && playground.edit_access.length ? playground.edit_access.map((item) => (
              <Text key={item} color="white" opacity="80%" fontSize="1.5rem" alignSelf="start" fontWeight="400">{truncatedPublicKey(item, 13)}</Text>
            )) : null}
          </Flex>
        </ModalContent>
      </Modal>

    </>
  )
}


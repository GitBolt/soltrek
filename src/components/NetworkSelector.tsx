/* eslint-disable @next/next/no-img-element */
// Components
import React from 'react';

// Layouts
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  Modal,
  ModalHeader,
  Input,
  ModalOverlay,
  ModalContent,
  Divider,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';

// Icons
import { ChevronDownIcon } from '@chakra-ui/icons';

// Util
import { getNetworkName } from '@/util/helper';
import { useNetworkContext } from '@/context/configContext'


export const NetworkSelector = () => {
  const { selectedNetwork, updateNetwork } = useNetworkContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (

    <>

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent
          minH="50vh"
          maxW="20vw"
          bg=" linear-gradient(243.86deg, rgba(38, 42, 55, 0.33) 0%, rgba(36, 55, 78, 0) 100.97%);"
          border="0.5px solid rgba(82, 82, 111, 0.3)"
          style={{ backdropFilter: 'blur(15px)' }}
          p="0 3rem"
          boxShadow="0px 0px 40px #0003"
          borderRadius="1rem"
        >
          <ModalHeader fontSize="2rem" color="magenta.100">Enter Custom RPC Endpoint</ModalHeader>
          <Divider my="2rem" />

          <Input
            placeholder="Search for nodes"
            w="100%"
            mb="3rem"
            h="4rem"
            fontSize="1.8rem"
            onChange={(e) => updateNetwork(e.target.value)} />

          <Button variant="filled" onClick={onClose} alignSelf="center" w="50%">Done</Button>
        </ModalContent>
      </Modal>

      <Menu>
        <MenuButton
          className="buttons"
          as={Button}
          w="13.5rem"
          borderRadius="0.5rem"
          h='3rem'
          variant="filled"
          fontSize="1.3rem"
          color="white"
          bg="blue.gradient"
          leftIcon={<Box borderRadius="50%" h="1rem" w="1rem" bg="lime" />}
          rightIcon={
            <ChevronDownIcon color="white" w="1.5rem" h="1.5rem" />
          }
        >
          {getNetworkName(selectedNetwork || "")}
        </MenuButton>

        <MenuList
          w="10rem"
          p="0.5rem"
          bg="linear-gradient(243.86deg, rgba(38, 42, 55, 0.5) 0%, rgba(36, 55, 78, 0) 100.97%)"
          borderRadius="1rem"
          borderColor="gray.200"
          border="1px solid"
        >
          <MenuItem
            style={{ backdropFilter: "blur(10px)" }}
            h="4rem"
            fontSize="1.5rem"
            color="gray.400"
            _hover={{ background: "linear-gradient(243.86deg, rgba(38, 42, 55, 0.8) 10%,rgba(38, 42, 55, 0.4) 100%)" }}
            bg="linear-gradient(243.86deg, rgba(38, 42, 55, 0.5) 0%, rgba(36, 55, 78, 0) 100.97%)"
            onClick={async () => {
              updateNetwork("https://api.mainnet-beta.solana.com")
            }}
          >
            Mainnet-beta
          </MenuItem>

          <MenuItem
            style={{ backdropFilter: "blur(10px)" }}
            h="4rem"
            fontSize="1.5rem"
            color="gray.400"
            _hover={{ background: "linear-gradient(243.86deg, rgba(38, 42, 55, 0.8) 10%,rgba(38, 42, 55, 0.4) 100%)" }}
            bg="linear-gradient(243.86deg, rgba(38, 42, 55, 0.5) 0%, rgba(36, 55, 78, 0) 100.97%)"
            onClick={async () => {
              updateNetwork(process.env.NEXT_PUBLIC_DEFAULT_RPC || "https://api.devnet.solana.com")
            }}
          >
            Devnet
          </MenuItem>

          <MenuItem
            style={{ backdropFilter: "blur(10px)" }}
            h="4rem"
            fontSize="1.5rem"
            color="gray.400"
            _hover={{ background: "linear-gradient(243.86deg, rgba(38, 42, 55, 0.8) 10%,rgba(38, 42, 55, 0.4) 100%)" }}
            bg="linear-gradient(243.86deg, rgba(38, 42, 55, 0.5) 0%, rgba(36, 55, 78, 0) 100.97%)"
            onClick={async () => {
              updateNetwork(process.env.NEXT_PUBLIC_TEST_RPC || "https://api.testnet.solana.com")
            }}
          >
            Testnet
          </MenuItem>

          <MenuItem
            style={{ backdropFilter: "blur(10px)" }}
            h="4rem"
            fontSize="1.5rem"
            color="gray.400"
            _hover={{ background: "linear-gradient(243.86deg, rgba(38, 42, 55, 0.8) 10%,rgba(38, 42, 55, 0.4) 100%)" }}
            bg="linear-gradient(243.86deg, rgba(38, 42, 55, 0.5) 0%, rgba(36, 55, 78, 0) 100.97%)"
            onClick={async () => {
              updateNetwork("http://127.0.0.1:8899")
            }}
          >
            Localnet
          </MenuItem>

          <MenuItem
            style={{ backdropFilter: "blur(10px)" }}
            h="4rem"
            fontSize="1.5rem"
            color="gray.400"
            _hover={{ background: "linear-gradient(243.86deg, rgba(38, 42, 55, 0.8) 10%,rgba(38, 42, 55, 0.4) 100%)" }}
            bg="linear-gradient(243.86deg, rgba(38, 42, 55, 0.5) 0%, rgba(36, 55, 78, 0) 100.97%)"
            onClick={onOpen}
          >
            Custom RPC
          </MenuItem>

        </MenuList>

      </Menu>
    </>
  );
};

/* eslint-disable @next/next/no-img-element */
// Components
import React, { useState } from 'react';
// Layouts
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Text,
  Button,
  Box,
  Input,
} from '@chakra-ui/react';

// Icons
import { ChevronDownIcon } from '@chakra-ui/icons';

// Util
import { getNetworkName } from '@/util/helper';
import { useNetworkContext } from '@/context/configContext'


export const NetworkSelector = () => {
  const { selectedNetwork, updateNetwork } = useNetworkContext()

  return (
    <Menu>
      <MenuButton
        as={Button}
        w="16rem"
        borderRadius="0.5rem"
        h='3.6rem'
        variant="filled"
        fontSize="1.4rem"
        color="white"
        bg="blue.gradient"
        leftIcon={<Box borderRadius="50%" h="1.2rem" w="1.2rem" mr="0.5rem" bg="lime" />}
        rightIcon={
          <ChevronDownIcon color="white" w="2rem" h="2rem" />
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
            updateNetwork(process.env.NEXT_PUBLIC_DEFAULT_RPC || "")
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
            updateNetwork("http://127.0.0.1:8899")
          }}
        >
          Localnet
        </MenuItem>

      </MenuList>

    </Menu>
  );
};

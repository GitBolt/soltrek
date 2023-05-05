/* eslint-disable @next/next/no-img-element */
// Components
import React from 'react';
import toast from 'react-hot-toast';
import {
  useWallet,
  Wallet as SolanaWallet,
} from '@solana/wallet-adapter-react';

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
} from '@chakra-ui/react';

// Icons
import { ChevronDownIcon } from '@chakra-ui/icons';

// Util
import { truncatedPublicKey } from '@/util/helper';


export const ConnectWalletButton = () => {
  const { wallets, select, connected, publicKey, wallet, connect } = useWallet();

  const copyPublicKey = () => {
    navigator.clipboard.writeText(publicKey?.toBase58() || '');
    toast.success('Copied address');
  };

  const onConnectWallet = async (wallet: SolanaWallet) => {
    try {
      console.log('Connection event', wallet.readyState);
      select(wallet.adapter.name);
      await connect();
    } catch (e) {
      console.log("Wallet Error: ", e);
      toast.error('Wallet not found');
    }
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        w="17rem"
        borderRadius="0.5rem"
        mr="2rem"
        h="3.6rem"
        variant="filled"
        color="white"
        bg="blue.gradient"
        rightIcon={
          connected && wallet ? (
            <Box h="2.5rem" w="2.5rem" mr="1rem">
              <img
                src={wallet.adapter.icon}
                alt={`${wallet.adapter.name} Icon`}
              />
            </Box>
          ) : <ChevronDownIcon color="white" w="2.5rem" h="2.5rem" />
        }
      >
        {!connected && <Text fontSize="1.55rem">Connect Wallet</Text>}
        {connected && wallet !== null && (
          <Text fontSize="1.55rem">
            {truncatedPublicKey(publicKey!.toString(), 4)}
          </Text>
        )}
      </MenuButton>

      {connected && (
        <MenuList
          w="17rem"
          p="0.5rem"
          bg="linear-gradient(243.86deg, rgba(38, 42, 55, 0.5) 0%, rgba(36, 55, 78, 0) 100.97%)"
          borderRadius="1rem"
          borderColor="gray.200"
          border="1px solid"
        >
          <MenuItem
            style={{ backdropFilter: "blur(10px)" }}
            h="4rem"
            _hover={{ background: "linear-gradient(243.86deg, rgba(38, 42, 55, 0.8) 10%,rgba(38, 42, 55, 0.4) 100%)" }}
            bg="linear-gradient(243.86deg, rgba(38, 42, 55, 0.5) 0%, rgba(36, 55, 78, 0) 100.97%)"
            onClick={copyPublicKey}>
            <Text color="blue.200" fontSize="1.5rem">Copy Address</Text>
          </MenuItem>
          <MenuItem
            style={{ backdropFilter: "blur(10px)" }}
            h="4rem"
            _hover={{ background: "linear-gradient(243.86deg, rgba(38, 42, 55, 0.8) 10%,rgba(38, 42, 55, 0.4) 100%)" }}
            bg="linear-gradient(243.86deg, rgba(38, 42, 55, 0.5) 0%, rgba(36, 55, 78, 0) 100.97%)"
            onClick={async () => {
              if (wallet == null) {
                return;
              }
              await wallet.adapter.disconnect();
            }}
          >
            <Text fontSize="1.5rem" color="blue.200">
              Disconnect
            </Text>
          </MenuItem>
        </MenuList>
      )}


      {!connected && (
        <MenuList
          w="17rem"
          p="0.5rem"
          bg="linear-gradient(243.86deg, rgba(38, 42, 55, 0.5) 0%, rgba(36, 55, 78, 0) 100.97%)"
          borderRadius="1rem"
          borderColor="gray.200"
          border="1px solid"
        >
          {wallets.map((wallet: SolanaWallet, index) => {
            return (
              <MenuItem
                key={index}
                style={{ backdropFilter: "blur(10px)" }}
                h="5rem"
                _hover={{ background: "linear-gradient(243.86deg, rgba(38, 42, 55, 0.8) 10%,rgba(38, 42, 55, 0.4) 100%)" }}
                bg="linear-gradient(243.86deg, rgba(38, 42, 55, 0.5) 0%, rgba(36, 55, 78, 0) 100.97%)"
                onClick={async () => {
                  try {
                    onConnectWallet(wallet)
                  } catch (e: any) {
                    toast.error('Wallet not found');
                  }
                }}
              >
                <Flex gap="1rem">
                  <Box w="2.5rem" h="2.5rem">
                    <img
                      width={100}
                      src={
                        wallet.adapter.icon
                      }
                      alt={`${wallet.adapter.name} Icon`}
                    />
                  </Box>
                  <Text
                    fontSize="1.4rem"
                    ml={2}
                    fontWeight={600}
                    color="gray.500"
                  >
                    {wallet.adapter.name}
                  </Text>
                </Flex>
              </MenuItem>
            );
          })}
        </MenuList>
      )}
    </Menu>
  );
};

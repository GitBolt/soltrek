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

      console.log(connected);
    } catch (e) {
      console.log(e);
      toast.error('Wallet not found');
    }
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        w="18rem"
        h={connected ? '3.8rem' : '3.2rem'}
        variant="filled"
        color="white"
        rightIcon={
          connected && wallet ? (
            <Box h="2.5rem" w="2.5rem">
              <img
                src={wallet.adapter.icon}
                alt={`${wallet.adapter.name} Icon`}
              />
            </Box>
          ) : <ChevronDownIcon color="white" w="2rem" h="2rem" />
        }
      >
        {!connected && <Text fontSize="1.5rem">Connect Wallet</Text>}
        {connected && wallet !== null && (
          <Text fontSize="1.4rem">
            {truncatedPublicKey(publicKey!.toString(), 7)}
          </Text>
        )}
      </MenuButton>
      {connected && (
        <MenuList
          w="20rem"
          p="0.5rem"
          bg="bg.300"
          borderRadius="1rem"
          border='none'
        >
          <MenuItem bg="transparent" onClick={copyPublicKey} fontSize="1.4rem">
            <Text color="blue.200">Copy address</Text>
          </MenuItem>
          <MenuItem
            bg="transparent"
            onClick={async () => {
              if (wallet == null) {
                return;
              }
              await wallet.adapter.disconnect();
            }}
          >
            <Text fontSize="1.4rem" color="blue.200">
              Disconnect
            </Text>
          </MenuItem>
        </MenuList>
      )}
      {!connected && (
        <MenuList
          w="20rem"
          p="0.5rem"
          bg="bg.300"
          borderRadius="1rem"
          border='none'
        >
          {wallets.map((wallet: SolanaWallet, index) => {
            return (
              <MenuItem
                key={index}

                h="4rem"
                bg="bg.300"
                borderBottom="1px solid"
                borderColor="gray.200"
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

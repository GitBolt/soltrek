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
        rightIcon={<ChevronDownIcon color="gray.300" w="1.7rem" h="1.7rem" />}
        w={connected ? '26.5rem' : '18rem'}
        h={connected ? '100%' : '3.2rem'}
        bg={connected ? 'white' : 'bg.100'}
        variant={!connected ? 'primary' : 'solid'}
        leftIcon={
          wallet ? (
            <Box h="2.5rem" w="2.5rem">
              <img
                src={wallet.adapter.icon}
                alt={`${wallet.adapter.name} Icon`}
              />
            </Box>
          ) : null
        }
      >
        {!connected && <Text fontSize="1.4rem">Connect Wallet</Text>}
        {connected && wallet !== null && (
          <Text fontSize="1.4rem" color="gray.600">
            {truncatedPublicKey(publicKey!.toString(), 7)}
          </Text>
        )}
      </MenuButton>
      {connected && (
        <MenuList w="26.5rem">
          <MenuItem onClick={copyPublicKey} fontSize="1.4rem">
            <Text color="gray.600">Copy address</Text>
          </MenuItem>
          <MenuItem
            onClick={async () => {
              if (wallet == null) {
                return;
              }
              await wallet.adapter.disconnect();
            }}
          >
            <Text fontSize="1.4rem" color="gray.600">
              Disconnect
            </Text>
          </MenuItem>
        </MenuList>
      )}
      {!connected && (
        <MenuList
          boxShadow="0px 4px 14px rgba(192, 204, 206, 0.25)"
          w="20rem"
        >
          <Text
            transform="translate(0, -0.5rem)"
            display="flex"
            alignItems="center"
            justifyContent="start"
            color="gray.300"
            fontWeight={600}
            fontSize="1rem"
            bg="gray.50"
            h="2.5rem"
            padding="0 1rem"
          >
            CONNECT WALLET
          </Text>
          {wallets.map((wallet: SolanaWallet, index) => {
            return (
              <MenuItem
                key={index}
                h="4rem"
                borderBottom="1px solid #F7FAFC"
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

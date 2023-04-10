import { Box, Text, Flex, Image } from '@chakra-ui/react';
import {
  useWallet,
  Wallet as SolanaWallet,
} from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';


export const ConnectWalletButton = () => {

  const { wallets, select, connected, connect } = useWallet();

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
    <>

      <Flex
        flexFlow="column"
        align="start"
        justify="center"
        w="100%"
        gap="1rem"
      >
        {wallets.map((wallet: SolanaWallet, index) => {
          return (
            <>
              <Flex
                key={index}
                h="2.5rem"
                align="center"
                w="100%"
                bg="gray.50"
                borderRadius="1rem"
                cursor="pointer"
                _hover={{
                  bg: 'gray.100',
                }}
                padding="0 1.5rem"
                onClick={onConnectWallet.bind(null, wallet)}
              >
                <Flex gap="1rem" align="center">
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    w="2rem"
                    h="2rem"
                  >
                    <Image
                      width="70%"
                      height="70%"
                      src={wallet.adapter.icon || ''}
                      alt={`${wallet.adapter.name} Icon`}
                    />
                  </Box>
                  <Text
                    fontSize="1.1rem"
                    ml={2}
                    fontWeight={600}
                    color="gray.500"
                  >
                    {wallet.adapter.name || ''}
                  </Text>
                </Flex>
              </Flex>
            </>
          );
        })}
      </Flex>
    </>
  );
};
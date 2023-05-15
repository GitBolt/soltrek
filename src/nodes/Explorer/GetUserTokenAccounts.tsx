import React, { useState, useEffect, FC } from 'react';
import { NodeProps, useNodeId, useReactFlow, Connection as RCon } from 'reactflow';
import BaseNode from '@/layouts/BaseNode';
import { Box, Flex, Text, useClipboard } from '@chakra-ui/react';
import { CustomHandle } from '@/layouts/CustomHandle';
import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { handleValue } from '@/util/handleNodeValue';
import { Connection, GetProgramAccountsFilter, TransactionResponse } from '@solana/web3.js';
import { useNetworkContext } from '@/context/configContext';
import { stringify, truncatedPublicKey } from '@/util/helper';
import { Metaplex, PublicKey, walletAdapterIdentity } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const GetUserTokens: FC<NodeProps> = (props) => {
  const [tokens, setTokens] = useState<any[]>();
  const [error, setError] = useState<string>('');

  const { getNode, getEdges, setNodes } = useReactFlow()
  const nodeId = useNodeId()

  const currentNode = getNode(nodeId as string)
  const wallet = useWallet()

  const { selectedNetwork } = useNetworkContext()

  const id = useNodeId()


  const updateNodeData = (nodeIds: string[], data: string) => {
    setTimeout(() => {
      setNodes(nodes => nodes.map(node =>
        nodeIds.includes(node.id)
          ? { ...node, data: { ...node.data, [id as string]: data } }
          : node
      ));
    }, 100);
  };


  const onConnect = (e: RCon, data: string) => {
    if (!e.target) return
    updateNodeData([e.target], data)
  };


  useEffect(() => {

    const edges = getEdges()
    const values = handleValue(currentNode, edges, ["pubKey"])
    if (!values["pubKey"]) return

    const run = async () => {
      try {
        const connection = new Connection(selectedNetwork)
        const filters: GetProgramAccountsFilter[] = [
          {
            dataSize: 165,    //size of account (bytes)
          },
          {
            memcmp: {
              offset: 32,     //location of our query in the account (bytes)
              bytes: values["pubKey"],  //our search criteria, a base58 encoded string
            },
          }];

        const accounts = await connection.getParsedProgramAccounts(
          TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
          { filters: filters }
        );
        let finalData: any[] = []
        accounts.forEach((account, i) => {
          const parsedAccountInfo: any = account.account.data;
          const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
          const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

          finalData.push({
            mint: mintAddress,
            tokenAccount: account.pubkey.toBase58(),
            balance: tokenBalance

          })
        });
        setError('')
        setTokens(finalData)
      } catch (e: any) {
        setError(e.toString())
      }
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data])

  return (
    <BaseNode {...props} title="Fetch All Token Accounts">
      {tokens && tokens.length ?
        <>
          {tokens.map((token, index) => (
            <Flex bg="bg.100" opacity="70%" borderBottom="1px solid" mx="4rem" w="100%" key={token.mint} p="0 1rem" justify="space-between" gap="1rem" align="center">
              <Flex flexFlow="column" gap="1rem" padding="1rem 0" >
                <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap" >Mint: {truncatedPublicKey(token.mint)}</Text>
                <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap">Token Account: {truncatedPublicKey(token.tokenAccount, 5)}</Text>
                <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap">Balance: {token.balance}</Text>
                {/* <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap">Strike: {item.strike}</Text> */}
              </Flex>
              <CustomHandle
                pos="right"
                type="source"
                id={"address" + token.mint}
                style={{ top: `${5 + 8.55 * index + 2}` + "rem" }}
                label="Mint"
                onConnect={(e: any) => {
                  onConnect(e, token.mint);
                }}
              />
            </Flex>
          ))}
        </>
        :
        <Text color="blue.300" opacity="50%" fontSize="1.5rem">{error || 'Empty...'}</Text>}

      {error ?
        <Text fontSize="1.5rem" transform="translate(0, 3rem)" zIndex="3" color="blue.400" fontWeight={600}>{error.toLocaleString()}</Text> : null}

      <CustomHandle pos="left" type="target" label="Address" id="pubKey" style={{ marginTop: "0.9rem" }} />
    </BaseNode >
  );

};

export default GetUserTokens;

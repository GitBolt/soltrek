/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow, Connection as RCon } from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { Box, Divider, Flex, Spinner, Text } from "@chakra-ui/react";
import base58 from "bs58";
import { useNetworkContext } from "@/context/configContext";
import { CandyMachine } from "@/sdks/candyMachine";

const FetchNFTs: FC<NodeProps> = (props) => {
  const { getNode, getEdges, setNodes, setEdges } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);
  const { selectedNetwork } = useNetworkContext()

  const [nfts, setNFTs] = useState<any>();
  const [error, setError] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false)


  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "address",
    ]);

    if (!values["address"]) return;

    let address = values["address"]

    setLoading(true)
    setError('')
    setNFTs(undefined)
    const run = async () => {
      const res = await CandyMachine.fetchNFTs(
        selectedNetwork,
        address
      )

      console.log(res)
      if (res.error) {
        setError(res.error)
        return
      }

      setNFTs(res.res)
      console.log(res.res)
    }

    run().then(() => setLoading(false))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);


  const cleanedCode = CandyMachine.fetchNFTs.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const fetchNFTs = ${cleanedCode}`;

  return (
    <BaseNode
      code={CODE}
      {...props}
      title="Candy Machine - Fetch NFTs"

    >

      {loading && <Spinner size="lg" style={{ width: "5rem", height: "5rem" }} color="blue.100" thickness="0.5rem" />}

      {error ?
        <Text fontSize="1.5rem" transform="translate(7rem, 3rem)" mr="10rem" zIndex="3" color="blue.400" maxW="30rem" fontWeight={600}>{error.toLocaleString()}</Text> : null}

      {nfts && nfts.length ? nfts.map((nft: any) => (
        <Flex borderBottom="1px solid" borderColor="gray.200" p="1rem 0" key={nft.image} gap="1rem" mb="2rem" align="center" justify="center">
          <Box w="4rem" h="4rem" borderRadius="1rem">
            <img src={nft.image} alt="Nft Image" width="100%" height="100%" style={{ objectFit: "cover", borderRadius: "1rem" }} />
          </Box>
          <Text fontSize="2rem" color="blue.200">{nft.name}</Text>
          <Text fontSize="1.5rem" color="gray.300">{nft.symbol}</Text>
        </Flex>
      )) : <Text color="blue.400" fontSize="2rem">Nothing found</Text>}
      <CustomHandle
        pos="left"
        type="target"
        id="address"
        label="Address"
      />

    </BaseNode>
  );
};

export default FetchNFTs;



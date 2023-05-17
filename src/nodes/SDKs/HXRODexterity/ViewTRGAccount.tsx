import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow, Connection as RCon } from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { Box, Button, Divider, Flex, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import base58 from "bs58";
import { useNetworkContext } from "@/context/configContext";
import { HXRODexterity } from "@/sdks/hxroDexterity";
import { PublicKey } from "@metaplex-foundation/js";
import { stringify } from "@/util/helper";
import { DexGetAccount } from "@/types/response";

const DexViewTRG: FC<NodeProps> = (props) => {
  const { getNode, getEdges, setNodes, setEdges } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);
  const [loading, setLoading] = useState<boolean>(false)
  const { selectedNetwork } = useNetworkContext()

  const [data, setData] = useState<DexGetAccount | undefined>();
  const [error, setError] = useState<string>('');


  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "privateKey",
      "trgPubkey",
      "productName"
    ]);
    console.log(values)
    if (!values["privateKey"] || !values["trgPubkey"]) return;
    setError('')
    setData(undefined)
    setLoading(true)
    setEdges((edgs) =>
      edgs.map((ed) => {
        if (ed.source == id) {
          ed.animated = true;
          return ed;
        }
        return ed;
      })
    );

    HXRODexterity.viewTRGAccount(
      selectedNetwork,
      new Uint8Array(base58.decode(values["privateKey"])),
      new PublicKey(values["trgPubkey"]),
      values["productName"]
    ).then((res) => {
      console.log("View TRG Account Res: ", res)
      if (res?.error) {
        setError(res.error)
        return
      }

      setData(res.res)
      setLoading(false)
      console.log("SDK Res: ", res)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);


  const cleanedCode = HXRODexterity.viewTRGAccount.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const viewTRGAcount = ${cleanedCode}`;
  return (
    <BaseNode
      code={CODE}
      {...props}
      height="15rem"
      title="HXRO - View TRG"
    >

      {loading && <Spinner size="lg" style={{ width: "5rem", height: "5rem" }} color="blue.100" thickness="0.5rem" />}

      {error ?
        <Text fontSize="1.5rem" transform="translate(0, 3rem)" zIndex="3" color="blue.400" fontWeight={600}>{error.toLocaleString()}</Text> : null}

      {data && (
        <Flex direction="column" ml="8rem" mr="2rem">

          <Box fontSize="1.2rem" color="blue.200" ml="1rem" mt="1rem" fontWeight={700}>
            <Text>Net Cash: {data.netCash.toLocaleString()}</Text>
            <Text>PnL: {data.pnl.toLocaleString()}</Text>
            <Text>Total Withdrawn: {data.totalWithdrawn.toLocaleString()}</Text>
            <Text>Total Deposited: {data.totalDeposited.toLocaleString()}</Text>
          </Box>

          <Flex direction="column">
            {data.openOrders && data.openOrders.length > 0 && (
              <Box p={4} mb={4}>
                <Divider w="100%" borderColor="gray.200" my="0.5rem" />
                <Text fontWeight="bold" color="blue.100" fontSize="1.2rem" mb="1rem">
                  Open Orders
                </Text>
                <Table variant="striped">
                  <Thead color="magenta.100">
                    <Tr border="1px solid" borderColor="gray.200">
                      <Th color="magenta.200" fontSize="0.8rem">Type</Th>
                      <Th color="magenta.200" fontSize="0.8rem">Price</Th>
                      <Th color="magenta.200" fontSize="0.8rem">Product Name</Th>
                      <Th color="magenta.200" fontSize="0.8rem">Quantity</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.openOrders.map((order, index) => (
                      <Tr backgroundColor="red" key={index}>
                        <Td backgroundColor="bg.200 !important" color="blue.100" fontSize="0.9rem">{order.type}</Td>
                        <Td backgroundColor="bg.200 !important" color="blue.100" fontSize="0.9rem">{order.price}</Td>
                        <Td backgroundColor="bg.200 !important" color="blue.100" fontSize="0.9rem">{order.productName}</Td>
                        <Td backgroundColor="bg.200 !important" color="blue.100" fontSize="0.9rem">{order.quantity}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}


          </Flex>
        </Flex>
      )}


      <CustomHandle
        pos="left"
        type="target"
        id="trgPubkey"
        label="TRG Address"
        style={{ marginTop: "-3rem" }}

      />

      <CustomHandle
        pos="left"
        type="target"
        id="privateKey"
        label="Private Key"
        style={{ marginTop: "1rem" }}

      />

      <CustomHandle
        pos="left"
        type="target"
        optional
        id="productName"
        label="Product Name"
        style={{ marginTop: "5rem" }}

      />
    </BaseNode >
  );
};

export default DexViewTRG;

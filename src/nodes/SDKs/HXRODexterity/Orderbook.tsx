import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow, Connection as RCon } from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { HXRO } from "@/sdks/hxro";
import { Box, Button, Divider, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { SDKResponse } from "@/types/response";
import base58 from "bs58";
import { useNetworkContext } from "@/context/configContext";
import { HXRODexterity, calculateCumulative, getTopOrders } from "@/sdks/hxroDexterity";
import { PublicKey } from "@metaplex-foundation/js";
import { HXROTypes } from "@/types/protocols";

const DexOrderbook: FC<NodeProps> = (props) => {
  const { getNode, getEdges } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);

  const { selectedNetwork } = useNetworkContext()

  const [n, setN] = useState<number>(0)
  const [asks, setAsks] = useState<HXROTypes.Cumilitive[]>()
  const [bids, setBids] = useState<HXROTypes.Cumilitive[]>()
  const [markPrice, setMarkPrice] = useState<string>()


  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "privateKey",
      "mpgPubKey",
      "productName"
    ]);

    if (!values["privateKey"] || !values["mpgPubKey"] || !values["productName"]) return;

    const onBookUpdate = (data: any) => {
      setN(n + 1)

      if (!data.asks.length || !data.bids.length) {
        console.log(`Missing ${!data.bids.length && data.asks.length > 0
          ? 'BIDS'
          : data.asks.length && data.bids.length > 0
            ? 'ASKS'
            : 'BIDS & ASKS'
          }`);
        return;
      }

      const cumulativeBids = calculateCumulative(data.bids);
      const cumulativeAsks = calculateCumulative(data.asks);

      const bidsHere = getTopOrders(cumulativeBids, 10, 'desc');
      const asksHere = getTopOrders(cumulativeAsks, 10, 'asc');

      const markPrice = (bidsHere[0].price + asksHere[0].price) / 2

      setBids(bidsHere)
      setAsks(asksHere)
      setMarkPrice(markPrice.toFixed(2))

      console.log(asks)
      console.log(bids)

    }

    HXRODexterity.getOrderbook(
      selectedNetwork,
      values["mpgPubKey"],
      values["productName"],
      new Uint8Array(base58.decode(values["privateKey"])),
      onBookUpdate,
    )

    return () => { setN(0) }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);


  const cleanedCode = HXRODexterity.depositAmount.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const depositAmount = ${cleanedCode}`;
  return (
    <BaseNode
      code={CODE}
      {...props}
      height="17rem"
      title="HXRO - Dexterity Orderbook"
    >

      {(bids || asks) &&
        <Box ml="8rem">

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th fontSize="1.2rem" color="blue.200" ml="1rem" mt="1rem" fontWeight={700}>Price</Th>
                <Th fontSize="1.2rem" color="blue.200" ml="1rem" mt="1rem" fontWeight={700} isNumeric>Size</Th>
              </Tr>
            </Thead>
            <Text color="blue.300" fontSize="1.4rem" fontWeight={500}>Mark Price: {markPrice}</Text>
            <Tbody>
              {bids && bids.map((bid) => (
                <Tr key={bid.price} >
                  <Td fontSize="1.8rem" color="#38A42F" background="#00ac002e" borderRadius="0 2rem 2rem 0">{bid.price.toLocaleString()}</Td>
                  <Td borderColor="#1c2033" fontSize="1.8rem" color="blue.100" isNumeric>{bid.ordersSize}</Td>
                </Tr>
              ))}
              {asks && asks.map((ask) => (
                <Tr key={ask.price} >
                  <Td fontSize="1.8rem" color="#E15757" background="#ff0a0a26" borderRadius="0 2rem 2rem 0">{ask.price.toLocaleString()}</Td>
                  <Td borderColor="#1c2033" fontSize="1.8rem" color="blue.100" isNumeric>{ask.ordersSize}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      }

      <CustomHandle
        pos="left"
        type="target"
        id="mpgPubKey"
        label="MPG Address"
        style={{ marginTop: "-1rem" }}

      />

      <CustomHandle
        pos="left"
        type="target"
        id="productName"
        label="Product Name"
        style={{ marginTop: "2rem" }}

      />

      <CustomHandle
        pos="left"
        type="target"
        id="privateKey"
        label="Private Key"
        style={{ marginTop: "5rem" }}

      />
    </BaseNode>
  );
};

export default DexOrderbook;

import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow, Connection } from "reactflow";
import BaseNode from "@/layout/BaseNode";
import { CustomHandle } from "@/layout/CustomHandle";
import { handleValue, truncatedPublicKey } from "@/util/helper";
import { HXRO } from "@/sdks/hxro";
import { Box, Flex, Text, useClipboard } from "@chakra-ui/react";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { HXROTypes } from "@/types/protocols";

const CODE = `
const getMarkets = async (marketPair: sdk.MarketPairEnum, amount: number, duration: number) => {
  const config = sdk.DEVNET_CONFIG
  const connection = new Connection("devnet_uri")
  const parimutuelWeb3 = new sdk.ParimutuelWeb3(config, connection)
  const markets = sdk.getMarketPubkeys(config, marketPair);
  const parimutuels = await parimutuelWeb3.getParimutuels(
    markets.filter((market) => market.duration == duration)
    , amount);
  return parimutuels
}
`

const USDC_DECIMALS = 1_000_000

const HXROPariGet: FC<NodeProps> = (props) => {
  const { getNode, getEdges, setNodes } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);

  const [data, setData] = useState<HXROTypes.FilteredContest[] | null>(null);

  const [addresses, setAddresses] = useState<any>({});
  const [outputs, setOutputs] = useState<any>({});


  const updateNodeData = (nodeId: string, data: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            [id as string]: data,
          };
        }
        return node;
      })
    );
  };

  const updateData = (contestAddress: string, e: Connection) => {
    if (!e.target) return;
    console.log(addresses, contestAddress)
    updateNodeData(e.target, contestAddress);
    setOutputs({ ...outputs, [contestAddress]: [...outputs[contestAddress], e.target] });
  };

  useEffect(() => {
    Object.keys(outputs).forEach((item) => {
      outputs[item].forEach((displayNodeIds: any) => {
        updateNodeData(displayNodeIds, item)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);

  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "marketPair",
      "amount",
      "durtion",
    ]);

    if (Object.values(values).length < 3) return;

    HXRO.getMarkets(values["marketPair"], values["amount"], values["duration"])
      .then((res) => {

        const filtered = res.map(({ pubkey, info }) => ({
          pubkey: pubkey.toBase58(),
          longs: info.parimutuel.activeLongPositions.toNumber() / USDC_DECIMALS,
          shorts: info.parimutuel.activeShortPositions.toNumber() / USDC_DECIMALS,
          expired: info.parimutuel.expired,
          slot: info.parimutuel.slot.toNumber(),
          strike: info.parimutuel.strike.toNumber()

        }))
        setAddresses(filtered.map((item) => item.pubkey))
        setData(filtered)
      }
      )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);
  // Public Key: ${item.pubkey} \nStrike: $${item.info.strike} \nSlot: ${item.info.slot} \nLongs: $${item.info.longs} \nShorts: $${item.info.shorts} \nExpired?: ${item.info.expired ? 'true' : 'false'}
  return (
    <BaseNode
      code={CODE}
      height="15rem"
      {...props}
      title="HXRO Parimutuel - Get Contests"
    >

      {data ?
        <Flex flexFlow="column" ml="8rem" mr="6rem" my="1rem" gap="0.5rem">
          {data.map((item: HXROTypes.FilteredContest, index: number) => (
            <Flex bg="bg.200" w="100%" key={item.pubkey} p="0 1rem" borderRadius="1rem" justify="space-between" gap="1rem" align="center">
              <Flex flexFlow="column" gap="1rem" padding="1rem 0">
                <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap" >Public Key: {truncatedPublicKey(item.pubkey)}</Text>
                <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap">Shorts: ${item.shorts.toLocaleString()}</Text>
                <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap">Longs: ${item.longs.toLocaleString()}</Text>
                <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap">Slot: {item.slot}</Text>
                {/* <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap">Strike: {item.strike}</Text> */}
              </Flex>
              <CustomHandle
                pos="right"
                type="source"
                id={"address" + item.pubkey}
                style={{ top: `${9 + 11.5 * index}` + "rem" }}
                label="Address"
                onConnect={(e: any) => {
                  updateData(item.pubkey, e);
                }}
              />
            </Flex>
          ))}
        </Flex>
        :
        <Text color="gray.100" fontSize="1.5rem">{'Empty...'}</Text>}

      <CustomHandle
        pos="left"
        type="target"
        id="marketPair"
        label="Market Pair"
        style={{ marginTop: "-2.7rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="amount"
        label="Amount"
        style={{ marginTop: "0.5rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="duration"
        label="Duration"
        style={{ marginTop: "4rem" }}
      />

    </BaseNode>
  );
};

export default HXROPariGet;

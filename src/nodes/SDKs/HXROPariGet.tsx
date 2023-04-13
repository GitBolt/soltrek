import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow } from "reactflow";
import BaseNode from "@/layout/BaseNode";
import { CustomHandle } from "@/layout/CustomHandle";
import { handleValue } from "@/util/helper";
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
  const { getNode, getEdges } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);

  const [data, setData] = useState<HXROTypes.FilteredContest[] | null>(null);

  const { hasCopied, setValue, onCopy } = useClipboard('')



  const onCopyBoard = (val: any) => {
    setValue(val)
    onCopy()
  }

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

      {data ? data.map((item: HXROTypes.FilteredContest) => (
        <Flex flexFlow="column" key={item.pubkey} gap="2rem" justify="start">
          <Box>
            <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap" ml="8rem" my="2rem">{item.pubkey}</Text>
            <Box pos="absolute" top="3rem" right="1rem">
              {hasCopied ? <CheckIcon color="blue.200" w="1.5rem" h="1.5rem" /> :
                <CopyIcon onClick={() => onCopyBoard(item.toLocaleString())} color="blue.200" w="1.5rem" h="1.5rem" />}
            </Box>
          </Box>
        </Flex>
      ))
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

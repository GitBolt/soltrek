import React, { useState, useEffect, FC } from "react";
import {
  NodeProps,
  useNodeId,
  useReactFlow,
  Connection as RFConnection
} from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { truncatedPublicKey } from "@/util/helper";
import { HXRO } from "@/sdks/hxro";
import { handleValue } from "@/util/handleNodeValue";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useNetworkContext } from "@/context/configContext";
import { HXROTypes } from "@/types/protocols";


const HXROGetUserPositions: FC<NodeProps> = (props) => {
  const { getNode, getEdges, setNodes } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);
  const { selectedNetwork } = useNetworkContext()
  const [userPositions, setUserPositions] = useState<HXROTypes.PositionItem[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const updateData = (contestAddress: string, e: RFConnection) => {
    if (!e.target) return;
    updateNodeData(e.target, contestAddress);
    setOutputs({
      ...outputs,
      [contestAddress]: [...(outputs[contestAddress] || []),
      e.target
      ]
    });
  };


  useEffect(() => {
    setIsLoading(false)
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "marketPair",
      "pubKey",
    ]);

    if (Object.values(values).filter((i) => i).length < 2) return;
    setIsLoading(true)

    HXRO.getUserPositions(
      selectedNetwork,
      values["marketPair"],
      values['pubKey']
    ).then((userPosRes) => {
      if (userPosRes.error || !userPosRes.positions) return
      setUserPositions(userPosRes.positions)
      setIsLoading(false)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);

  const cleanedCode = HXRO.getMarkets.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const getMarkets = ${cleanedCode}`;

  return (
    <BaseNode
      code={CODE}
      height="15rem"
      {...props}
      title="HXRO Parimutuel - Get User Positions"
    >

      <Flex flexFlow="column" ml="8rem" mr="6rem" my="1rem" gap="0.5rem">

        {isLoading && <Spinner size="lg" style={{ width: "5rem", height: "5rem" }} color="blue.100" thickness="0.5rem" />}
        {!isLoading && !userPositions.length && <Text color="blue.300" opacity="50%" fontSize="1.5rem">Empty...</Text>}
        {userPositions.length && !isLoading && userPositions.map((item, index: number) => (
          <Flex bg="bg.200" w="100%" key={item.key.parimutuelPubkey} p="0 1rem" borderRadius="1rem" justify="space-between" gap="1rem" align="center">
            <Flex flexFlow="column" gap="1rem" padding="1rem 0">
              <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap">Public Key: {truncatedPublicKey(item.key.parimutuelPubkey)}</Text>
              <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap">Position Type: {item.position.long > 0 ? "Long" : "Short"}</Text>
              <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap">Amount: {item.position.long > 0 ? item.position.long : item.position.short}</Text>
              <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap">Status: {item.market.status.toUpperCase()}</Text>
            </Flex>
            <CustomHandle
              pos="right"
              type="source"
              id={"address" + item.key.parimutuelPubkey}
              style={{ top: `${9 + 11.5 * index}` + "rem" }}
              label="Address"
              onConnect={(e: any) => {
                updateData(item.key.parimutuelPubkey, e);
              }}
            />
          </Flex>
        ))}
      </Flex>


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
        id="pubKey"
        label="User Address"
        style={{ marginTop: "0.5rem" }}
      />
    </BaseNode>
  );
};

export default HXROGetUserPositions;

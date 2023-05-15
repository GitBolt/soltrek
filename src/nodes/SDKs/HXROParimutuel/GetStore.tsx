import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow, Connection } from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { truncatedPublicKey } from "@/util/helper";
import { HXRO } from "@/sdks/hxro";
import { Flex, Text } from "@chakra-ui/react";
import { handleValue } from "@/util/handleNodeValue";
import { HXROTypes } from "@/types/protocols";
import { useNetworkContext } from "@/context/configContext";


const USDC_DECIMALS = 1_000_000

const HXROPariGetStore: FC<NodeProps> = (props) => {
  const { getNode, getEdges, setNodes } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);
  const { selectedNetwork } = useNetworkContext()
  const [data, setData] = useState<string | null>(null);

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
    updateNodeData(e.target, contestAddress);
    setOutputs({
      ...outputs,
      [contestAddress]: [...(outputs[contestAddress] || []),
      e.target
      ]
    });
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
      "storePubKey",
    ]);

    if (Object.values(values).length < 3) return;

    HXRO.getStore(
      selectedNetwork,
      values["storePubKey"]
      ).then((res) => {
        if (res.error) {
            return
        }
        setData(res.store?.toLocaleString() || '')
      }
      )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);

  const cleanedCode = HXRO.getStore.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const getStore = ${cleanedCode}`;

  return (
    <BaseNode
      code={CODE}
      height="8rem"
      {...props}
      title="HXRO Parimutuel - Get Store"
    >

      <Flex flexFlow="column" ml="8rem" mr="6rem" my="1rem" gap="0.5rem">
      <Text fontSize="1rem" color="blue.500" whiteSpace="pre-wrap" ml="4rem" my="2rem">{data}</Text>
      </Flex>


      <CustomHandle
        pos="left"
        type="target"
        id="storePubKey"
        label="Store Address"
      />

    </BaseNode>
  );
};

export default HXROPariGetStore;

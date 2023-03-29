import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow, Connection as RCon } from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { HXRO } from "@/sdks/hxro";
import { Text } from "@chakra-ui/react";
import { SDKResponse } from "@/types/response";
import base58 from "bs58";
import { useNetworkContext } from "@/context/configContext";

const HXROPariPlace: FC<NodeProps> = (props) => {
  const { getNode, getEdges, setNodes, setEdges } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);
  const {selectedNetwork} = useNetworkContext()
  const [txId, setTxId] = useState<any>();
  const [error, setError] = useState<any>('');
  const [sigOutputs, setSigOutputs] = useState<string[]>([])


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

  const updateSigOutput = (e: RCon) => {
    if (!e.target) return;
    updateNodeData(e.target, txId as string);
    setSigOutputs([...sigOutputs, e.target]);
  };

  useEffect(() => {
    sigOutputs.forEach((target) => updateNodeData(target, txId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txId, error]);


  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "privateKey",
      "pubKey",
      "amount",
      "side",
    ]);

    const dataKeys: string[] = Object.keys(currentNode?.data || {});

    const run = dataKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );
    if (Object.values(values).filter((i) => i).length < 4 || !run) return;

    setEdges((edgs) =>
      edgs.map((ed) => {
        if (ed.source == id) {
          ed.animated = true;
          return ed;
        }
        return ed;
      })
    );

    HXRO.placePosition(
      selectedNetwork,
      new Uint8Array(base58.decode(values["privateKey"])), // Need to validate this, should just reject invalid input try (React Flow has something for it)
      values["pubKey"],
      values["amount"],
      values["side"],
    ).then((res: SDKResponse) => {
      if (res.error) {
        setError(res.message)
      } else {
        setTxId(res.txId)
      }
    }).then(() => {
      setEdges((edgs) =>
        edgs.map((ed) => {
          if (ed.source == id) {
            ed.animated = false;
            return ed;
          }
          return ed;
        })
      );
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);


  const cleanedCode = HXRO.placePosition.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const placePosition = ${cleanedCode}`;

  return (
    <BaseNode
      code={CODE}
      height="20rem"
      {...props}
      title="HXRO Parimutuel - Place Position"

    >
      {error ?
        <Text fontSize="1.5rem" transform="translate(0, 3rem)" zIndex="3" color="blue.400" fontWeight={600}>{error.toLocaleString()}</Text> : null}
      <CustomHandle
        pos="left"
        type="target"
        id="run"
        label="Run"
        style={{ marginTop: "-5rem" }}
      />

      <CustomHandle
        pos="left"
        type="target"
        id="privateKey"
        label="Private Key"
        style={{ marginTop: "-2rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="pubKey"
        label="Contract Address"
        style={{ marginTop: "1rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="amount"
        label="Amount"
        style={{ marginTop: "4.2rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="side"
        label="Side (Long or Short)"
        style={{ marginTop: "7.5rem" }}
      />

      <CustomHandle
        pos="right"
        type="source"
        id="source"
        label="Signature"
        onConnect={(e: any) => {
          updateSigOutput(e);
        }}
      />
    </BaseNode>
  );
};

export default HXROPariPlace;

import BaseNode from "@/layout/BaseNode";
import { CustomHandle } from "@/layout/CustomHandle";
import { createPDA } from "@/util/genratePDA";
import { VStack } from "@chakra-ui/react";
import { Connection, PublicKey } from "@solana/web3.js";
import React, { FC, useEffect, useState } from "react";
import {
  Connection as RCon,
  NodeProps,
  useNodeId,
  useNodes,
  useReactFlow,
} from "reactflow";

const RequestAirdrop: FC<NodeProps> = (props) => {
  const [txid, setTxid] = useState<string | undefined>("");
  const [currentPDA, setCurrentPDA] = useState<string[]>([]);

  const { getNode, setNodes } = useReactFlow();
  const nodeId = useNodeId();
  const nodes = useNodes();

  const currentNodeObj = nodes.find((node) => node.id == nodeId);

  const updateNodeData = (nodeId: string, data: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            data,
          };
        }
        return node;
      })
    );
  };
  const updatePDA = (e: RCon) => {
    if (!e.target) return;
    updateNodeData(e.target, txid as string);
    setCurrentPDA([...currentPDA, e.target]);
  };
  useEffect(() => {
    currentPDA.forEach((target) =>
      updateNodeData(target, txid as string)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txid]);

  useEffect(() => {
    if (!nodeId) return;
    const currentNode = getNode(nodeId);
    const nodeKeys: string[] = Object.keys(currentNode?.data);
    const nodeValues: string[] = Object.values(currentNode?.data);

    const run = nodeKeys.find((key) => key.startsWith('btn') && currentNode?.data[key] == true)
    const receiver = nodeValues.find((value) => value.length > 30) // assuming long string is public key
    const rpcUrl = nodeValues.find((value) => typeof value == 'string' && value.startsWith('https://'))
    console.log(run, receiver, rpcUrl)
    if (run && receiver) {
      const connection = new Connection(rpcUrl || "https://api.devnet.solana.com")
      connection.requestAirdrop(new PublicKey(receiver), 2)
        .then((res) => setTxid(res))
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data]);
  return (
    <>
      <BaseNode {...props} title="Request SOL Airdrop">
        {txid}
        <VStack gap={6}>
          <CustomHandle
            pos="left"
            type="target"
            id="a"
            label="RPC URL"
            optional
            style={{ marginTop: "-1.8rem" }}
          />
          <CustomHandle
            pos="left"
            type="target"
            id="b"
            label="Run"
            style={{ marginTop: "0.8rem" }}
          />
          <CustomHandle
            pos="left"
            type="target"
            id="c"
            label="Destination"
            style={{ marginTop: "3.5rem" }}
          />
          <CustomHandle
            pos="right"
            type="source"
            id="c"
            label="Signature"
            onConnect={(e: any) => {
              updatePDA(e);
            }}
          />
        </VStack>
      </BaseNode>
    </>
  );
};

export default RequestAirdrop;

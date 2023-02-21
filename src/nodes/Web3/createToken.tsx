import React, { useState, useEffect, FC } from "react";
import {
  Position,
  NodeProps,
  useNodes,
  useNodeId,
  useReactFlow,
  Connection,
} from "reactflow";
import BaseNode from "@/layout/BaseNode";
import { Text } from "@chakra-ui/react";
import { CustomHandle } from "@/layout/CustomHandle";
import { createNewMint } from "@/util/createTokem";
import { Keypair, PublicKey } from "@solana/web3.js";
import base58 from "bs58";

const CreateToken: FC<NodeProps> = (props) => {
  const { getNode, setNodes } = useReactFlow();
  const nodeId = useNodeId();
  const nodes = useNodes();

  const currentNodeObj = nodes.find((node) => node.id == nodeId);
  const [tx, setTx] = useState<string>("");
  const updateNodeData = (nodeId: string, data: any) => {
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

  const handleConnect = (e: Connection) => {
    if (!e.target) return;
    updateNodeData(e.target, tx);
  };

  useEffect(() => {
    if (!nodeId) return;
    const currentNode = getNode(nodeId);
    console.log("Transaction: ", currentNode);
    const symbolData: string[] = Object.values(currentNode?.data);
    const nodeKeys: string[] = Object.keys(currentNode?.data);
    const run = nodeKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );
    if (symbolData && symbolData.length && run) {
      const mintKeypair = Keypair.generate();
      createNewMint(
        symbolData[0] ?? undefined,
        Keypair.fromSecretKey(base58.decode(symbolData[2])),
        mintKeypair,
        new PublicKey(symbolData[3]),
        new PublicKey(symbolData[3]),
        new PublicKey(symbolData[3]),
        symbolData[4], //name
        symbolData[5], // symbol
        symbolData[6], //des
        symbolData[7] //image
      ).then((e) => {
        alert(e);
        console.log(e);
        setTx(e);
      });
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeObj?.data]);

  return (
    <BaseNode height="220px" {...props} title="Fetch Price">
      <CustomHandle
        pos="left"
        type="target"
        id="a"
        label="RPC URL"
        optional
        style={{ marginTop: "-6.7rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="b"
        label="Run"
        style={{ marginTop: "-4.7rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="c"
        label="Secret Key"
        style={{ marginTop: "-2.7rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="d"
        label="PublicKey"
        style={{ marginTop: "-0.7rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="e"
        label="Token Name"
        style={{ marginTop: "1.3rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="f"
        label="Symbol"
        style={{ marginTop: "3.3rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="g"
        label="Description"
        style={{ marginTop: "5.3rem" }}
      />
      <CustomHandle
        pos="left"
        type="target"
        id="h"
        label="Image"
        style={{ marginTop: "7.3rem" }}
      />
      <CustomHandle
        onConnect={(e: any) => handleConnect(e)}
        pos="right"
        type="source"
        id="i"
        label="Transcation"
      />
    </BaseNode>
  );
};

export default CreateToken;

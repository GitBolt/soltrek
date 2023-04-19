import React, { useState, useEffect, FC } from "react";
import {
  Position,
  NodeProps,
  useNodeId,
  useReactFlow,
  Connection,
} from "reactflow";
import BaseNode from "@/layout/BaseNode";
import { Keypair } from "@solana/web3.js";
import b58 from "bs58";
import { CustomHandle } from "@/layout/CustomHandle";
import { handleValue } from "@/util/helper";

const KeypairNode: FC<NodeProps> = (props) => {
  const [kp, setKp] = useState<Keypair>(new Keypair());

  const [currentTargetPrivKey, setCurrentTargetPrivKey] = useState<string[]>(
    []
  );
  const [currentTargetPubKey, setCurrentTargetPubKey] = useState<string[]>([]);
  const { setNodes, getNode, getEdges } = useReactFlow();
  const id = useNodeId();

  const currentNode = getNode(id as string);

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

  useEffect(() => {
    const nodeKeys: string[] = Object.keys(currentNode?.data || {});
    const edges = getEdges()
    const values = handleValue(currentNode, edges, ["fromKey"])

    const privKey = values["fromKey"]
    if (privKey) {
      let parsed = new Uint8Array()
      try {
        parsed = new Uint8Array(privKey)
      } catch {
        try {
          parsed = new Uint8Array(b58.decode(privKey))
        } catch {
          return
        }
      }
      setKp(Keypair.fromSecretKey(parsed))
    }

    nodeKeys.forEach((key) => {
      if (key.startsWith("btn") && currentNode?.data[key] == true) {
        setKp(new Keypair());
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);

  const handleConnectPubKey = (e: Connection) => {
    if (!e.target) return;
    updateNodeData(e.target, kp.publicKey.toBase58());
    setCurrentTargetPubKey([...currentTargetPubKey, e.target]);
  };

  const handleConnectPrivKey = (e: Connection) => {
    if (!e.target) return;
    updateNodeData(e.target, b58.encode(kp.secretKey));
    setCurrentTargetPrivKey([...currentTargetPrivKey, e.target]);
  };

  useEffect(() => {
    currentTargetPrivKey.forEach((target) =>
      updateNodeData(target, b58.encode(kp.secretKey))
    );
    currentTargetPubKey.forEach((target) =>
      updateNodeData(target, kp.publicKey.toBase58())
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kp]);

  const KeypairCode = `
  import b58 from "bs58"
  import { Keypair } from "@solana/web3.js"

  const generateKeypair = () => {
    const kp = new Keypair()
    const { publicKey, secretKey } = kp
    const pubKey = b58.encode(publicKey)
    const privKey = b58.encode(secretKey)
    return {pubKey, privKey}
  }
  `;

  return (
    <BaseNode code={KeypairCode} {...props} title="Keypair Object">
      <CustomHandle pos="left" type="target" id="generate" label="Generate" style={{ marginTop: "-0.5rem" }} />

      <CustomHandle pos="left" type="target" id="fromKey" label="Private Key (Import)" style={{ marginTop: "2.5rem" }} />

      <CustomHandle
        pos="right"
        type="source"
        id="public_key"
        label="Public Key"
        onConnect={(e: any) => handleConnectPubKey(e)}
        style={{ marginTop: "-0.7rem" }}
      />

      <CustomHandle
        pos={Position.Right}
        type="source"
        id="private_key"
        label="Private Key"
        onConnect={(e: any) => handleConnectPrivKey(e)}
        style={{ marginTop: "2.5rem" }}
      />
    </BaseNode>
  );
};

export default KeypairNode;

import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow, Connection as RCon } from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { HXRO } from "@/sdks/hxro";
import { Button, Text } from "@chakra-ui/react";
import { SDKResponse } from "@/types/response";
import base58 from "bs58";
import { useNetworkContext } from "@/context/configContext";
import { HXRODexterity } from "@/sdks/hxroDexterity";
import { PublicKey } from "@metaplex-foundation/js";

const DexDepositAmount: FC<NodeProps> = (props) => {
  const { getNode, getEdges, setNodes, setEdges } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);

  const { selectedNetwork } = useNetworkContext()

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('')

  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "privateKey",
      "trgPubkey",
      "amount"
    ]);

    const dataKeys: string[] = Object.keys(currentNode?.data || {});
    const run = dataKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );

    if (!values["privateKey"] || !values["amount"] || !values["trgPubkey"] || !run) return;
    setError("")
    setSuccess('')
    setEdges((edgs) =>
      edgs.map((ed) => {
        if (ed.source == id) {
          ed.animated = true;
          return ed;
        }
        return ed;
      })
    );

    HXRODexterity.depositAmount(
      selectedNetwork,
      new Uint8Array(base58.decode(values["privateKey"])),
      new PublicKey(values["trgPubkey"]),
      values["amount"]
    ).then((res) => {
      if (res.error) {
        setError(res.error)
        return
      }
      setSuccess(res.res)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);


  const cleanedCode = HXRODexterity.depositAmount.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const depositAmount = ${cleanedCode}`;
  return (
    <BaseNode
      code={CODE}
      {...props}
      height="17rem"
      title="HXRO - Deposit Amount"
    >
      {error ?
        <Text fontSize="1.5rem" transform="translate(0, 3rem)" zIndex="3" color="blue.400" fontWeight={600}>{error.toLocaleString()}</Text> : null}

      {success ?
        <Text fontSize="1.2rem" w="70%" transform="translate(3rem, 3rem)" zIndex="3" color="blue.200" fontWeight={600}>{success}</Text> : null}

      <CustomHandle
        pos="left"
        type="target"
        id="run"
        label="Run"
        style={{ marginTop: "-4rem" }}
      />

      <CustomHandle
        pos="left"
        type="target"
        id="trgPubkey"
        label="TRG Address"
        style={{ marginTop: "-1rem" }}

      />

      <CustomHandle
        pos="left"
        type="target"
        id="amount"
        label="Amount"
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

export default DexDepositAmount;

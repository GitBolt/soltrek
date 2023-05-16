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

const DexPlaceLimitOrder: FC<NodeProps> = (props) => {
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
      "quoteSize",
      "price",
      "productName",
      "type"
    ]);

    const dataKeys: string[] = Object.keys(currentNode?.data || {});
    const run = dataKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );

    if (Object.values(values).filter(i => i).length != 6 || !run) return;

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

    HXRODexterity.placeLimitOrder(
      selectedNetwork,
      values["type"],
      new Uint8Array(base58.decode(values["privateKey"])),
      new PublicKey(values["trgPubkey"]),
      values["productName"],
      values["quoteSize"],
      values["price"]
    ).then((res) => {
      // if (res.error) {
      //   setError(res.error)
      //   return
      // }
      // setSuccess(res.res)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);


  const cleanedCode = HXRODexterity.placeLimitOrder.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const placeLimitOrder = ${cleanedCode}`;
  return (
    <BaseNode
      code={CODE}
      {...props}
      height="25rem"
      title="HXRO - Place Limit Order"
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
        style={{ marginTop: "-8rem" }}
      />

      <CustomHandle
        pos="left"
        type="target"
        id="trgPubkey"
        label="TRG Address"
        style={{ marginTop: "-5rem" }}

      />

      <CustomHandle
        pos="left"
        type="target"
        id="price"
        label="Price"
        style={{ marginTop: "-2rem" }}

      />

      <CustomHandle
        pos="left"
        type="target"
        id="quoteSize"
        label="Quote Size"
        style={{ marginTop: "1rem" }}

      />

      <CustomHandle
        pos="left"
        type="target"
        id="productName"
        label="Product Name"
        style={{ marginTop: "4rem" }}

      />

      <CustomHandle
        pos="left"
        type="target"
        id="type"
        label="Long/Short"
        style={{ marginTop: "7rem" }}

      />

      <CustomHandle
        pos="left"
        type="target"
        id="privateKey"
        label="Private Key"
        style={{ marginTop: "10rem" }}

      />
    </BaseNode>
  );
};

export default DexPlaceLimitOrder;

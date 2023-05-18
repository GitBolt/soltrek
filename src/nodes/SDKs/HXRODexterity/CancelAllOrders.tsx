import React, { useState, useEffect, FC } from "react";
import base58 from "bs58";
import {
  NodeProps,
  useNodeId,
  useReactFlow,
  Connection as RCon
} from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { Spinner, Text } from "@chakra-ui/react";
import { useNetworkContext } from "@/context/configContext";
import { HXRODexterity } from "@/sdks/hxroDexterity";

const DexCancelAllOrders: FC<NodeProps> = (props) => {
  const { getNode, getEdges, setEdges } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);

  const { selectedNetwork } = useNetworkContext()

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "privateKey",
      "trgPubKey",
      "productName"
    ]);

    const dataKeys: string[] = Object.keys(currentNode?.data || {});
    const run = dataKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );

    if (!values["privateKey"] || !run) return;

    setLoading(true)
    setEdges((edgs) =>
      edgs.map((ed) => {
        if (ed.source == id) {
          ed.animated = true;
          return ed;
        }
        return ed;
      })
    );

    HXRODexterity.cancelAllOrders(
      selectedNetwork,
      new Uint8Array(base58.decode(values["privateKey"])),
      values["trgPubKey"],
      values["productName"]
    ).then((res) => {
      console.log("SDK res: ", res)
      if (res.error) {
        setError(res.error)
        return
      }
      setSuccess(res.res)
      setLoading(false)
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


  const cleanedCode = HXRODexterity.cancelAllOrders.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const cancelAllOrders = ${cleanedCode}`;

  return (
    <BaseNode
      code={CODE}
      {...props}
      height="18rem"
      title="HXRO - Cancel All Orders"
    >
      {loading && <Spinner size="lg" style={{ width: "5rem", height: "5rem" }} color="blue.100" thickness="0.5rem" />}

      {error ?
        <Text fontSize="1.5rem" transform="translate(0, 3rem)" zIndex="3" color="blue.400" fontWeight={600}>{error.toLocaleString()}</Text> : null}

      {success ?
        <Text fontSize="1.5rem" w="70%" transform="translate(4rem, 2rem)" zIndex="3" color="blue.200" fontWeight={600}>{success}</Text> : null}

      <CustomHandle
        pos="left"
        type="target"
        id="run"
        label="Run"
        style={{ marginTop: "-4.5rem" }}
      />

      <CustomHandle
        pos="left"
        type="target"
        id="privateKey"
        label="Private Key"
        style={{ marginTop: "-1rem" }}
      />

      <CustomHandle
        pos="left"
        type="target"
        id="trgPubKey"
        label="TRG Address"
        style={{ marginTop: "2.7rem" }}
      />

      <CustomHandle
        pos="left"
        type="target"
        id="productName"
        label="Product Name"
        style={{ marginTop: "6.5rem" }}
      />

    </BaseNode>
  );
};

export default DexCancelAllOrders;

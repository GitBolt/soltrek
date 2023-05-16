import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow, Connection as RCon } from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import base58 from "bs58";
import { useNetworkContext } from "@/context/configContext";
import { HXRODexterity } from "@/sdks/hxroDexterity";
import { PublicKey } from "@metaplex-foundation/js";
import { stringify } from "@/util/helper";

const DexViewTRG: FC<NodeProps> = (props) => {
  const { getNode, getEdges, setNodes, setEdges } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);
  const [loading, setLoading] = useState<boolean>(false)
  const { selectedNetwork } = useNetworkContext()

  const [data, setData] = useState<string>('');
  const [error, setError] = useState<string>('');


  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "privateKey",
      "trgPubkey"
    ]);
    console.log(values)
    if (!values["privateKey"] || !values["trgPubkey"]) return;
    setError('')
    setData('')
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

    HXRODexterity.viewTRGAccount(
      selectedNetwork,
      new Uint8Array(base58.decode(values["privateKey"])),
      new PublicKey(values["trgPubkey"])
    ).then((res) => {
      if (res?.error) {
        setError(res.error)
        return
      }
      setData(`
      Net Cash: ${res.res.netCash}
      \n
      PnL: ${res.res.pnl}
      \n
      Total Deposited: ${res.res.totalDeposited}
      \n
      Total Withdrawed: ${res.res.totalWithdrawn}

      `)
      setLoading(false)
      console.log("SDK Res: ", res)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);


  const cleanedCode = HXRODexterity.viewTRGAccount.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const viewTRGAcount = ${cleanedCode}`;
  return (
    <BaseNode
      code={CODE}
      {...props}
      title="HXRO - View TRG"
    >
      {error ?
        <Text fontSize="1.5rem" transform="translate(0, 3rem)" zIndex="3" color="blue.400" fontWeight={600}>{error.toLocaleString()}</Text> : null}

      {data && <Flex align="start" flexFlow="column" ml="8rem" mr="1rem">
        {data && data.split("\n").map((d) => (
          <Text key={d} textAlign="left" fontSize="1.1rem" zIndex="3" color="blue.200" fontWeight={600}>{d}</Text>
        ))
        }
      </Flex>
      }
      {loading && <Spinner size="lg" style={{ width: "5rem", height: "5rem" }} color="blue.100" thickness="0.5rem" />}

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
        id="privateKey"
        label="Private Key"
        style={{ marginTop: "2rem" }}

      />
    </BaseNode>
  );
};

export default DexViewTRG;

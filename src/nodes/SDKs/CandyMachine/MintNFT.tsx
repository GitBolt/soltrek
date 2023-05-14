import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow, Connection as RCon } from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { Spinner, Text } from "@chakra-ui/react";
import base58 from "bs58";
import { useNetworkContext } from "@/context/configContext";
import { CandyMachine } from "@/sdks/candyMachine";

const MintNFT: FC<NodeProps> = (props) => {
  const { getNode, getEdges, setNodes, setEdges } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);
  const { selectedNetwork } = useNetworkContext()

  const [address, setAddress] = useState<any>();
  const [error, setError] = useState<any>('');
  const [targetNodes, setTargetNodes] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)


  // Update target nodes (accepting input) data with 100ms delay (required to work properly)
  const updateNodeData = (nodeIds: string[], data: any) => {
    setTimeout(() => {
      setNodes(nodes => nodes.map(node =>
        nodeIds.includes(node.id)
          ? { ...node, data: { ...node.data, [id as string]: data } }
          : node
      ));
    }, 100);
  };


  const onConnect = (e: RCon) => {
    if (!e.target) return
    setTargetNodes([...targetNodes, e.target])
    updateNodeData([e.target], address)
  };


  useEffect(() => {
    if (!targetNodes) return
    updateNodeData(targetNodes, address)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);


  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "pk",
      "cmAddress"
    ]);

    const dataKeys: string[] = Object.keys(currentNode?.data || {});

    const shouldRun = dataKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );

    console.log(values)
    if (!values["pk"] || !values["cmAddress"] || !shouldRun) return;

    let privKey = values["pk"]
    let cmAddress = values["cmAddress"]
    let parsed: any

    try {
      parsed = new Uint8Array(base58.decode(privKey))
    } catch {
      try {
        parsed = new Uint8Array(JSON.parse(privKey))
      } catch (e) {
        console.log("Keypair Error: ", e)
      }
    }
    console.log(3)
    setLoading(true)
    setError('')
    const run = async () => {
      const res = await CandyMachine.mintNFT(
        selectedNetwork,
        parsed,
        cmAddress,
      )
      console.log(res)
      if (res.error) {
        setError(res.error)
        return
      }
    }

    run().then(() => setLoading(false))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);


  const cleanedCode = CandyMachine.mintNFT.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const mintNFT = ${cleanedCode}`;

  return (
    <BaseNode
      code={CODE}
      {...props}
      height="20rem"
      title="Candy Machine - Mint NFT"

    >

      {loading && <Spinner size="lg" style={{ width: "5rem", height: "5rem" }} color="blue.100" thickness="0.5rem" />}

      {error ?
        <Text fontSize="1.5rem" transform="translate(7rem, 3rem)" mr="10rem" zIndex="3" color="blue.400" maxW="30rem" fontWeight={600}>{error.toLocaleString()}</Text> : null}

      <CustomHandle
        pos="left"
        type="target"
        style={{ marginTop: "-5rem" }}
        id="run"
        label="Run"
      />


      <CustomHandle
        pos="left"
        type="target"
        style={{ marginTop: "-2rem" }}
        id="cmAddress"
        label="Candy Machine Address"
      />

      <CustomHandle
        pos="left"
        type="target"
        style={{ marginTop: "3rem" }}
        id="pk"
        label="Private Key"
      />



    </BaseNode>
  );
};

export default MintNFT;



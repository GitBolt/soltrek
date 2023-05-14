import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow, Connection as RCon } from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import base58 from "bs58";
import { useNetworkContext } from "@/context/configContext";
import { CandyMachine } from "@/sdks/candyMachine";
import { CheckIcon } from "@chakra-ui/icons";

const CreateCandyMachine: FC<NodeProps> = (props) => {
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
      "configs",
      "kp",
      "run"
    ]);

    const dataKeys: string[] = Object.keys(currentNode?.data || {});

    const shouldRun = dataKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );

    if (!values["configs"] || !values["kp"] || !shouldRun) return;

    const configs = values["configs"]
    let privKey = values["kp"]
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

    setLoading(true)
    setError('')
    const run = async () => {
      const { error: createError, cm, collection } = await CandyMachine.createCandyMachine(
        selectedNetwork,
        parsed,
        configs,
      )
      if (createError) {
        setError(createError)
        return
      }

      setAddress(cm!.address.toBase58())
    }

    run().then(() => setLoading(false))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);


  const cleanedCode = CandyMachine.createCandyMachine.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const createCandyMachine = ${cleanedCode}`;

  return (
    <BaseNode
      code={CODE}
      {...props}
      height="15rem"
      title="Candy Machine - Create"

    >

      {loading && <Spinner size="lg" style={{ width: "5rem", height: "5rem" }} color="blue.100" thickness="0.5rem" />}

      {error ?
        <Text fontSize="1.5rem" transform="translate(7rem, 3rem)" mr="10rem" zIndex="3" color="blue.400" maxW="30rem" fontWeight={600}>{error.toLocaleString()}</Text> : null}

      {address && (
        <Flex flexFlow="column" align="center" justify="center" mt="10%" transform="translate(1rem)">
          <CheckIcon style={{ width: "3rem", height: "3rem" }} color="lime" />
          <Text textAlign="center" fontSize="1.4rem" color="blue.100" maxW="90%">Created Candymachine</Text>
        </Flex>
      )}
      <CustomHandle
        pos="left"
        type="target"
        style={{ marginTop: "-3rem" }}
        id="run"
        label="Run"
      />

      <CustomHandle
        pos="left"
        type="target"
        style={{ marginTop: "0.5rem" }}
        id="configs"
        label="Configurations"
      />

      <CustomHandle
        pos="left"
        type="target"
        id="kp"
        style={{ marginTop: "4rem" }}
        label="Authority (Private Key)"
      />

      <CustomHandle
        pos="left"
        type="target"
        id="kp"
        style={{ marginTop: "4rem" }}
        label="Authority (Private Key)"
      />

      <CustomHandle
        pos="right"
        type="source"
        id="address"
        onConnect={onConnect}
        label="Address"
      />

    </BaseNode>
  );
};

export default CreateCandyMachine;



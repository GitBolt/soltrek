import React, { useState, useEffect, FC } from "react";
import { NodeProps, useNodeId, useReactFlow, Connection as RCon } from "reactflow";
import BaseNode from "@/layouts/BaseNode";
import { CustomHandle } from "@/layouts/CustomHandle";
import { handleValue } from "@/util/handleNodeValue";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import base58 from "bs58";
import { useNetworkContext } from "@/context/configContext";
import { CandyMachine } from "@/sdks/candyMachine";
import { CheckIcon } from "@chakra-ui/icons";

const InsertNFT: FC<NodeProps> = (props) => {
  const { getNode, getEdges } = useReactFlow();
  const id = useNodeId();
  const currentNode = getNode(id as string);
  const { selectedNetwork } = useNetworkContext()

  const [success, setSuccess] = useState<string>('NFT 1');
  const [error, setError] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false)


  useEffect(() => {
    const edges = getEdges();
    const values = handleValue(currentNode, edges, [
      "name",
      "uri",
      "pk",
      "cmAddress"
    ]);

    const dataKeys: string[] = Object.keys(currentNode?.data || {});

    const shouldRun = dataKeys.find(
      (key) => key.startsWith("btn") && currentNode?.data[key] == true
    );

    if (!values["uri"] || !values["name"] || !values["pk"] || !values["cmAddress"] || !shouldRun) return;
    const uri = values["uri"]
    const name = values["name"]

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
    setLoading(true)
    setError('')
    setSuccess('')
    const run = async () => {
      const res = await CandyMachine.insertNFT(
        selectedNetwork,
        parsed,
        cmAddress,
        name,
        uri,
      )

      console.log(res)
      if (res.error) {
        setError(res.error)
        return
      }
      setSuccess(name)
    }

    run().then(() => setLoading(false))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.data]);


  const cleanedCode = CandyMachine.insertNFT.toString().replace(/_.*?(\.|import)/g, '');
  const CODE = `export const insertNFT = ${cleanedCode}`;

  return (
    <BaseNode
      code={CODE}
      {...props}
      height="30rem"
      title="Candy Machine - Insert NFT"

    >

      {loading && <Spinner size="lg" style={{ width: "5rem", height: "5rem" }} color="blue.100" thickness="0.5rem" />}

      {error ?
        <Text fontSize="1.5rem" transform="translate(7rem, 3rem)" mr="10rem" zIndex="3" color="blue.400" maxW="30rem" fontWeight={600}>{error.toLocaleString()}</Text> : null}

      {success && (
        <Flex flexFlow="column" align="center" justify="center" mt="50%" transform="translate(2rem)">
          <CheckIcon style={{ width: "3rem", height: "3rem" }} color="lime" />
          <Text textAlign="center" fontSize="2rem" color="blue.100" maxW="90%">Inserted NFT {success}</Text>
        </Flex>

      )}


      <CustomHandle
        pos="left"
        type="target"
        style={{ marginTop: "-8rem" }}
        id="run"
        label="Run"
      />


      <CustomHandle
        pos="left"
        type="target"
        style={{ marginTop: "-3.5rem" }}
        id="name"
        label="NFT Name"
      />

      <CustomHandle
        pos="left"
        type="target"
        style={{ marginTop: "1rem" }}
        id="uri"
        label="NFT URI"
      />


      <CustomHandle
        pos="left"
        type="target"
        style={{ marginTop: "5rem" }}
        id="pk"
        label="Authority (Private Key)"
      />


      <CustomHandle
        pos="left"
        type="target"
        style={{ marginTop: "9.5rem" }}
        id="cmAddress"
        label="Candy Machine Address"
      />
    </BaseNode>
  );
};

export default InsertNFT;



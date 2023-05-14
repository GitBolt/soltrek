import React, { FC, useEffect, useState } from 'react';
import BaseNode from '@/layouts/BaseNode';
import { Position, NodeProps, Connection, useReactFlow, useNodeId } from 'reactflow';
import { Box, Button, Checkbox, Divider, Flex, Input, Text } from '@chakra-ui/react';
import { CustomHandle } from '@/layouts/CustomHandle';
import { toBigNumber } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import { uploadJson } from '@/util/upload';
import { DeleteIcon } from '@chakra-ui/icons';

type InputNodeType = {
	placeholder: string;
};

const CreateNFTMetadata: FC<NodeProps<InputNodeType>> = (props) => {

	const [metadata, setMetadata] = useState({
		name: "SOL TREK",
		symbol: "SOLTREK",
		description: "A SOLTrek NFT",
		image: "https://ipfs.io/ipfs/bafybeia72ssk2xrn52yfxo72smibbbv4lfehc6zah6i75kn6227cq5ear4/soltrek.jpg",
		attributes: [
			{ trait_type: "Variant", value: "common" },
			{ trait_type: "Color", value: "Magenta" },
		]
	})
	const [output, setOutput] = useState('')

	const [targetNodeIds, setTargetNodeIds] = useState<string[]>([])
	const { setNodes, getNode, setEdges } = useReactFlow()
	const id = useNodeId();

	const currentNode = getNode(id as string);


	const updateNodeData = (nodeId: string) => {
		setNodes((nds) =>
			nds.map((node) => {
				if (node.id === nodeId) {
					node.data = {
						...node.data,
						[id as string]: output,
					};
				}
				return node;
			}))
	}

	const onConnect = (e: Connection) => {
		if (!e.target) return
		setTargetNodeIds([...targetNodeIds, e.target])
		updateNodeData(e.target)
	};

	useEffect(() => {
		console.log("Change")
		const dataKeys: string[] = Object.keys(currentNode?.data || {});

		const run = dataKeys.find(
			(key) => key.startsWith("btn") && currentNode?.data[key] == true
		);

		if (run) {
			setEdges((edgs) =>
				edgs.map((ed) => {
					if (ed.source == id) {
						ed.animated = true;
						return ed;
					}
					return ed;
				})
			);
			uploadJson(JSON.stringify(metadata)).then((res) => {
				console.log(res)
				setOutput(res!)
			}).then(() => setEdges((edgs) =>
				edgs.map((ed) => {
					if (ed.source == id) {
						ed.animated = false;
						return ed;
					}
					return ed;
				})
			))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentNode?.data])


	// Updating input nodes with latest output data from this node
	useEffect(() => {
		if (!targetNodeIds) return
		targetNodeIds.forEach((target) => updateNodeData(target))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [output])


	return (
		<div>
			<BaseNode {...props} title="Create NFT Metadata" height="20rem" width="10rem">

				<Flex flexFlow="column" gap="1.5rem" mt="2rem" mx="2rem">

					<Box style={{ whiteSpace: "nowrap", width: "20rem" }}>
						<Box style={{ display: 'inline-block', width: "11rem", marginRight: "1rem" }}
						>
							<Text color="blue.100" fontSize="1.1rem">Name</Text>
							<Input
								variant="node"
								value={metadata.name}
								placeholder={props.data.placeholder || "Enter name"}
								id={props.id}
								onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
							/>
						</Box>

						<Box style={{ display: 'inline-block', width: "7rem" }}
						>
							<Text color="blue.100" fontSize="1.1rem">Symbol</Text>
							<Input
								variant="node"
								value={metadata.symbol}
								placeholder={props.data.placeholder || "Enter symbol"}
								id={props.id}
								onChange={(e) => setMetadata({ ...metadata, symbol: e.target.value })}
							/>
						</Box>
					</Box>

					<Box>
						<Text color="blue.100" fontSize="1.1rem">Description</Text>
						<Input
							variant="node"
							value={metadata.description}
							placeholder={props.data.placeholder || "Enter description"}
							id={props.id}
							onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
						/>
					</Box>

					<Divider />
					<Box>
						<Text color="blue.100" fontSize="1.1rem">Image URI</Text>
						<Input
							variant="node"
							value={metadata.image}
							placeholder={props.data.placeholder || "Enter name"}
							id={props.id}
							onChange={(e) => setMetadata({ ...metadata, image: e.target.value })}
						/>
					</Box>

					<Flex flexFlow="column" gap="1rem" mb="2rem">
						<Text color="blue.100" fontSize="1.1rem">Add properties</Text>
						<Button w="30%" fontSize="1.2rem" h="2rem" variant="magenta" onClick={() => setMetadata({ ...metadata, attributes: [...metadata.attributes, { trait_type: '', value: '' }] })}>Add</Button>
						{metadata.attributes && metadata.attributes.length && metadata.attributes.map((attribute, index) => (
							<div key={index} style={{ whiteSpace: 'nowrap', width: "20rem" }}>
								<Input
									variant="node"
									w="9rem"
									mr="1rem"
									value={attribute.trait_type}
									placeholder={props.data.placeholder || "Enter trait type"}
									id={props.id}
									onChange={(e) => {
										const newAttributes = [...metadata.attributes];
										newAttributes[index] = {
											...newAttributes[index],
											trait_type: e.target.value,
										};
										setMetadata({ ...metadata, attributes: newAttributes });
									}}
									style={{ display: 'inline-block' }}
								/>
								<Input
									w="9rem"
									variant="node"
									mr="1rem"

									value={attribute.value}
									placeholder={props.data.placeholder || "Enter trait value"}
									id={props.id}
									onChange={(e) => {
										const newAttributes = [...metadata.attributes];
										newAttributes[index] = {
											...newAttributes[index],
											value: e.target.value,
										};
										setMetadata({ ...metadata, attributes: newAttributes });
									}}
									style={{ display: 'inline-block' }}
								/>

								<DeleteIcon
									color="magenta.100"
									w="1.2rem"
									h="1.2rem"
									onClick={() => {
										const newAttributes = metadata.attributes.filter((_, i) => i !== index)
										setMetadata({ ...metadata, attributes: newAttributes })
									}}
									style={{ display: 'inline-block' }}
								/>

							</div>
						))}
					</Flex>

				</Flex>
				<CustomHandle pos={Position.Left} style={{ marginTop: "-3rem" }} type="target" label="Upload" id="run" />
				<CustomHandle pos={Position.Right} style={{ marginTop: "-3rem" }} type="source" label="Metadata" id="uri" onConnect={(e: any) => onConnect(e)} />
			</BaseNode>
		</div>
	);
};

export default CreateNFTMetadata;

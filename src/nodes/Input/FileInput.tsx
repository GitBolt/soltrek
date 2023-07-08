/* eslint-disable @next/next/no-img-element */
import React, { FC, useEffect, useState } from 'react';
import BaseNode from '@/layouts/BaseNode';
import { Position, NodeProps, Connection, useReactFlow, useNodeId } from 'reactflow';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { CustomHandle } from '@/layouts/CustomHandle';
import { useFileUpload } from 'use-file-upload'
import { uploadFile } from '@/util/upload';


const FileInputNode: FC<NodeProps> = (props) => {

  const [uri, setUri] = useState<string>('')
  const [targetNodeIds, setTargetNodeIds] = useState<string[]>([])
  const { setNodes, setEdges } = useReactFlow()
  const [file, selectFile]: [any, any] = useFileUpload()

  const [uploading, setUploading] = useState<boolean>(false)
  const id = useNodeId()

  // Update target nodes (accepting input) data with 100ms delay (required to work properly)
  const updateNodeData = (nodeIds: string[]) => {
    setTimeout(() => {
      setNodes(nodes => nodes.map(node =>
        nodeIds.includes(node.id)
          ? { ...node, data: { ...node.data, [id as string]: uri } }
          : node
      ));
    }, 100);
  };

  const onConnect = (e: Connection) => {
    if (!e.target) return
    setTargetNodeIds([...targetNodeIds, e.target])
    updateNodeData([e.target])
  };

  useEffect(() => {
    if (!targetNodeIds) return
    updateNodeData(targetNodeIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri])

  useEffect(() => {

    if (!file) return
    setUploading(true)
    const run = async () => {
      setEdges((edgs) =>
        edgs.map((ed) => {
          if (ed.source == id) {
            ed.animated = true;
            return ed;
          }
          return ed;
        })
      );

      // @ts-ignore
      const res = await fetch(file.source)
      const blob = await res.blob()
      const uri = await uploadFile(blob)
      setUri(uri)

      setEdges((edgs) =>
        edgs.map((ed) => {
          if (ed.source == id) {
            ed.animated = false;
            return ed;
          }
          return ed;
        })
      );
    }

    run().then(() => setUploading(false)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  return (
    <div>
      <BaseNode {...props} title="File Input">
        <Button
          w="100%"
          h="3rem"
          mt="2rem"
          mb="1rem"
          fontSize="1.2rem"
          p="0 1rem"
          variant="filled"
          onClick={uploading ? () => { } : () => {
            //@ts-ignore
            selectFile()
          }}
        >
          {uploading ? 'Uploading...' : 'Click here to upload'}
        </Button>

        {file ? (
          <Box w='15rem' mb="1rem">
            
            <img src={file.source} alt='preview' width="100%" height="100%" style={{ objectFit: "cover" }} />
            <Text fontSize="1rem" color="gray.300">{file.name} </Text>
          </Box>
        ) : (
          <Text mb="1rem" fontSize="1rem" color="gray.300"> No file selected </Text>

        )}

        <CustomHandle pos={Position.Right} type="source" label="URI" onConnect={(e: any) => onConnect(e)} />
      </BaseNode>
    </div>
  );
};

export default FileInputNode;

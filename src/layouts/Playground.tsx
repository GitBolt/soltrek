import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  BackgroundVariant,
  useKeyPress,
  Connection,
  Node,
  Instance,
  Edge
} from 'reactflow';
import styles from '@/styles/Playground.module.css'
import { nodeTypes } from '@/nodes';
import NodeEdge from '@/layouts/NodeEdge';
import useCtrlA from '@/util/useCtrlA';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '@chakra-ui/react';
import { useCustomModal } from '@/context/modalContext';

type Props = {
  editable?: boolean,
  multiplayer?: boolean,

  onNodeChange: React.Dispatch<React.SetStateAction<any>>,
  nodes: Node[],
  setNodes: Instance.SetNodes<any>,

  onEdgeChange: React.Dispatch<React.SetStateAction<any>>,
  edges: Edge[],
  setEdges: Instance.SetEdges<any>,
}

const Playground = function Playground({
  editable = false,
  multiplayer,

  onEdgeChange,
  edges,
  setEdges,

  onNodeChange,
  nodes,
  setNodes,
}: Props) {
  const ctrlAPress = useCtrlA()
  const backspacePress = useKeyPress('Backspace')

  const { publicKey } = useWallet()
  const { savedPg } = useCustomModal()
  const toast = useToast()


  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds))
  }
    , [setEdges]
  );

  const handleKeyDown = (event: any) => {
    if (event.key === "l" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      if (!publicKey) {
        toast({
          status: "error",
          title: "Connect wallet required",
        })
        return
      }
      savedPg.onOpen();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);


  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        const values = Object.keys(node.data)
        values.forEach((value) => {
          if (!nodes.map((nd) => nd.id).includes(value)) {
            const { [value]: removed, ...rest } = node.data;
            node.data = rest;
          }
        })
        return node;
      }))
      onNodeChange(nodes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backspacePress]);

  
  useEffect(() => {
    if (ctrlAPress.split("-")[0] == "true") {
      setNodes((nodes) => nodes.map((nd) => { return { ...nd, selected: true } }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctrlAPress])



  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      edges={edges}
      id="rf-main"
      nodesDraggable={multiplayer ? editable : true}
      nodesConnectable={multiplayer ? editable : true}
      nodesFocusable={editable}
      proOptions={{ hideAttribution: true }}
      onNodesChange={onNodeChange}
      onEdgesChange={onEdgeChange}
      onConnect={!multiplayer || editable ? onConnect : () => { }}
      edgeTypes={{ default: NodeEdge }}
    >
      <Controls className={styles.controls} position="bottom-right" />
      <MiniMap
        nodeColor="#FF00994d"
        nodeStrokeColor="#FF0099"
        maskColor='#3e3a6d4d'
        className={styles.minimap}
        zoomable
        pannable />
      <Background
        color="#4B4967"

        variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
}

export default Playground
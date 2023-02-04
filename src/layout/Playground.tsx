import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from 'reactflow';
import styles from '@/styles/Playground.module.css'
import { nodeTypes } from '@/nodes';
import NodeEdge from '@/components/NodeEdge';
import useKeyPress from '@/util/useKeyPress';

const Playground = function Playground() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);


  const onConnect = useCallback((params: any) =>
    setEdges((eds) => addEdge(params, eds))
    , [setEdges]
  );

  const isCtrlA = useKeyPress()

  useEffect(() => {

    if (isCtrlA.split("-")[0] == "true") {
      setNodes((nodes) => nodes.map((nd) => { return { ...nd, selected: true } }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCtrlA])


  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      edges={edges}
      proOptions={{ hideAttribution: true }}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
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
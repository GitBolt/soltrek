import React, { memo } from 'react';
import { getBezierPath, useReactFlow } from 'reactflow';
import { CloseButton } from '@chakra-ui/react';

const foreignObjectSize = 40;



const Edge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: any) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { setEdges } = useReactFlow()

  const onEdgeClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    event.stopPropagation();
    setEdges((eds) => eds.filter((e) => e.id !== id));

  };
  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <CloseButton onClick={(event) => onEdgeClick(event, id)} color="magenta.300" size="lg"/>
      </foreignObject>
    </>
  );
}

export default memo(Edge)
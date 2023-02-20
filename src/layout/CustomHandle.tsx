import { Handle, Position } from "reactflow"


interface Props {
  pos: "left" | "right",
  type: "source" | "target",
  label?: string,
  onConnect?: any
  id?: string,
  style?: object,
  optional?: boolean
}

export const CustomHandle = ({
  pos,
  type,
  label,
  id,
  onConnect,
  style,
  optional
}: Props) => {

  const PosKp = {
    "left": Position.Left,
    "right": Position.Right,
  }
  return (
    <Handle
      position={PosKp[pos]}
      type={type}
      style={{
        backgroundColor: optional ? '#BF0073CC' : '#DD11B1',
        borderColor: optional ? "#BF0073CC" : "#DD11B1",
        ...style
      }}
      onConnect={onConnect}
      id={id}
    >
      {label &&
        <div style={{
          width: "100px",
          fontWeight: "800",
          fontSize: "1rem",
          direction: pos === "right" ? "rtl" : "ltr",
          color: optional ? "#BF0073CC" : "#DD11B1",
          transform: `translate(${pos == "left" ? '15px' : '-108px'}, 2px)`
        }}>{optional ? '_' : ''}{label}
        </div>}
    </Handle >
  )
}
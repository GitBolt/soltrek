import { Edge, Node } from "reactflow";

export const handleValue = (
  node: Node<any, string | undefined> | undefined,
  edge: Edge[],
  ids: string[]
) => {
  let idValueMap = Object();
  let edge_id = Object();
  edge.map((e) => {
    edge_id = {
      ...edge_id,
      [e.targetHandle as any]: e.source,
    };
  });
  ids.map((e) => {
    idValueMap = {
      ...idValueMap,
      [e]: node?.data[String(edge_id[e])],
    };
  });
  return idValueMap;
};


export const stringify = (value: any, indent = 2): string => {
  const spaces = ' '.repeat(indent);

  if (typeof value === 'object' && value !== null) {
    if (typeof value.toJSON === 'function') {
      return stringify(value.toJSON());
    } else if (Array.isArray(value)) {
      const arrayValues = value.map((v: any) => stringify(v, indent)).join(`,\n${spaces}`);
      return `[\n${spaces}${arrayValues}\n]`;
    } else {
      const objectValues = Object.entries(value)
        .map(([key, val]) => `${spaces}${stringify(key)}: ${stringify(val, indent)}`)
        .join(`,\n`);
      return `{\n${objectValues}\n}`;
    }
  } else if (typeof value === 'string') {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  } else {
    return String(value);
  }
};

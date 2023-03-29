import { Edge, Node } from "reactflow";


export const handleValue = (
  node: Node<any, string | undefined> | undefined,
  edges: Edge[],
  ids: string[]
) => {
  let idValueMap = Object();
  let value_id_map = Object();
  edges.map((e) => {
    value_id_map = {
      ...value_id_map,
      [e.targetHandle as any]: e.source,
    };
  });
  ids.map((e) => {
    idValueMap = {
      ...idValueMap,
      [e]: node?.data[String(value_id_map[e])],
    };
  });
  return idValueMap;
};

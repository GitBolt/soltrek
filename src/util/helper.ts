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

interface INode {
  /**
   * Unique id
  */
  id: string;
  /**
   * Displayed name
  */
  name: string;
  /**
   * value (e.g. activity)
  */
  value: number;
}

interface IEdge {
  /**
   * source node id
  */
  source: string;
  /**
   * target node id
  */
  target: string;
  /**
   * value
  */
  value: number;
}

interface IGraphData {
  /**
   * nodes
  */
  nodes: INode[];
  /**
   * edges
  */
  edges: IEdge[];
}

type NodeClickFunc = (node: INode) => void;

type GraphType = 'echarts' | 'antv';

type ThemeType = 'light' | 'dark';
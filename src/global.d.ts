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

type ThemeType = 'light' | 'dark';

type DeinitHandle =
  | { disconnect: VoidFunction }
  | { clear: VoidFunction }
  | { destroy: VoidFunction }
  | { abort: VoidFunction }
  | VoidFunction;
type Deinit = DeinitHandle | DeinitHandle[];

type FeatureID = string & { feature: true };
interface FeatureMeta {
  id: FeatureID;
  description: string;
  screenshot?: string;
}

declare namespace JSX {
  /* eslint-disable @typescript-eslint/no-redundant-type-constituents -- https://github.com/refined-github/refined-github/pull/5654#discussion_r878891540 */
  interface IntrinsicElements {
    'has-hypercrx': IntrinsicElements.div;
    'has-hypercrx-inner': IntrinsicElements.div;
  }
}

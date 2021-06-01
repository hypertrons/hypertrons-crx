import React, { useEffect, useContext, CSSProperties } from 'react';
import Graphin, { GraphinContext, Behaviors, IG6GraphEvent } from '@antv/graphin';
import { Tooltip } from '@antv/graphin-components';
import { INode as G6INode, NodeConfig } from '@antv/g6';
import { Persona, PersonaSize } from '@fluentui/react/lib/Persona';
import { getMessageI18n } from "../../../utils/utils"


interface GraphinWrapperProps {
  /**
   * data
   */
  readonly data: IGraphData;
  /**
   * layout option
   */
  readonly layoutOption?: any;
  /**
 * `style` for container
 */
  readonly style?: CSSProperties;
  /**
 * Graphin theme config
 */
  readonly theme?: "dark" | "light";
  /**
   * Callback function when click node
   */
  readonly onNodeClick: NodeClickFunc;
};

const TooltipForNode = () => {
  const { tooltip } = useContext(GraphinContext);
  const context = tooltip.node;
  const { item } = context;
  const model = item && item.getModel();

  return (
    <div style={{ border: "1px solid", borderRadius: "6px" }}>
      <div style={{ margin: '5px' }}>
        <Persona
          text={model.id}
          secondaryText={`${getMessageI18n("global_activity")}: ${model.value.toString()}`}
          size={PersonaSize.size24}
          showSecondaryText={true}
        />
      </div>
    </div>
  );
};

const TooltipForEdge = () => {
  const { tooltip } = useContext(GraphinContext);
  const context = tooltip.edge;
  const { item } = context;
  const model = item && item.getModel();
  return (
    <div style={{ border: "1px solid", borderRadius: "6px" }}>
      <div style={{ margin: '5px' }}>
        {`${model.source} > ${model.target} `}
        <strong>{model.value}</strong>
      </div>
    </div>
  );
};

const { ActivateRelations } = Behaviors;

type HandleClickNodeProps = {
  callback: NodeClickFunc
}
const HandleClickNode: React.FC<HandleClickNodeProps> = ({ callback }) => {
  const { graph } = useContext(GraphinContext);
  useEffect(() => {
    const handleClick = (event: IG6GraphEvent) => {
      // get node data
      const node = event.item as G6INode;
      const model = node.getModel() as NodeConfig;
      // callback
      callback(model as any);
    }
    graph.on('node:click', handleClick);
    return () => {
      graph.off('node:click', handleClick);
    };
  }, []);
  return null;
};

const GraphinWrapper: React.FC<GraphinWrapperProps> = ({
  data,
  layoutOption = {
    type: 'force',
    linkDistance: 100,
  },
  theme = 'light',
  style,
  onNodeClick
}) => {
  return (
    <div style={{ overflow: 'hidden', ...style }}>
      <Graphin
        data={data}
        theme={{ mode: theme }}
        layout={layoutOption}
      >
        <Tooltip bindType="node" placement="right" style={{ width: 'fit-content' }}>
          <TooltipForNode />
        </Tooltip>
        <Tooltip bindType="edge" placement="right" style={{ width: 'fit-content' }}>
          <TooltipForEdge />
        </Tooltip>
        <ActivateRelations activeState={'none'} />
        <HandleClickNode callback={onNodeClick} />
      </Graphin>
    </div>

  );
}

export default GraphinWrapper;

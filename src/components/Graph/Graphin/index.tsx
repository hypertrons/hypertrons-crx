import React, { useContext, CSSProperties } from 'react';
import Graphin, { GraphinContext, Behaviors } from '@antv/graphin';
import { Tooltip } from '@antv/graphin-components';
import { Persona, PersonaSize } from '@fluentui/react/lib/Persona';
import { getMessageI18n } from "../../../utils/utils"

interface GraphinWrapperProps {
  /**
   * data
   */
  readonly data: any;
  /**
   * layout option
   */
  readonly layoutOption: any;
  /**
 * `style` for container
 */
  readonly style?: CSSProperties;
  /**
 * Graphin theme config
 */
  readonly theme?: "dark" | "light";
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

const GraphinWrapper: React.FC<GraphinWrapperProps> = ({
  data,
  layoutOption,
  style,
  theme,
}) => {


  const newStyle = {
    overflow: 'hidden',
    ...style
  }
  return (
    <div style={newStyle}>
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
        <ActivateRelations activeState={'none'}/>
      </Graphin>
    </div>

  );
}

export default GraphinWrapper;

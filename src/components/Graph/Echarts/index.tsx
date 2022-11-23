import React, { useEffect, CSSProperties } from 'react';
import * as echarts from 'echarts';
import { debounce } from '../../../utils/utils';

interface EChartsWrapperProps {
  /**
   * echarts option
   */
  readonly option: any;
  /**
   * `style` for container
   */
  readonly style?: CSSProperties;
  /**
   * `className` for container
   */
  readonly className?: string;
  /**
   * echarts theme config
   */
  readonly theme?: 'light' | 'dark';
  /**
   * bind events, default is `{}`
   */
  readonly onEvents?: Record<
    string,
    {
      query?: string | Object;
      handler: Function;
    }
  >;
}

const EChartsWrapper: React.FC<EChartsWrapperProps> = ({
  option,
  style = {
    width: 500,
    height: 300,
  },
  className,
  theme,
  onEvents = {},
}) => {
  let ele: HTMLDivElement;

  /**
   * return the echart object
   * 1. if exist, return the existed instance
   * 2. or new one instance
   */
  const getEchartsInstance = () => {
    return echarts.getInstanceByDom(ele) || echarts.init(ele, theme);
  };

  /**
   * dispose the echart instance
   */
  const disposeEchartsInstance = () => {
    const instance = echarts.getInstanceByDom(ele);
    if (instance) {
      instance.dispose();
    }
  };

  /**
   * render and return a new echart instance
   */
  const renderNewEcharts = () => {
    const instance = getEchartsInstance();
    instance.setOption(option);
    const [debouncedResize, teardown] = debounce(() => {
      instance.resize();
    }, 500);
    window.addEventListener('resize', debouncedResize);
    // loop and bind events
    for (const eventName in onEvents) {
      if (Object.prototype.hasOwnProperty.call(onEvents, eventName)) {
        const query = onEvents[eventName].query;
        const handler = onEvents[eventName].handler;
        if (query) {
          instance.on(eventName, query, (param: any) => {
            handler(param.data);
          });
        } else {
          instance.on(eventName, (param: any) => {
            handler(param.data);
          });
        }
      }
    }
  };

  useEffect(() => {
    // dispose the old instance if exist
    disposeEchartsInstance();
    // render a new instance
    renderNewEcharts();
  }, [option, onEvents, theme]);

  return (
    <div
      ref={(e: HTMLDivElement) => {
        ele = e;
      }}
      style={style}
      className={className}
    />
  );
};

export default EChartsWrapper;

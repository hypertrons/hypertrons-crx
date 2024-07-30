import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import Graph from '../../../../components/Graph';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';

// 定义开发者和仓库的时间周期
const DEVELOPER_PERIOD = 90;
const REPO_PERIOD = 90;

// 定义Props接口，包括开发者网络和目标HTML
interface Props {
  developerNetwork: any;
  target: any;
}

// 定义图表样式
const graphStyle = {
  width: '296px',
  height: '400px',
};

const targetStyle = {
  width: '296px',
  height: '100px',
  display: "flex",
  "justify-content": "flex-start",
  "align-items": "flex-start",
  "align-content": "flex-start",
  "flex-wrap": "wrap",
};

const buttonStyle = {
  margin: "-5px 0px 10px 0px",
  padding: '8px',
  "border-radius": '15px',
};

// 定义View组件
const View = ({ developerNetwork, target}: Props): JSX.Element => {
  // 定义状态变量，包括选项、是否显示图表和是否显示仓库网络
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const [showGraph, setShowGraph] = useState(true);
  const [showRepoNetwork, setShowRepoNetwork] = useState(false);

  // 使用翻译函数
  const { t, i18n } = useTranslation();

  // 使用useEffect钩子来处理副作用，包括获取选项和改变语言
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  // 返回JSX元素，包括一个按钮和一个条件渲染的图表或目标HTML
  return (
    <div>
      <button onClick={() => setShowGraph(!showGraph)} style={buttonStyle}>
        切换视图
      </button>
      {showGraph ? (
        <div className="hypertrons-crx-border hypertrons-crx-container">
          <div className="d-flex flex-wrap flex-items-center" style={{ margin: '0 0 0 0', padding: "0"}}>
              <div style={{ margin: '0 0 0 0', padding: "0", display: "block"}}>
                <Graph data={developerNetwork} style={graphStyle} />
              </div>
          </div>
        </div>
      ) : (
            <div  dangerouslySetInnerHTML={{ __html: target }} style={ targetStyle} />
      )}
    </div>
  );
};

// 导出View组件
export default View;

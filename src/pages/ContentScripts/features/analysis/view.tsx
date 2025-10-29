import getGithubTheme from '../../../../helpers/get-github-theme';
import { isNull } from '../../../../helpers/is-null';
import { numberWithCommas } from '../../../../helpers/formatter';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import generateDataByMonth from '../../../../helpers/generate-data-by-month';
import { RepoMeta } from '../../../../api/common';
import React, { useState, useEffect } from 'react';
import { Popover } from 'antd';

import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
import isGithub from '../../../../helpers/is-github';
import AnalysisView from './analysisView';
const theme = isGithub() ? getGithubTheme() : 'light';

// ==================== 计算逻辑函数 ====================
/**
 * 缩放函数：将任意数值通过逻辑函数平滑地映射到 [0, 5] 区间。
 */
function scaleToFive(value: number, k: number = 0.5, midpoint: number = 10): number {
  const result = 5 / (1 + Math.exp(-k * (value - midpoint)));
  return result;
}

/**
 * 核心处理函数：接收包含所有图表数据的对象，返回计算后的分数。
 */
function processChartData(data: { [key: string]: [string, number][] }): { [key: string]: number } {
  const processedRatings: { [key: string]: number } = {};
  for (const key in data) {
    const dataArray = data[key];
    if (!dataArray || dataArray.length === 0) {
      processedRatings[key] = 0;
      continue;
    }
    const sum = dataArray.reduce((acc, [, value]) => acc + value, 0);
    if (sum === 0) {
      processedRatings[key] = 0;
      continue;
    }
    const logSum = Math.log(sum + 1);
    const rating = scaleToFive(logSum, 0.5, 10);
    processedRatings[key] = rating;
  }
  return processedRatings;
}
// =========================================================

interface Props {
  activity: any;
  openrank: any;
  attention: any;
  participant: any;
  contributor: any;
  meta: RepoMeta;
}

const View = ({ activity, openrank, attention, participant, contributor, meta }: Props): JSX.Element | null => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  if (isNull(activity) || isNull(openrank) || isNull(attention) || isNull(participant) || isNull(contributor))
    return null;

  const activityData = generateDataByMonth(activity, meta.updatedAt);
  const openrankData = generateDataByMonth(openrank, meta.updatedAt);
  const participantData = generateDataByMonth(participant, meta.updatedAt);
  const contributorData = generateDataByMonth(contributor, meta.updatedAt);
  const attentionData = generateDataByMonth(attention, meta.updatedAt);

  // --- 新增：在这里执行所有计算 ---
  // 1. 聚合所有月度数据
  const allChartData = {
    openrank: openrankData,
    activity: activityData,
    attention: attentionData,
    contributor: contributorData,
    participant: participantData,
  };

  // 2. 计算每个指标的 0-5 分数
  const calculatedRatings = processChartData(allChartData);

  // 3. 计算所有分数的平均值
  const ratingValues = Object.values(calculatedRatings);
  const averageRating =
    ratingValues.length > 0 ? ratingValues.reduce((sum, current) => sum + current, 0) / ratingValues.length : 0;
  // --- 计算结束 ---

  const starLogo = chrome.runtime.getURL('star.svg');

  const textColor = isGithub() ? (theme === 'light' ? '#24292F' : '#C9D1D9') : '#40485B';
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <div>
      <Popover
        content={
          <AnalysisView
            activity={activityData}
            openrank={openrankData}
            attention={attentionData}
            participant={participantData}
            contributor={contributorData}
            meta={meta}
            // 将计算出的单项分数传递给子组件
            ratings={calculatedRatings}
          />
        }
        trigger="click"
        placement="bottom"
        open={isMenuVisible}
        onOpenChange={setIsMenuVisible}
        arrow={false}
      >
        <div className="d-flex">
          <span className="Label Label--secondary v-align-middle mr-1 unselectable">
            <img
              className="icon"
              width={14}
              height={14}
              src={starLogo}
              style={{ float: 'left', marginRight: '2px', marginTop: '1.5px' }}
              alt="starLogo"
            />
            <span>
              {' '}
              Rate
              <span
                className="ml-2"
                style={{
                  fontSize: '10px',
                  width: '12px',
                  height: '12px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* 使用动态计算的平均分替换写死的 "4.0" */}
                {averageRating.toFixed(1)}{' '}
              </span>
            </span>
            <svg
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3456"
              width="10"
              height="10"
              style={{
                float: 'right',
                marginLeft: '2px',
                marginTop: '4.5px',
              }}
            >
              <path
                d="M511.3 64.9c-247.4 0-448 200.6-448 448s200.6 448 448 448 448-200.6 448-448-200.5-448-448-448z m0 806.4c-197.6 0-358.4-160.8-358.4-358.4s160.8-358.4 358.4-358.4 358.4 160.8 358.4 358.4S709 871.3 511.3 871.3z"
                p-id="3457"
                fill="#7e8690"
              ></path>
              <path
                d="M522.5 423.3c-24.7 0-44.8 20.1-44.8 44.8v224c0 24.7 20.1 44.8 44.8 44.8 24.7 0 44.8-20.1 44.8-44.8v-224c0-24.7-20-44.8-44.8-44.8zM522.5 288.9c-24.7 0-44.8 20.1-44.8 44.8 0 24.7 20.1 44.8 44.8 44.8 24.7 0 44.8-20.1 44.8-44.8 0-24.7-20-44.8-44.8-44.8z"
                p-id="3458"
                fill="#7e8690"
              ></path>
            </svg>
          </span>
        </div>
      </Popover>
    </div>
  );
};

export default View;

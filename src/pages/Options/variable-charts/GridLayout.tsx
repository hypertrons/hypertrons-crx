import React, { useState } from 'react';
import './GridLayout.css';
import LineChart from './LineChart';

const chartSize = ['', '1x2', '2x2', '2x3'];

const GridLayout = () => {
  // 定义网格布局的行列数
  const numRows = 3;
  const numCols = 5;

  // 定义每个网格的占用情况，初始时全部为空
  const [gridLayout, setGridLayout] = useState<number[]>(
    Array.from({ length: numRows * numCols }, () => 0)
  );

  //设置某个网格的占用情况
  const setGridItemSize = (index: number, size: number) => {
    const newGridLayout = [...gridLayout];
    newGridLayout[index] = size;
    setGridLayout(newGridLayout);
  };

  const newsize = 1;
  // 渲染网格布局
  const renderGrid = () => {
    const grid: JSX.Element[] = [];
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        const index = i * numCols + j;
        const size = gridLayout[index];

        grid.push(
          <div
            key={index}
            className={`grid-item size-${chartSize[size]}`}
            onClick={() => setGridItemSize(index, newsize)}
          >
            {/* 图表组件，根据占用情况来决定显示的内容 */}
            {size > 0 ? <LineChart /> : ''}
          </div>
        );
      }
    }
    return grid;
  };

  return (
    <div className="grid-container">
      <h2>3x5 Grid Layout</h2>
      <div className="grid">{renderGrid()}</div>
    </div>
  );
};

export default GridLayout;

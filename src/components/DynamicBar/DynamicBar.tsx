import React from 'react';
import { useEffect, useState, useRef } from 'react';
import * as ANI from 'anichart';
import { format } from 'd3';
import PlayButton from './PlayButton/PlayButton';

interface DynamicBarProps {
  theme: 'light' | 'dark';
  width: number;
  height: number;
  barNumber: number;
  digitNumber: number;
  dataUrl: string;
  duration: number;
  dateLabelSize: number;
}

const DynamicBar: React.FC<DynamicBarProps> = (props) => {
  const {
    theme,
    width,
    height,
    barNumber,
    digitNumber,
    dataUrl,
    duration,
    dateLabelSize,
  } = props;
  const canvasEL = useRef(null);
  const [playing, setPlaying] = useState(false);

  let stage: ANI.Stage;

  const play = () => {
    stage.interval = null;
    stage.sec = 0;
    stage.play();
    setPlaying(true);
    setTimeout(() => {
      setPlaying(false);
    }, (duration + 1) * 1000);
  };

  useEffect(() => {
    let idSet = new Set<string>();
    ANI.recourse.loadCSV(dataUrl, 'data').then(() => {
      ANI.recourse.setup().then(() => {
        ANI.recourse.data
          .get('data')
          .forEach((item: any) => idSet.add(item.id));
        idSet.forEach((username) => {
          ANI.recourse.loadImage(
            `https://avatars.githubusercontent.com/${username}?s=128&v=4`,
            username
          );
        });
      });
    });
  }, []);

  useEffect(() => {
    stage = new ANI.Stage(canvasEL.current as any);
    stage.options.fps = 30;
    stage.options.sec = duration;
    stage.output = false;

    const barChart = new ANI.BarChart({
      dataName: 'data',
      idField: 'id',
      showDateLabel: true,
      itemCount: barNumber,
      aniTime: [0, duration],
      swapDurationMS: 300,
      showRankLabel: false,
      margin: { left: 20, right: 20, top: 20, bottom: 20 },
      dateLabelOptions: {
        fontSize: dateLabelSize,
        fillStyle: '#777',
        textAlign: 'right',
        fontWeight: 'bolder',
        textBaseline: 'alphabetic',
        position: {
          x: stage.canvas.width - 20,
          y: stage.canvas.height - 20,
        },
      },
      valueFormat: (cData: any) => {
        return format(`,.${digitNumber}f`)(cData['value']);
      },
    });

    stage.addChild(barChart);
  });

  useEffect(() => {
    stage.render(duration);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <canvas width={width} height={height} ref={canvasEL} />
      <PlayButton
        hide={playing}
        theme={theme}
        size={dateLabelSize * 0.8}
        play={play}
      />
    </div>
  );
};
export default DynamicBar;

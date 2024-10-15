import Lottie from 'lottie-react';
import React, { useState } from 'react';

const LoadingAnimationEnd = require('./loading/bubble-end.json');

interface LoadingEndProps {
  children?: React.ReactNode;
  onComplete?: () => void;
}

const LoadingEnd: React.FC<LoadingEndProps> = (props) => {
  const { children, onComplete } = props;

  const [complete, setComplete] = useState(false);

  const handleComplete = () => {
    setComplete(true);
  };

  if (complete) {
    return <>{children}</>;
  }

  return (
    <div className="loading">
      <Lottie
        animationData={LoadingAnimationEnd}
        autoplay={true}
        loop={false}
        onComplete={handleComplete} // Call handleComplete upon completion of animation
      />
    </div>
  );
};

export default LoadingEnd;

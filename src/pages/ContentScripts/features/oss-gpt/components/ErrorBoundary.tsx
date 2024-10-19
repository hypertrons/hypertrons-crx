import React, { Component } from 'react';

class ErrorBoundary extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // 更新 state 以触发降级 UI
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // 你可以在这里记录错误信息，或者发送到外部监控服务
    console.error('Error in component:', error);
    console.error('Component stack:', info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // 渲染回退的 UI
      console.log(this.state);
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

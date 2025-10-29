import { useState } from 'react';
import { Layout, Menu, Button, Card } from 'antd';
import BasicLayout from '../Layout/BasicLayout';
// import "./analysisPage.css";

const { Sider, Content } = Layout;

const AnalysisPage = ({ repo }) => {
  return <BasicLayout repo={repo}></BasicLayout>;
};

export default AnalysisPage;

import { ConfigProvider } from '@ant-design/pro-editor';
import { useThemeMode } from 'antd-style';
import classNames from 'classnames';
import { createRef, memo } from 'react';
import CopyButton from './components/CopyButton';
import HighLighter from './components/HighLighter';
import LanguageTag from './components/LanguageTag';
import { useKeyDownCopyEvent } from './hooks/useKeyDownCopyEvent';

import { useStyles } from './style';
import { THEME_AUTO, ThemeType } from './theme';
import React from 'react';
const HIGHLIGHT_LANGUAGES = [
  'javascript',
  'typescript',
  'css',
  'json',
  'markdown',
  'xml',
  'yaml',
  'tsx',
  'jsx',
  'java',
  'python',
  'sql',
  'bash',
  'sh',
  'cpp',
  'php',
  'c',
];
export interface HighlightProps {
  /**
   * @description 样式
   * @ignore
   */
  style?: React.CSSProperties;
  /**
   * @description className 类名
   * @ignore
   */
  className?: string;
  /**
   * @title 指定语言
   * @description 指定语言
   * @renderType select
   * @default "typescript"
   */
  language?: string;
  /**
   * @title 主题
   * @description 主题颜色, dark 黑色主题，light 白色主题
   * @default "light"
   */
  theme?: ThemeType;
  /**
   * @title 高亮内容
   * @description 高亮内容
   */
  children?: any;
  /**
   * @title 是否使用要使用行号
   * @description 是否需要展示代码块左侧的行号
   * @default false
   */
  lineNumber?: boolean;
  /**
   * @title 是否展示复制按钮
   * @description 是否需要展示复制按钮
   * @default true
   */
  copyable?: boolean;
  /**
   * @title 复制按钮点击后回调
   */
  onCopy?: (children: any) => void;
  /**
   * 高亮类型
   */
  type?: 'pure' | 'block';
  /**
   * 是否需默认展示语言种类
   */
  showLanguage?: boolean;
}

const BaseHighlight: React.FC<HighlightProps> = memo((props) => {
  const {
    children,
    style,
    className,
    lineNumber = false,
    copyable = true,
    theme: outTheme = THEME_AUTO,
    language = 'tsx',
    showLanguage = true,
    type = 'block',
    onCopy,
  } = props;
  // 当为 auto 的时候，根据系统主题来判断
  const { appearance } = useThemeMode();
  const ProviderTheme = appearance === 'dark' ? 'dark' : 'light';
  const theme = outTheme === THEME_AUTO ? ProviderTheme : outTheme;
  const { styles } = useStyles({ theme, type });
  const emptyFunction = (children: any) => {};
  const codeRef = createRef<HTMLDivElement>();
  const safeOnCopy = onCopy ? onCopy : emptyFunction;

  useKeyDownCopyEvent(codeRef, safeOnCopy);

  return (
    <div ref={codeRef} tabIndex={-1} style={style} className={classNames(styles.container, className)}>
      {copyable && <CopyButton onCopy={onCopy} theme={theme} content={children} />}
      {showLanguage && language && <LanguageTag theme={theme}>{language.toLowerCase()}</LanguageTag>}
      <HighLighter lineNumber={lineNumber} language={language} theme={theme}>
        {children}
      </HighLighter>
    </div>
  );
});

const Highlight = (props: HighlightProps) => {
  return (
    <ConfigProvider>
      <BaseHighlight {...props} />
    </ConfigProvider>
  );
};

export { HIGHLIGHT_LANGUAGES, Highlight };

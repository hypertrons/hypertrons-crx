import { CopyButton } from '@ant-design/pro-chat';
import Spotlight from '../Spotlight';
import { ConfigProvider } from '@ant-design/pro-editor';
import { useThemeMode } from 'antd-style';
import { memo } from 'react';
import { DivProps } from 'react-layout-kit';
import { useStyles } from './style';
import React from 'react';
import HighLighter from '../Highlight/components/HighLighter';
export interface SnippetProps extends DivProps {
  /**
   * @description content area
   */
  children: string;
  /**
   * @description Does it support the ability to replicate
   * @default true
   */
  copyable?: boolean;
  /**
   * @description Specify the language type for rendering
   * @default 'tsx'
   */
  language?: string;
  /**
   * @description add a spotlight background
   * @default false
   */
  spotlight?: boolean;
  /**
   * @description Symbol symbol for initial rendering
   */
  symbol?: string;
  /**
   * @description The rendering type of the component
   * @default 'ghost'
   */
  type?: 'ghost' | 'block';
}

const BaseSnippet = memo<SnippetProps>((props) => {
  const {
    symbol = '$',
    language = 'tsx',
    children,
    copyable = true,
    type = 'ghost',
    spotlight,
    className,
    ...rest
  } = props;

  const { isDarkMode } = useThemeMode();
  const { styles, cx } = useStyles({
    type,
  });

  return (
    <div className={cx(styles.container, className)} {...rest}>
      {spotlight && <Spotlight />}
      <div className={styles.highlighter}>
        <HighLighter language={language} theme={isDarkMode ? 'dark' : 'light'}>
          {symbol ? [symbol, children].join(' ') : children}
        </HighLighter>
      </div>
      {copyable && <CopyButton content={children} />}
    </div>
  );
});

const Snippet = (props: SnippetProps) => {
  return (
    <ConfigProvider>
      <BaseSnippet {...props} />
    </ConfigProvider>
  );
};

export { Snippet };

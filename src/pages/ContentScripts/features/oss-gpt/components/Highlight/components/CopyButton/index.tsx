import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ThemeType } from '../../theme';
import { useStyles } from './style';
import React from 'react';
interface CopyButtonProps {
  content: any;
  /**
   * @title Call back after clicking the copy button
   */
  onCopy?: (content: any) => void;
  /**
   * @title theme
   * @description Theme color, dark black theme, light white theme
   * @default "light"
   */
  theme?: ThemeType;
  style?: React.CSSProperties;
}

const CopyButton: React.FC<CopyButtonProps> = (props) => {
  const { content, onCopy, theme = 'light', style } = props;
  const [copyId, setCopyId] = useState<number | undefined>();
  const { styles } = useStyles({ theme });

  useEffect(() => {
    return () => {
      window.clearTimeout(copyId);
    };
  });
  const [copied, setCopied] = useState(false);
  return (
    <>
      <CopyToClipboard
        text={content && content.length ? content : ''}
        onCopy={() => {
          setCopied(true);
          const tempCopyId = window.setTimeout(() => {
            setCopied(false);
          }, 2000);
          setCopyId(tempCopyId);
          if (onCopy) onCopy(content);
        }}
      >
        <button type={'button'} disabled={copied} className={styles.copy} style={style}>
          <CopyOutlined className={classNames(styles.copyIcon, { scoll: copied })} />
          <CheckOutlined className={styles.copyIcon} style={{ color: 'rgb(63,177,99)' }} />
        </button>
      </CopyToClipboard>
    </>
  );
};

export default CopyButton;

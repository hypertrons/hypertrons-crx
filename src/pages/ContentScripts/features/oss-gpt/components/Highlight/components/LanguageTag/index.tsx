import { ThemeType } from '../../theme';
import { Tag, type TagProps as AntTagProps } from 'antd';
import Color from 'color';
import { ReactNode } from 'react';
import { createStyles } from '@ant-design/pro-editor';
import { getThemeColor } from '../../theme/colors';
import React from 'react';
const useStyles = createStyles(({ cx, css, token, prefixCls }, props) => {
  const { theme } = props as { theme: unknown };
  const prefix = `${prefixCls}-${token.editorPrefix}-highlight`;

  const { colorFillTertiary, colorText, colorTextSecondary } = getThemeColor(theme === 'dark');

  const background = Color(colorFillTertiary)
    ?.mix(Color(theme === 'dark' ? 'white' : 'black'), 0.03)
    .alpha(0.9)
    .hsl()
    .string();

  return {
    small: cx(
      `${prefix}-tag-small`,
      css`
        padding: 2px 6px;
        line-height: 1;
      `
    ),
    lang: cx(css`
      position: absolute;
      z-index: 2;
      right: 0;
      bottom: 8px;
      background-color: ${background};
      font-family: ${token.fontFamilyCode};
      color: ${colorTextSecondary};
      transition: opacity 0.1s;
    `),
    tag: cx(
      `${prefix}-tag`,
      css`
        color: ${colorText} !important;
        border-radius: ${token.borderRadius}px;
        P &:hover {
          color: ${colorText};
          background: ${token.colorFill};
        }
      `
    ),
  };
});

export interface TagProps extends AntTagProps {
  icon?: ReactNode;
  size?: 'default' | 'small';
  theme?: ThemeType;
}

const LanguageTag: React.FC<TagProps> = (props) => {
  const { children, size = 'default', theme = 'light' } = props || {};
  const { styles, cx } = useStyles({ theme });

  return (
    <Tag bordered={false} className={cx(styles.tag, styles.lang, size === 'small' && styles.small)}>
      {children}
    </Tag>
  );
};

export default LanguageTag;

import { createStyles } from '@ant-design/pro-editor';
import { getThemeColor } from './theme/colors';

interface IHighlightStyleProps {
  type: 'pure' | 'block';
  theme: 'light' | 'dark' | 'auto';
}

export const useStyles = createStyles(({ css, cx, token, prefixCls }, { theme, type }: IHighlightStyleProps) => {
  const prefix = `${prefixCls}-${token?.editorPrefix}-highlight`;

  const { colorFillTertiary } = getThemeColor(theme === 'dark');

  const typeStylish = css`
    background-color: ${type === 'block' ? colorFillTertiary : 'transparent'};
  `;

  return {
    container: cx(
      `${prefix}-container`,
      typeStylish,
      css`
        position: relative;
        margin: 0;
        border-radius: ${token.borderRadius}px;
        transition: background-color 100ms ${token.motionEaseOut};

        :not(:hover) {
          .${prefix}-copy {
            visibility: hidden;
            opacity: 0;
          }

          .${prefix}-tag {
            visibility: hidden;
            opacity: 0;
          }
        }

        pre {
          margin: 0 !important;
          padding: ${type === 'pure' ? 0 : `16px 24px`} !important;
          background: none !important;
        }

        code {
          background: transparent !important;
        }
      `
    ),
  };
});

import { createStyles } from '@ant-design/pro-editor';
import { getThemeColor } from '../../theme/colors';

export const useStyles = createStyles(({ css, token, prefixCls, cx }, props) => {
  const { theme } = props as { theme: unknown };
  const prefix = `${prefixCls}-${token.editorPrefix}-highlight`;
  const { colorFillTertiary, colorText } = getThemeColor(theme === 'dark');

  return {
    copy: cx(
      `${prefix}-copy`,
      css`
        position: absolute;
        top: 16px;
        right: 16px;
        display: flex;
        flex-direction: column;
        width: 16px;
        height: 16px;
        padding: 0;
        overflow: hidden;
        border: 0;
        outline: none;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.2s;
        background-color: ${colorFillTertiary};

        &:hover {
          opacity: 0.8;
        }
      `
    ),
    copyIcon: cx(
      `${prefix}-copy-icon`,
      css`
        width: 16px;
        color: ${colorText};
        height: 16px;
        font-size: 16px;

        @keyframes copy-button-trans {
          0% {
            margin-top: 0;
            opacity: 0.8;
          }
          10% {
            margin-top: -16px;
            opacity: 0.8;
          }
          90% {
            margin-top: -16px;
            opacity: 0.8;
          }
          100% {
            margin-top: 0;
            opacity: 0.8;
          }
        }

        &.scoll {
          animation: copy-button-trans 2s;
          animation-play-state: running;
        }
      `
    ),
  };
});

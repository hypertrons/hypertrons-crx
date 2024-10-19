import { createStyles } from '@ant-design/pro-editor';
export const useStyles = createStyles(({ css, cx, token, prefixCls }, props) => {
  const { type } = props as { type: unknown };
  const typeStylish = css`
    background-color: ${type === 'block' ? token.colorFillTertiary : 'transparent'};
    border: 1px solid ${type === 'block' ? 'transparent' : token.colorBorder};
  `;

  const BasePrefix = `${prefixCls}-${token?.editorPrefix}`;
  const prefix = `${BasePrefix}-snippet`;

  return {
    container: cx(
      `${prefix}-container`,
      typeStylish,
      css`
        position: relative;
        overflow: hidden;
        display: inline-flex;
        gap: 8px;
        align-items: center;
        max-width: 100%;
        height: 38px;
        padding: 0 8px 0 12px;

        border-radius: ${token.borderRadius}px;

        transition: background-color 100ms ${token.motionEaseOut};

        &:hover {
          background-color: ${token.colorFillTertiary};
        }

        pre {
          overflow-x: auto !important;
          overflow-y: hidden !important;
          display: flex;
          align-items: center;

          width: 100%;
          height: 36px !important;
          margin: 0 !important;

          line-height: 1;

          background: none !important;
        }

        code[class*='language-'] {
          background: none !important;
        }
      `
    ),
    highlighter: cx(
      `${prefix}-highlighter`,
      css`
        position: relative;
        overflow: hidden;
        flex: 1;
      `
    ),
  };
});

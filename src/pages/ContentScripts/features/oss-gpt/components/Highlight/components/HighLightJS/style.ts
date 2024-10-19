import { createStyles } from '@ant-design/pro-editor';
import { getThemeColor } from '../../theme/colors';

export const useStyles = createStyles(({ css, cx }, theme) => {
  const { colorBlue, colorGreen, colorOrange, colorRed, colorText, colorTextSecondary, colorTextTertiary } =
    getThemeColor(theme === 'dark');

  return {
    theme: cx(css`
      display: block;
      overflow-x: auto;
      color: ${colorText};
      background-color: ${colorTextSecondary};

      /* Comment */
      .hljs-comment,
      .hljs-quote {
        color: ${colorTextTertiary};
      }

      /*  Red */
      .hljs-variable,
      .hljs-attribute,
      .hljs-template-variable,
      .hljs-tag,
      .hljs-name,
      .hljs-selector-id,
      .hljs-selector-class,
      .hljs-regexp,
      .hljs-title,
      .hljs-deletion {
        color: ${colorRed};
      }

      /* Orange */

      .hljs-builtin-name,
      .hljs-literal,
      .hljs-type,
      .hljs-params,
      .hljs-meta,
      .hljs-link {
        color: ${colorOrange};
      }

      /* Green */
      .hljs-string,
      .hljs-number,
      .hljs-symbol,
      .hljs-bullet,
      .hljs-addition {
        color: ${colorGreen};
      }

      /* Blue */
      .hljs-keyword,
      .hljs-doctag,
      .hljs-built_in,
      .hljs-selector-tag,
      .hljs-section {
        color: ${colorBlue};
      }

      .hljs-emphasis {
        font-style: italic;
      }

      .hljs-strong {
        font-weight: bold;
      }
    `),
  };
});

import { Snippet } from '../Snippet';
import { createStyles } from 'antd-style';
import { memo } from 'react';
import HighlightWrapper from './wrapper';
import React from 'react';
const useStyles = createStyles(({ css }) => ({
  container: css`
    :not(:last-child) {
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
    }
  `,
  highlight: css`
    pre {
      padding: 12px !important;
    }
  `,
}));

const countLines = (str: string): number => {
  const regex = /\n/g;
  const matches = str.match(regex);
  return matches ? matches.length : 1;
};

export const Code = memo((properties: any) => {
  const { styles, cx } = useStyles();

  if (!properties.children[0]) return null;

  const { children, className } = properties.children[0].props;

  if (!children) return null;

  const content = Array.isArray(children) ? (children[0] as string) : children;
  const lang = className?.replace('language-', '') || 'txt';
  console.log(countLines(content));
  if (countLines(content) === 1 && content.length <= 60) {
    return (
      <Snippet
        className={cx(styles.container)}
        style={{
          display: 'flex',
        }}
        data-code-type="highlighter"
        language={lang}
        symbol={''}
        type={'block'}
      >
        {content}
      </Snippet>
    );
  }

  return (
    <HighlightWrapper className={cx(styles.container, styles.highlight)} language={lang}>
      {content}
    </HighlightWrapper>
  );
});

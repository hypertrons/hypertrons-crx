/**
 *Highlighting ability based on the syntax parsing capability of highlight.exe https://highlightjs.org/
 *The well-known languages I have heard of are included in Langugaes. If you need to add a new language, please add it to the languages folder and import it for use, and add it to the languageMap
 *If not in https://github.com/highlightjs/highlight.js/tree/master/src/languages Check if it is supported and then add it
 *Priority support for mainstream languages, those used in code without imports will not be packaged
 */
import classNames from 'classnames';
import { memo, useEffect, useState } from 'react';
import { useHighlight, LanguageKeys, languageMap } from '../../hooks/useHighlight';
import { HighlightProps } from '../../index';
import { THEME_LIGHT } from '../../theme';
import HighlightCell from '../HighlightCell';
import { useStyles } from './style';
import React from 'react';
export type HighLighJSProps = Pick<HighlightProps, 'language' | 'children' | 'theme' | 'lineNumber'>;
const isValidLanguage = (lang: string): lang is LanguageKeys => {
  return Object.keys(languageMap).includes(lang);
};

const HighLighJS: React.FC<HighLighJSProps> = memo((props) => {
  const { children, lineNumber = false, theme = THEME_LIGHT, language } = props;
  const [codeBlock, setCodeBlock] = useState<JSX.Element[]>([]);
  const { styles } = useStyles(theme);
  let validLanguage: LanguageKeys | undefined;
  if (language && isValidLanguage(language)) {
    validLanguage = language; // Now the validLanguage type is LanguageKeys | undefined
  }
  const { renderHighlight } = useHighlight(validLanguage);

  const highlightCode = () => {
    // Skip rendering when data is empty
    if (!children) {
      return;
    }

    // Construct a table to display the codeblock
    const value = renderHighlight(children);
    const lines = value.split(/\r?\n/);
    let nonEmptyIndex = lines.length - 1;
    while (nonEmptyIndex >= 0 && lines[nonEmptyIndex].trim() === '') {
      nonEmptyIndex--;
    }
    const sourceData = lines.slice(0, nonEmptyIndex + 1);
    // The content required to construct the entire list (line numbers and content)
    const rowList = sourceData.map((rowValue, index) => ({
      value: rowValue,
      index: index + 1,
    }));
    setCodeBlock(
      rowList.map((src, index) => {
        return (
          <tr key={index}>
            <HighlightCell lineNumber={lineNumber} data={src} />
          </tr>
        );
      })
    );
  };

  // Trigger re rendering
  useEffect(() => {
    highlightCode();
  }, [children, theme, language, lineNumber]);

  return (
    <pre className={classNames(styles.theme)}>
      <table border={0} cellPadding={0} cellSpacing={0}>
        <tbody>{codeBlock}</tbody>
      </table>
    </pre>
  );
});

export default HighLighJS;

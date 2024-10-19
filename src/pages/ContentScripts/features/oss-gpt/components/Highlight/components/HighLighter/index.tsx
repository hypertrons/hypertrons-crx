/**
 *Highlighting ability based on the syntax parsing capability of highlight.exe https://highlightjs.org/
 *The well-known languages I have heard of are included in Langugaes. If you need to add a new language, please add it to the languages folder and import it for use, and add it to the languageMap
 *If not in https://github.com/highlightjs/highlight.js/tree/master/src/languages Check if it is supported and then add it
 *Priority support for mainstream languages, those used in code without imports will not be packaged
 */
import { THEME_LIGHT } from '../../theme';
import { memo, useMemo } from 'react';
import { HighlightProps } from '../../index';
import HighLightJS from '../HighLightJS';
import React from 'react';
export type Props = Pick<HighlightProps, 'language' | 'children' | 'theme' | 'lineNumber' | 'className' | 'style'>;

const HighLighter: React.FC<Props> = memo((props) => {
  const { children, lineNumber = false, theme = THEME_LIGHT, language } = props;

  const HighlightJSBlock = useMemo(
    () => (
      <HighLightJS lineNumber={lineNumber} theme={theme} language={language}>
        {children}
      </HighLightJS>
    ),
    [lineNumber, theme, language, children]
  );

  return HighlightJSBlock;
});

export default HighLighter;

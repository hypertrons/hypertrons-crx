import { useEffect, useRef } from 'react';

/**
 *The ability to select all buttons when adding focus to Highlight
 * @param codeRef: React. RefObject<HTMLPreElement>
 */

export const useKeyDownCopyEvent = (
  codeRef: React.RefObject<HTMLPreElement | HTMLDivElement>,
  onCopy: (children: any) => void
) => {
  //Focus capability support
  const focus = useRef<boolean>();

  function bindEvent(events: any, dom: any) {
    Object.keys(events).forEach((key) => {
      if (typeof events[key] === 'object' && events[key].handle) {
        dom.addEventListener(key, events[key].handle, events[key].options);
      } else {
        dom.addEventListener(key, events[key]);
      }
    });
    return function () {
      Object.keys(events).forEach((key) => {
        if (typeof events[key] === 'object' && events[key].handle) {
          dom.removeEventListener(key, events[key].handle, events[key].options);
        } else {
          dom.removeEventListener(key, events[key]);
        }
      });
    };
  }

  useEffect(() => {
    if (codeRef.current) {
      return bindEvent(
        {
          keydown: (ev: any) => {
            const selection = window.getSelection();
            //Intercept Ctrl+A and determine if it is focused
            if ((ev.ctrlKey || ev.metaKey) && ev.code === 'KeyA' && focus.current && codeRef.current) {
              const range = document.createRange();
              range.selectNodeContents(codeRef.current);
              selection?.removeAllRanges();
              selection?.addRange(range);
              ev.preventDefault();
            }

            if ((ev.ctrlKey || ev.metaKey) && ev.code === 'KeyC' && focus.current && codeRef.current) {
              if (onCopy && selection) {
                onCopy(selection.toString());
              }
            }
          },
          focus: () => {
            focus.current = true;
          },
          blur: () => {
            focus.current = false;
          },
        },
        codeRef.current
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeRef.current, codeRef]);

  return null;
};

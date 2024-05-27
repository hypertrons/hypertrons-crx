import React, { PropsWithChildren, useEffect } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import elementReady from 'element-ready';
import $ from 'jquery';

interface NativePopoverProps extends PropsWithChildren<any> {
  anchor: JQuery<HTMLElement>;
  width: number;
  // for now, only support top-middle
  arrowPosition: 'top-left' | 'top-middle' | 'top-right' | 'bottom-left' | 'bottom-middle' | 'bottom-right';
}

export const NativePopover = ({ anchor, width, arrowPosition, children }: NativePopoverProps): JSX.Element => {
  useEffect(() => {
    (async () => {
      await elementReady('div.Popover');
      await elementReady('div.Popover-message');
      const $popoverContainer = $('div.Popover');
      const $popoverContent = $('div.Popover-message');
      let popoverTimer: NodeJS.Timeout | null = null;
      let leaveTimer: NodeJS.Timeout | null = null;

      const showPopover = () => {
        popoverTimer = setTimeout(() => {
          const anchorOffset = anchor.offset();
          const anchorWidth = anchor.outerWidth();
          const anchorHeight = anchor.outerHeight();
          if (!anchorOffset || !anchorHeight || !anchorWidth) {
            return;
          }
          const { top, left } = anchorOffset;

          $popoverContent.css('padding', '10px 5px');
          $popoverContent.css('width', width);
          $popoverContainer.css('top', `${top + anchorHeight + 10}px`);
          $popoverContainer.css('left', `${left - (width - anchorWidth) / 2}px`);
          $popoverContent.attr('class', `Popover-message Box color-shadow-large Popover-message--${arrowPosition}`);
          render(children, $popoverContent[0]);
          $popoverContainer.css('display', 'block');
        }, 1000);
      };

      const hidePopover = () => {
        popoverTimer && clearTimeout(popoverTimer);
        $popoverContent.addClass('Popover-message--large');
        if ($popoverContent.children().length > 0) {
          unmountComponentAtNode($popoverContent[0]);
        }
        $popoverContainer.css('display', 'none');
      };

      anchor[0].addEventListener('mouseenter', () => {
        popoverTimer = null;
        leaveTimer && clearTimeout(leaveTimer);
        showPopover();
      });

      anchor[0].addEventListener('mouseleave', () => {
        leaveTimer = setTimeout(hidePopover, 200);
      });

      anchor[0].addEventListener('click', () => {
        hidePopover();
      });

      $popoverContainer[0].addEventListener('mouseenter', () => {
        leaveTimer && clearTimeout(leaveTimer);
      });

      $popoverContainer[0].addEventListener('mouseleave', () => {
        leaveTimer = setTimeout(hidePopover, 200);
      });
    })();
  }, []);

  return <></>;
};

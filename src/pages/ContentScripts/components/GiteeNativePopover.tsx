import React, { PropsWithChildren, useEffect } from 'react';
import { createRoot, Root } from 'react-dom/client';
import $ from 'jquery';

let root: Root | null = null;

interface GiteeNativePopoverProps extends PropsWithChildren<any> {
  anchor: JQuery<HTMLElement>;
  width: number;
  arrowPosition: string;
}

export const GiteeNativePopover = ({
  anchor,
  width,
  arrowPosition,
  children,
}: GiteeNativePopoverProps): JSX.Element => {
  useEffect(() => {
    (async () => {
      const $popoverContainer = $(`
        <div class="popper-profile-card" x-placement="${arrowPosition}-start" style="position: absolute; display: none; min-height: unset; max-height: unset; min-width: unset; max-width: unset;">
          <div class="ui active loader hidden"></div>
          <div x-arrow="" class="popper__arrow"></div>
          <div class="popper-profile-card__body" style="display: flex; flex-direction: column; padding: 10px 5px;">
            <div class="popper-profile-card__content"></div>
          </div>
        </div>
      `).appendTo('body');

      const $popoverContent = $popoverContainer.find('.popper-profile-card__body');
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
          $popoverContainer.css({
            top: `${top + anchorHeight}px`,
            left: `${left - (width - anchorWidth) / 2}px`,
            display: 'block',
            transform: `translate3d(0, 0, 0)`,
            height: 'auto',
            width: width,
          });

          if (root == null) {
            root = createRoot($popoverContent[0]);
          }
          root.render(children);
        }, 1000);
      };

      const hidePopover = () => {
        popoverTimer && clearTimeout(popoverTimer);
        if (root) {
          root.unmount();
          root = null;
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

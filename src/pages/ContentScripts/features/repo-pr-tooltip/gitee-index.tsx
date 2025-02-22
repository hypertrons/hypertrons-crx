const init = async (): Promise<void> => {
  platform = getPlatform();
  repoName = getRepoName();
  await getData();

  await elementReady('.star-container .button');
  const $starButtons = $('.star-container .button.star, .star-container .button.unstar');
  const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];
  createRoot(placeholderElement).render(
    <GiteeNativePopover anchor={$starButtons} width={340} arrowPosition="bottom">
      <View currentRepo={repoName} PRDetail={PRDetail} meta={meta} />
    </GiteeNativePopover>
  );
};

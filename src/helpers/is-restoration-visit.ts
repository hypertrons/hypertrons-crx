/**
 * There are two types of `turbo:visit`: "Restoration Visits" and "Application Visits",
 * and we can get the visit type by reading the `detail` property of `turbo:visit` event.
 * For more info, see https://turbo.hotwired.dev/handbook/building#understanding-caching
 */
let visitType: 'advance' | 'restore';

// the variable will be modified after each turbo:visit
document.addEventListener('turbo:visit', ((event: CustomEvent) => {
  visitType = event.detail.action;
}) as EventListener);

// so this function can return the right visitType whenever called
export default function isRestorationVisit() {
  return visitType === 'restore' ? true : false;
}

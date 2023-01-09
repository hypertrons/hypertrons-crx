import $ from 'jquery';

// a small wrapper for checking if a DOM element exists
export default function exists(selector: string) {
  return $(selector).length > 0;
}

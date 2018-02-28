/****************************************
Author
Eric Tanaka
----------------------------------------
Description
Adds the SECTION ID to all child image and link elements.
This will allow easier finding of elements when in Website Manager
----------------------------------------
Update Log
- Updated code with more comments - Eric Tanaka - 2-15-2018
- Added code to add custom div to webpage - Eric Tanaka - 2/20/2018
****************************************/

// get the 'main' section of the webpage
const myBody = document.querySelector('body > main');
// save all img and hyperlinks in the 'main' section
let domElements = myBody.querySelectorAll('img,a');
// loop through each img and hyperlinks
for (let z = 0; z < domElements.length; z += 1) {
  // add a 'parent-id' attribute to all img and link elements
  domElements[z].dataset.parentId = domElements[z].closest('section')
    .id;
}
// create DOM element to webpage to visually show custom script has run
let myDiv = document.createElement('div');
myDiv.id = 'addParentIdToElementMarker';
myDiv.innerHTML = 'Parent IDs Added';
myDiv.style.padding = '10px';
myDiv.style.textAlign = 'center';
myDiv.style.fontSize = '16px';
// add custom DOM element
jQuery(document.body)
  .before(myDiv);
// get the page height
let docHeight = jQuery(document)
  .height();
// scroll to the bottom of the page
jQuery('html, body')
  .animate({
    "scrollTop": docHeight
  });

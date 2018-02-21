/****************************************
Author : Eric Tanaka
----------------------------------------
Description : Adds the SECTION ID to all child image and link elements.
This will allow easier finding of elements when in Website Manager
----------------------------------------
Update Log : Updated code with more comments - Eric Tanaka - 2-15-2018
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
myDiv.innerHTML = `Parent ID's Added`;
// add custom DOM element
jQuery(document.body)
  .before(myDiv);

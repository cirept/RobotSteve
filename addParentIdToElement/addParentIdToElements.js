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

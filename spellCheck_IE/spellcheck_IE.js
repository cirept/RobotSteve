// (function () {
// 'use strict';

// var typoJS = document.createElement('script');
// typoJS.id = 'typoJS';
// typoJS.src = 'https://cdn.rawgit.com/cirept/Typo.js/master/typo/typo.js';

// document.head.appendChild(typoJS);

/**
 * traverses the DOM and grabs all visible text
 * @return {Object} All the visible text on the page
 */
function treeWalk() {

  var treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  var wordArray = [];

  // loop through node elements read by tree walker object
  while (treeWalker.nextNode()) {
    // save jquery element, parent node name of current node
    let $pElementName = jQuery(treeWalker.currentNode)[0].parentNode.nodeName;
    // check to see if the parent node is a SCRIPT, NOSCRIPT, or SYLE element
    if ($pElementName !== 'NOSCRIPT' && $pElementName !== 'SCRIPT' && $pElementName !== 'STYLE') {
      // remember text node
      wordArray.push(treeWalker.currentNode);
    }
  }

  return wordArray;
}

/**
 * Escapes all characters
 * @param {String} word - the word that will get characters escaped
 * @retrun {String} the new string text with all the characters escaped
 */
function clean(word) {

  return word.replace('â€™', '\'')
    .replace(/^'*(.*?)'*$/, '$1')
    .replace('_', '');
}

/**
 *  Gets all text on page and tests words against custom dictionary
 *  @param {Object} dictionary - the dictionary object that contains
 *  all the custom words
 */
function spellCheckPage(dictionary) {
  // define local variables
  var wordList = [];
  var text;
  var words;
  var unmarked;

  // get all visible text on page
  wordList = treeWalk();

  // loop through each block of text and DO WORK to it.
  // a BLOCK of text is all text that appears in a single DOM element
  // example : <p>THIS IS THE BLOCK TEXT</p>
  wordList.forEach(function (n) {

    // this is the work that will be applied to each word //
    text = n.nodeValue;
    words = text.match(/['\w]+/g);

    // skip iteration if no words are found
    if (!words) {
      return;
    }

    // search each word in array for dictionary match
    // flag word if not found in dictionary
    words.forEach(function (word) {

      // check if word is in the dictionary AND if it IS NOT a number
      if (!dictionary.check(clean(word)) && !(/^\d+$/)
        .test(word)) {

        // build the REGULAR EXPRESSION to find the custom word
        // purposely DID NOT include the 'i' tag, because some custom words
        // will be proper nouns and SHOULD be capitalized.
        unmarked = new RegExp('\\b' + word + '(?!@~~)\\b', 'g');

        // replace all matching text with custom markers
        // it will look like this : ~~@MATCHED_WORD@~~
        text = text.replace(unmarked, '~~@$&@~~');
      }
    });

    // Save the changes back into the webpage for viewing
    n.nodeValue = text;

  });
}

/**
 *   Create and add visual element to webpage when spell checking has completed
 *   This is specifically for Blue Prism, as a way to identify when the spell checking
 *   has been completed.
 */
function addFlag() {
  let myFlag = document.createElement('div');
  myFlag.id = 'spellCheckComplete';
  myFlag.innerHTML = 'spellCheckComplete';

  jQuery('body')
    .prepend(myFlag);
}
/**
 *   Run spell check on the page by building the custom dictionary THEN
 *   running the spell check on the page once the dictionary has been built
 */
function runSpellCheck() {

  // define local variables
  // let affDataURL = 'https://rawgit.com/cirept/Typo.js/master/typo/dictionaries/en_US/en_US.aff';
  let affDataURL = 'https://raw.githubusercontent.com/cirept/Typo.js/master/typo/dictionaries/en_US/en_US.aff';
  // let dicDataURL = 'https://rawgit.com/cirept/Typo.js/master/typo/dictionaries/en_US/en_US.dic';
  let dicDataURL = 'https://raw.githubusercontent.com/cirept/Typo.js/master/typo/dictionaries/en_US/en_US.dic';

  // define function to retreive custom AFF file for the custom dictionary
  let getAffData = function (callBack) {
    // get the prefix and suffix information from the AFF file
    jQuery.get(affDataURL, callBack);
  };

  // call the getAffData function
  getAffData(function (dataAff) {
    // define function to get the custom DICTIONARY file for the custom dictionary
    let getDicData = function (callBack) {
      // get the WORD information from the DIC file
      jQuery.get(dicDataURL, callBack);
    };

    // call the getDicData function
    getDicData(function (dataDic) {
      // build typo object
      let dictionary = new Typo('en_US', dataAff, dataDic);
      // Run spell check on page
      spellCheckPage(dictionary);
      // add visual flag to page
      addFlag();

      let matches = document.body.innerHTML.match(/(~~@\w+)@~~/g);
      // console.log(matches);
      // /(~~@\w+)@~~/g
    });
  });
}

// Run
// window.onload = runSpellCheck();
runSpellCheck();

// })();


//(function () {
    //'use strict';

	/**
	* The typo.js file is located on the MLM.
	* While logged into the MLM, Search By "Library" and Search For "RPA_Scripts"
	*/
    //var typoJS = document.createElement('script');
    //typoJS.id = 'typoJS';
    //typoJS.src = 'https://media-dmg.assets-cdk.com/teams/repository/export/75a/d23c0c763100582500050568b6442/75ad23c0c763100582500050568b6442.js';

    //document.head.appendChild(typoJS);

    /**
     * traverses the DOM and grabs all visible text
     * @return {(object:array)} All the visible text on the page
     */
    function treeWalk() {
        // declare treewalker object
        var treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

        var wordArray = [];

        // loop through DOM element via treewalker
        while (treeWalker.nextNode()) {

            // get computed CSS style and compare
		if (treeWalker.currentNode.nodeValue.trim() !== '' && treeWalker.currentNode.parentNode.nodeName !== 'SCRIPT' && treeWalker.currentNode.parentNode.nodeName !== 'STYLE' && treeWalker.currentNode.parentNode.nodeName !== 'IFRAME') {
                // save TEXT NODE if parent element is VISIBLE
                wordArray.push(treeWalker.currentNode);
            }
        }

        return wordArray;
    }

    function clean(word) {

        return word.replace('â€™', '\'')
            .replace(/^'*(.*?)'*$/, '$1')
            .replace('_', '');
    }

    /**
     * Gets all text on page and tests words against custom dictionary
     */
    function spellCheckPage(dictionary) {
        // define local variables
        var wordList = [];
        var text;
        var words;
        var unmarked;
		var misspelledWords = [];

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
                if (!dictionary.check(clean(word)) && !(/^\d+$/).test(word)) {

                    // build the REGULAR EXPRESSION to find the custom word
                    // purposely DID NOT include the 'i' tag, because some custom words
                    // will be proper nouns and SHOULD be capitalized.
                    unmarked = new RegExp('\\b' + word + '(?!~~)\\b', 'g');
					
                    // replace all matching text with custom markers
                    // it will look like this : ~~MATCHED_WORD~~
                    text = text.replace(unmarked, '~~$&~~');

					// Save the misspelled words
					misspelledWords.push(word);
                }
            });

            // Save the changes back into the webpage for viewing
            n.nodeValue = text;

        });
		
    }

	/**
	*   Creates a new array without any duplicates
	*   @param {Object} arr - the array to filter out the duplicates
	*   @return {Object} unique_array - a new array with no duplicates
	*/
	function removeDuplicate(arr){
		let unique_array = arr.filter(function(elem, index, self) {
			return index == self.indexOf(elem);
		});
		return unique_array;
	}

	/**
	*	Display the misspelled word list on the page
	*/
	function displayMisspelledWords (arr){
		var newArr = removeDuplicate(arr);
		jQuery(document.body).prepend('<div id="myDisplay"></div>');
		var addMe = '';
		
		//jQuery('#myDisplay').html('');
		newArr.forEach(function(el){
			addMe += el + '<br>';   
		});
		
		//document.getElementById('myDisplay').innerText(addMe);
		jQuery('#myDisplay').html(addMe);
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

        jQuery('body').prepend(myFlag);
    }
    /**
     *   Run spell check on the page by building the custom dictionary THEN
     *   running the spell check on the page once the dictionary has been built
     */
    function runSpellCheck() {

        // define local variables
        let affDataURL = 'https://media-dmg.assets-cdk.com/teams/repository/export/3c6/ffdd8ca35100582500050568ba825/3c6ffdd8ca35100582500050568ba825.aff';
        let dicDataURL = 'https://media-dmg.assets-cdk.com/teams/repository/export/3ba/0de68ca35100582500050568ba825/3ba0de68ca35100582500050568ba825.dic';
		               // https://rawgit.com/cirept/Typo.js/master/typo/dictionaries/en_US/en_US.dic
					   // https://github.com/cirept/Typo.js/raw/master/typo/dictionaries/en_US/en_US.dic
					   // https://rawgit.com/cirept/Typo.js/master/typo/dictionaries/en_US/en_US.aff
					   // https://github.com/cirept/Typo.js/raw/master/typo/dictionaries/en_US/en_US.aff

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
            });
        });
		
		//const myRegex = /~~@(?=\S*['-])([a-zA-Z'-]+)|(\w+)@~~/g;
		//const myRegex2 = new RegExp("~~@(?=\S*[\'-])([a-zA-Z\'-]+)|(\w+)@~~","g");
		//var matches = myRegex.exec(document.body.innerText);
		
    }

    // Run
    //window.onload = runSpellCheck();

//})();

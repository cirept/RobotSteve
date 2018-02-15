(function (d) {
  const myScript = d.createElement('script');
  myScript.type = 'text/javascript';
  myScript.async = true;
  myScript.src = 'https://cdn.rawgit.com/cirept/RobotSteve/addParentIdToElements/spellcheck_IE.js';
  myScript.id = 'addParentIdToElements';
  myScript.onload = function () {

    console.log('addParentIdToElements loaded');
    const typoJS = d.createElement('script');
    typoJS.type = 'text/javascript';
    typoJS.async = true;
    typoJS.src = 'https://cdn.rawgit.com/cirept/Typo.js/master/typo/typo.js';
    typoJS.id = 'typoJS';
    typoJS.onload = function () {

      console.log('typoJS loaded');
    };

    d.getElementsByTagName('head')[0].appendChild(typoJS);
  };
  d.getElementsByTagName('head')[0].appendChild(myScript);
})(document);

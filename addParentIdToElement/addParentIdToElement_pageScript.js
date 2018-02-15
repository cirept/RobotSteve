(function (d) {
  const myScript = d.createElement('script');
  myScript.type = 'text/javascript';
  myScript.async = true;
  myScript.onload = function () {
    console.log('addParentIdToElements loaded');
  };
  myScript.src = 'https://rawgit.com/cirept/RobotSteve/addParentIdToElements/addParentIdToElement/addParentIdToElements.js';
  myScript.id = 'addParentIdToElements';
  d.getElementsByTagName('head')[0].appendChild(myScript);
})(document);

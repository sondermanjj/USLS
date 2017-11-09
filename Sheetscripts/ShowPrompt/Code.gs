/*
* @desc - 
* @params - 
* @author - 
*/
function showPrompt(text, okayFunction, cancelFunction) {
//  var text = "Testing to make sure it works";
  var html = HtmlService.createTemplateFromFile('Sheetscripts/ShowPrompt/HTML').evaluate();
  html.append("<div id='prompt'>");
  html.append("<p id='label'>" + text + "</p>");
  html.append("<input class='action' id='cancelButton' type='button' onClick='cancel()' value='Cancel' />");
  html.append("<input class='action' id='okayButton' type='button' onClick='okay()' value='Okay' />");
  html.append("<script> function okay() {  google.script.run.withSuccessHandler(closePopup)." + okayFunction.name + "(); } </script>");
  html.append("<script> function cancel() {  google.script.run.withSuccessHandler(closePopup)." + cancelFunction.name + "(); } </script>");
  html.append("</div></body></html>");
  SpreadsheetApp.getUi().showModalDialog(html, ' '); 
}

function a() {
  showPrompt("This better work", betterWork, betterCancel);
}

function betterWork(){
  Logger.log("Yea boi, worked");
}

function betterCancel() {
  Logger.log("Yea boi, canceled");
}
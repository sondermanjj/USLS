/*
* @desc - 
* @params - 
* @author - 
*/
function showPrompt(text, okayFunction, cancelFunction) {
//  var text = "Testing to make sure it works";
  var html = HtmlService.createTemplateFromFile('Sheetscripts/ShowPrompt/HTML').evaluate();
  html.append("<p id='prompt'>" + text + "</p>");
  html.append("<input class='action' id='cancelButton' type='button' onClick='cancel()' value='Cancel' />");
  html.append("<input class='action' id='okayButton' type='button' onClick='okay()' value='Okay' />");
  html.append("<script> function okay() {  google.script.run." + okayFunction.name + "(); google.script.host.close(); } </script>");
  html.append("<script> function cancel() {  google.script.run." + cancelFunction.name + "(); google.script.host.close(); } </script>");
  html.append("</body></html>");
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
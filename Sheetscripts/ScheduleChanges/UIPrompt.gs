function showScheduleChangesPrompt() {
  var html = HtmlService.createTemplateFromFile('ScheduleChangesPrompt').evaluate();
  SpreadsheetApp.getUi().showModalDialog(html, ' ');
}

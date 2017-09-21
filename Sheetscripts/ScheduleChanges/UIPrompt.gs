function showScheduleChangesPrompt() {
  var html = HtmlService.createTemplateFromFile('Sheetscripts/ScheduleChanges/StudentNamePrompt').evaluate();
  SpreadsheetApp.getUi().showModalDialog(html, ' ');
}

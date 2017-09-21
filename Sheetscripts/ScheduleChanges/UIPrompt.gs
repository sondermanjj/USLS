function showScheduleChangesPrompt() {
  var html = HtmlService.createTemplateFromFile('Sheetscripts/ScheduleChanges/StudentNamePrompt')
    .evaluate()
    .setHeight(550)
    .setWidth(450);
  SpreadsheetApp.getUi().showModalDialog(html, ' ');
}

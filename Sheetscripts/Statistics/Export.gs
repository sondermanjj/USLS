/**
 *@desc Takes the gets the sheet for the website export and runs both students and faculty export.
 *@author sondermanjj
 */
function exportToWebsitePrompt() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert("Do you want to export the current data to the website?", ui.ButtonSet.YES_NO);
  if(response == ui.Button.YES){
    Logger.log("Creating Sheet 'Website Info'...");
    var sheetName = "Website Info";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if(sheet == null) {
      ss.insertSheet(sheetName);
      sheet = ss.getSheetByName(sheetName);
    } else {
      ss.deleteSheet(sheet);
      ss.insertSheet(sheetName);
      sheet = ss.getSheetByName(sheetName);
      }
    Logger.log("Sheet created, exporting data now...");
    exportInfoToWebsite(sheet);
  }
}

/**
 *@desc Puts the student and faculty data into the website.
 *@param webSheet: The new website sheet that you're putting the info into.
 *@author sondermanjj
 */
function exportInfoToWebsite(webSheet) {
  var properties = PropertiesService.getDocumentProperties();
  
  var pSFNameColumn = parseInt(properties.getProperty("pSFNameColumn"));
  var pSLNameColumn = parseInt(properties.getProperty("pSLNameColumn"));
  var pHouseColumn = parseInt(properties.getProperty("pHouseColumn"));  
  var slunchDayColumn = parseInt(properties.getProperty("pLunchDayColumn"));
  var pTableColumn = parseInt(properties.getProperty("pTableColumn"));
  var pLunchTimeColumn = parseInt(properties.getProperty("pLunchTimeColumn"));
  var sgradeColumn = parseInt(properties.getProperty("pGradeColumn"));

  var student = [];
  var finalData = [];
  var studentValues = SpreadsheetApp
                  .getActiveSpreadsheet()
                  .getSheetByName(properties.getProperty("studentData"))
                  .getDataRange()
                  .getValues();
  for (var i = 0; i < studentValues.length; i++) {
    student = [];
    student.push(studentValues[i][pSFNameColumn]);
    student.push(studentValues[i][pSLNameColumn]);
    student.push(studentValues[i][pHouseColumn]);
    student.push(studentValues[i][slunchDayColumn]);
    student.push(studentValues[i][pTableColumn]);
    student.push(studentValues[i][pLunchTimeColumn]);
    student.push(studentValues[i][sgradeColumn]);
    finalData.push(student);
  }

  var teacherValues = SpreadsheetApp
                  .getActiveSpreadsheet()
                  .getSheetByName(properties.getProperty("teacherChoices"))
                  .getDataRange()
                  .getValues();

  var tFNameColumn = parseInt(properties.getProperty("tFNameColumn"));
  Logger.log(teacherValues);
  var tLNameColumn = parseInt(properties.getProperty("tLNameColumn"));
  var tHouseColumn = parseInt(properties.getProperty("tHouseColumn"));  
  var tLunchDayColumn = parseInt(properties.getProperty("tLunchDayColumn"));
  var tTableColumn = parseInt(properties.getProperty("tTableColumn"));
  var tLunchTimeColumn = parseInt(properties.getProperty("tLunchTimeColumn"));
                  
  for (var i = 0; i < teacherValues.length; i++) {
    if (teacherValues[i][tFNameColumn] != "First Name") {
      student = [];
      student.push(teacherValues[i][tFNameColumn]);
      student.push(teacherValues[i][tLNameColumn]);
      student.push(teacherValues[i][tHouseColumn]);
      student.push(teacherValues[i][tLunchDayColumn]);
      student.push(teacherValues[i][tTableColumn]);
      student.push(teacherValues[i][tLunchTimeColumn]);
      student.push("");
      finalData.push(student);
    }
  }
  webSheet.getRange(1, 1, finalData.length, finalData[0].length).setValues(finalData);
  Logger.log("Website export complete.");
}
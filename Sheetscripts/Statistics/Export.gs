/**
 *@desc Takes the gets the sheet for the website export and runs both students and faculty export.
 *@author sondermanjj
 */
function exportToWebsitePrompt() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert("Do you want to export the current data to the website?", ui.ButtonSet.YES_NO);
  if(response == ui.Button.YES){
    var finalData = exportInfoToWebsite();
    if (finalData != -1) {
      Logger.log("Creating Sheet 'Website Info'...");
      var sheetName = "Website Info";
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getSheetByName(sheetName);
      if(sheet === null) {
        ss.insertSheet(sheetName);
        sheet = ss.getSheetByName(sheetName);
      } else {
        ss.deleteSheet(sheet);
        ss.insertSheet(sheetName);
        sheet = ss.getSheetByName(sheetName);
        }
      Logger.log("Sheet created, inserting data now...");
      sheet.getRange(1, 1, finalData.length, finalData[0].length).setValues(finalData);
    }
  }
}

/**
 *@desc Puts the student and faculty data into the website.
 *@param webSheet: The new website sheet that you're putting the info into.
 *@author sondermanjj
 */
function exportInfoToWebsite(webSheet) {
  var docProperties = PropertiesService.getDocumentProperties();
  var properties = docProperties.getProperties();
  
  var pSFNameColumn = parseInt(properties["Student First Name"]);
  var pSLNameColumn = parseInt(properties["Student Last Name"]);
  var pHouseColumn = parseInt(properties["Student House"]);  
  var slunchDayColumn = parseInt(properties["Student Lunch Day"]);
  var pTableColumn = parseInt(properties["Student Lunch Table"]);
  var pLunchTimeColumn = parseInt(properties["Student Lunch Time"]);
  var sgradeColumn = parseInt(properties["Student Grade Level"]);

  var student = [];
  var finalData = [];
  var studentValues = SpreadsheetApp
                  .getActiveSpreadsheet()
                  .getSheetByName(properties.studentData)
                  .getDataRange()
                  .getValues();
  var i;
  if (checkData(studentValues, "Student Data")) {
    for (i = 0; i < studentValues.length; i++) {
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
                    .getSheetByName(properties.teacherChoices)
                    .getDataRange()
                    .getValues();
  
    var tFNameColumn = parseInt(properties["Teacher First Name"]);
    Logger.log(teacherValues);
    var tLNameColumn = parseInt(properties["Teacher Last Name"]);
    var tHouseColumn = parseInt(properties["Teacher House"]);  
    var tLunchDayColumn = parseInt(properties["Teacher Lunch Day"]);
    var tTableColumn = parseInt(properties["Teacher Table"]);
    var tLunchTimeColumn = parseInt(properties["Teacher Lunch Assignment"]);
    
    if (checkData(teacherValues, "Teacher Data")) {
      for (i = 0; i < teacherValues.length; i++) {
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
      return finalData;
    } else {
    return -1;
    }
  } else {
  return -1;
  }
}

/**
 *@desc Checks whether the array has bad values, and puts out alert if so.
 *@param data: The 2D array we're checking doesn't have any bad values.
 *@return Returns true if there are no errors within the data, false if there are.
 *@author sondermanjj
 */
function checkData(data, sheetIdentifier) {
  var errorString = sheetIdentifier;
  var errors = true;
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[0].length; j++) {
      if (data[i][j].toString().toLowerCase() == "null" ||
      data[i][j].toString().toLowerCase() == "undefined" ||
      data[i][j].toString().toLowerCase() == "no_value") {
        errors = false;
        errorString = errorString.concat("Error in Column: "+j+", Row: "+i+". Value is "+data[i][j] + "\n");
      }
    }
  }
  if (! errors) {
    var ui = SpreadsheetApp.getUi(); // Same variations.
    ui.alert(errorString);
  }
  
  return errors;
}
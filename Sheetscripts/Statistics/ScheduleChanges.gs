//JSHint verified 4/3/2017 sondermanjj

/**
 * @desc - Gets the html for the schedule updates
 * @return - A list of schedule updates in html
 * @author - hendersonam
 */
function getScheduleChanges() {
  var html = "<br>Student Lunch Changes:";
  var changes = scheduleChanges();
  if(changes.length === 0) {
    html += "<br> No Schedule changes to display.";
  }  else {
    for (var i = 0; i < changes.length; i++) {
      if (changes[i].length < 6) {
        html += "<br>" + changes[i][0] + " " + changes[i][1] + " added to the roster.";
      } else if (changes[i][3] == 'early' && changes[i][5] == 'early') {
        html += "<br>" + changes[i][0] + " " + changes[i][1] + " changed from table " + changes[i][6] + " " + changes[i][3] + " lunch to table " + changes [i][7] + " " + changes[i][5] + " lunch on " + changes[i][4] + " days.";
      } else if (changes[i][3] == 'early') {
        html += "<br>" + changes[i][0] + " " + changes[i][1] + " changed from table " + changes[i][6] + " " + changes[i][3] + " lunch to " + changes[i][5] + " lunch on " + changes[i][4] + " days.";
      } else if (changes[i][5] == 'early') {
        html += "<br>" + changes[i][0] + " " + changes[i][1] + " changed from " + changes[i][3] + " lunch to table " + changes[i][7] + " " + changes[i][5] + " lunch on " + changes[i][4] + " days.";
      } else {
        html += "<br>" + changes[i][0] + " " + changes[i][1] + " changed from " + changes[i][3] + " lunch to " + changes[i][5] + " lunch on " + changes[i][4] + " days.";
      }
    }
  }
  promptForChanges();
  return html;
}

/**
 * @desc - Creates/Updates the Scanned Data and Student Schedule Changes sheets and returns the differences
 *         between the Final Student Data and Scanned Data to be displayed in the UI as schedule changes
 * @return - An array of the schedule changes from the previously scanned data to the current data
 * @author - hendersonam
 */
function scheduleChanges() {
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  sortSheetBy(spreadsheet.getSheetByName("Final Student Data"), ["Lunch Day", "Last Name", "First Name"]);
  var currentValues = getFinalStudentDataValues();
  
  var scannedSheet = spreadsheet.getSheetByName("Scanned Data");
  if (scannedSheet === null) {
    spreadsheet.insertSheet("Scanned Data");
    scannedSheet = spreadsheet.getSheetByName("Scanned Data");
    scannedSheet.getRange(1, 1, currentValues.length, currentValues[0].length).setValues(currentValues); 
  }
  
  var changesSheet = spreadsheet.getSheetByName("Student Schedule Changes");
  if (changesSheet === null) {
    spreadsheet.insertSheet("Student Schedule Changes");
    changesSheet = spreadsheet.getSheetByName("Student Schedule Changes");
    changesSheet.getRange(1, 1, currentValues.length, currentValues[0].length).setValues(currentValues);
    changesSheet.clear();
    changesSheet.appendRow(getListOfColumns(currentValues));
  }
  
  sortSheetBy(scannedSheet, ["Lunch Day", "Last Name", "First Name"]);
  var scannedValues = scannedSheet.getDataRange().getValues();
  
  var changes = findChanges(scannedValues, currentValues, changesSheet);
  
  scannedSheet.getRange(1, 1, currentValues.length, currentValues[0].length).setValues(currentValues); 
  
  return changes;
}

/**
 * @desc - Finds the differences between the 2 arrays given and adds them to the given sheet
 * @param - Object[][] - the oldValues that were previously saved
 *          Object[][] - the newValues that have schedule changes
 *          Sheet - The changes sheet to save schedule changes to as records
 * @return - The differences between the 2 arrays
 * @author - hendersonam
 */
function findChanges(oldValues, newValues, changesSheet) {
  
  var newColumnList = getListOfColumns(newValues);
  var firstNameColumn = getColumnIndex(newColumnList, "First Name");
  var lastNameColumn = getColumnIndex(newColumnList, "Last Name");
  var newLunchTimeColumn = getColumnIndex(newColumnList, "Lunch Time");
  var newLunchDayColumn = getColumnIndex(newColumnList, "Lunch Day");
  var newTableColumn = getColumnIndex(newColumnList, "Lunch Table");
  
  var oldColumnList = getListOfColumns(oldValues);
  var oldLunchTimeColumn = getColumnIndex(oldColumnList, "Lunch Time");
  var oldLunchDayColumn = getColumnIndex(oldColumnList, "Lunch Day");
  var oldTableColumn = getColumnIndex(oldColumnList, "Lunch Table");
  
  var changes = [];

  if ( oldValues.length != newValues.length) {
    var count = oldValues.length;
    for( count ; count < newValues.length; count++) {
      
      oldValues.push(newValues[count]);
      
      changes.push( [newValues[count][firstNameColumn],
                     newValues[count][lastNameColumn],
                     newValues[count][newLunchDayColumn],
                     newValues[count][newLunchTimeColumn]]);
    }
  }
  var k = 0;
  var i = 0;
  
  for ( i ; i < newValues.length; i++) {
  
  if ( oldValues[i][0] == "First Name" ) {
    i++;
  }
  
  if ( newValues[k][0] == "First Name" ) {
    k++;
  }
    
    if(oldValues[i] === null) {
      changes.push( [newValues[k][firstNameColumn],
                     newValues[k][lastNameColumn],
                     newValues[k][newLunchDayColumn],
                     newValues[k][newLunchTimeColumn],
                     newValues[k][newTableColumn]]);
      
    } else if ( !newValues[k].toString().equals(oldValues[i].toString())) {
      
      changesSheet.appendRow(oldValues[i]);
      changesSheet.appendRow(newValues[k]);
      changesSheet.appendRow(["\t"]);
      
      changes.push( [newValues[k][firstNameColumn],
                     newValues[k][lastNameColumn],
                     oldValues[i][oldLunchDayColumn],
                     oldValues[i][oldLunchTimeColumn],
                     newValues[k][newLunchDayColumn],
                     newValues[k][newLunchTimeColumn],
                     oldValues[i][oldTableColumn],
                     newValues[k][newTableColumn]]);
    }
    k++;
  }
  
  return changes;
}









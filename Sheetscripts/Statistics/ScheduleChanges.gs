/**
 * @desc - Gets the html for the schedule updates
 * @return - A list of schedule updates in html
 * @author - hendersonam
 */
function getScheduleChanges() {
  var html = "<br>Student Lunch Changes:";
  var changes = scheduleChanges();
  if(changes.length == 0) {
    html += "<br> No Schedule changes to display.";
  }  else {
    for ( i = 0; i < changes.length; i++) {
      if (changes[i].length < 5) {
        html += "<br>" + changes[i][0] + " " + changes[i][1] + " added to the roster.";
      } else {
        html += "<br>" + changes[i][0] + " " + changes[i][1] + " changed from " + changes[i][3] + " to " + changes[i][5] + " on " + changes[i][4] + " days.";
      }
    }
  }
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
  var studentDataSheet = spreadsheet.getSheetByName("Final Student Data");
  var currentValues = studentDataSheet.getDataRange().getValues();
  
  var scannedSheet = spreadsheet.getSheetByName("Scanned Data");
  if (scannedSheet == null) {
    spreadsheet.insertSheet("Scanned Data");
    scannedSheet = spreadsheet.getSheetByName("Scanned Data");
    scannedSheet.getRange(1, 1, currentValues.length, currentValues[0].length).setValues(currentValues); 
  }
  
  var changesSheet = spreadsheet.getSheetByName("Student Schedule Changes");
  if (changesSheet == null) {
    spreadsheet.insertSheet("Student Schedule Changes");
    changesSheet = spreadsheet.getSheetByName("Student Schedule Changes");
    changesSheet.getRange(1, 1, currentValues.length, currentValues[0].length).setValues(currentValues);
    changesSheet.clear();
  }
  
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
  
  var oldFirstNameColumn, 
      newFirstNameColumn, 
      newLastNameColumn, 
      newLunchTimeColumn, 
      newLunchDayColumn;
  
  var changes = new Array();
  
  for( j = 0; j < oldValues.length; j++) {
    for ( i = 0; i < oldValues[j].length - 1; i++) {
      if (oldValues[j][i] == 'Lunch Time') {
        var oldLunchTimeColumn = i ;
      }
      if (oldValues[j][i] == 'Lunch Day') {
        var oldLunchDayColumn = i ;
      }
    }
  }
  
  for( j = 0; j < oldValues.length; j++) {
    for ( i = 0; i < newValues[j].length - 1; i++) {
      if (newValues[j][i] == 'First Name') {
        var newFirstNameColumn = i ;
      }
      if (newValues[j][i] == 'Last Name') {
        var newLastNameColumn = i ;
      }
      if (newValues[j][i] == 'Lunch Time') {
        var newLunchTimeColumn = i ;
      }
      if (newValues[j][i] == 'Lunch Day') {
        var newLunchDayColumn = i ;
      }
    }
  }
  

  if ( oldValues.length != newValues.length) {
    var count = oldValues.length;
    for( count ; count < newValues.length; count++) {
      oldValues.push(newValues[count]);
      changes.push( [newValues[count][newFirstNameColumn],
                     newValues[count][newLastNameColumn],
                     newValues[count][newLunchDayColumn],
                     newValues[count][newLunchTimeColumn]]);
    }
  
  }
  oldValues.sort();
  newValues.sort();
  
  for ( i = 0; i < newValues.length; i++) {
    if(oldValues[i] == null) {
      changes.push( [newValues[i][newFirstNameColumn],
                     newValues[i][newLastNameColumn],
                     newValues[i][newLunchDayColumn],
                     newValues[i][newLunchTimeColumn]]);
    } else if ( !newValues[i].toString().equals(oldValues[i].toString())) {
      changesSheet.appendRow(oldValues[i]);
      changes.push( [newValues[i][newFirstNameColumn],
                     newValues[i][newLastNameColumn],
                     oldValues[i][oldLunchDayColumn],
                     oldValues[i][oldLunchTimeColumn],
                     newValues[i][newLunchDayColumn],
                     newValues[i][newLunchTimeColumn]]);
    }
  }
  
  
  return changes;
}







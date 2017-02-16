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
      if (changes[i].length < 6) {
        html += "<br>" + changes[i][0] + " " + changes[i][1] + " added to the roster.";
      } else if (changes[i][3] == 'mid' && changes[i][5] == 'mid') {
        html += "<br>" + changes[i][0] + " " + changes[i][1] + " changed from table " + changes[i][6] + " " + changes[i][3] + " lunch to table " + changes [i][7] + " " + changes[i][5] + " lunch on " + changes[i][4] + " days.";
      } else if (changes[i][3] == 'mid') {
        html += "<br>" + changes[i][0] + " " + changes[i][1] + " changed from table " + changes[i][6] + " " + changes[i][3] + " lunch to " + changes[i][5] + " lunch on " + changes[i][4] + " days.";
      } else if (changes[i][5] == 'mid') {
        html += "<br>" + changes[i][0] + " " + changes[i][1] + " changed from " + changes[i][3] + " lunch to table " + changes[i][7] + " " + changes[i][5] + " lunch on " + changes[i][4] + " days.";
      } else {
        html += "<br>" + changes[i][0] + " " + changes[i][1] + " changed from " + changes[i][3] + " lunch to " + changes[i][5] + " lunch on " + changes[i][4] + " days.";
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
  var currentValues = getFinalStudentDataValues();
  
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
  
  var firstNameColumn = getColumnIndex(newValues, "First Name");
  var lastNameColumn = getColumnIndex(newValues, "Last Name");
  var newLunchTimeColumn = getColumnIndex(newValues, "Lunch Time");
  var newLunchDayColumn = getColumnIndex(newValues, "Lunch Day");
  var newTableColumn = getColumnIndex(newValues, "Table");
  
  var oldLunchTimeColumn = getColumnIndex(oldValues, "Lunch Time");
  var oldLunchDayColumn = getColumnIndex(oldValues, "Lunch Day");
  var oldTableColumn = getColumnIndex(oldValues, "Table");
  
  var changes = new Array();

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
  
  oldValues.sort();
  newValues.sort();
  
  for ( i = 0; i < newValues.length; i++) {
    
    if(oldValues[i] == null) {
      changes.push( [newValues[i][firstNameColumn],
                     newValues[i][lastNameColumn],
                     newValues[i][newLunchDayColumn],
                     newValues[i][newLunchTimeColumn],
                     newValues[i][newTableColumn]]);
      
    } else if ( !newValues[i].toString().equals(oldValues[i].toString())) {
      
      changesSheet.appendRow(oldValues[i]);
      
      changes.push( [newValues[i][firstNameColumn],
                     newValues[i][lastNameColumn],
                     oldValues[i][oldLunchDayColumn],
                     oldValues[i][oldLunchTimeColumn],
                     newValues[i][newLunchDayColumn],
                     newValues[i][newLunchTimeColumn],
                     oldValues[i][oldTableColumn],
                     newValues[i][newTableColumn]]);
    }
  }
  
  return changes;
}

function adjustOtherSchedules() {
  
  var time = ["Early", "Mid", "Late"];
  var day = ["A", "B", "C", "D", "E", "F", "G", "H"];
  var flags = [0,0,0,0,0,0,0,0];
  var values = getFinalStudentDataValues();
  
  var firstNameColumn = getColumnIndex(values, "First Name");
  var lastNameColumn = getColumnIndex(values, "Last Name");
  var lunchTimeColumn = getColumnIndex(values, "Lunch Time");
  var lunchDayColumn = getColumnIndex(values, "Lunch Day");
  var tableColumn = getColumnIndex(values, "Table");
  
  var stats = statistics(time, day, values, true);
  
  for (var i = 0; i < stats.length; i++) {
    if(stats[i][0] > 133) {
      flags[i] = stats[i][0] - 133;
    }
  }
  
  for ( i = 0; i < flags.length; i++) {
    if(flags[i] > 0) {
      for ( j = 0; j < values.length; j++) {
        
      
      }
    }
  }   
}








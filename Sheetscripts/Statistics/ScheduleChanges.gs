//JSHint verified 5/7/2017 by hendersonam

  var changeshtml = "";
  var updatedChanges = false;
  
  function updateChanges(){            
    var list = scheduleChanges();            
    var numChanges = 0;            
    for(var j=0; j<list.length; j++){            
      numChanges += 1;            
    }            
    Logger.log(numChanges);            
  }
  
  function validateChange(data) {
    var properties = PropertiesService.getDocumentProperties();
    var values = SpreadsheetApp
                  .getActiveSpreadsheet()
                  .getSheetByName(properties.getProperty("studentData"))
                  .getDataRange()
                  .getValues();
                  
    var valid = checkForStudent(values, data[0], data[1]);
    return valid;
  }
  
  function checkForStudent(values, firstname, lastname) {
    var properties = PropertiesService.getDocumentProperties();
    var firstNameColumn = parseInt(properties.getProperty("Student First Name"));
    var lastNameColumn = parseInt(properties.getProperty("Student Last Name"));
    var valid = false;
  
    for(var i = 0; i < values.length; i++) {
      if(firstname == values[i][firstNameColumn]) {
        if(lastname == values[i][lastNameColumn]) {
          valid = true;
        }
      }
    }
    
    return valid;
  }
  
  function getStudentScheduleHTML(data) {
    var html = getStudentSchedule(data);
    return html;
  }
  
  function getStudentSchedule(data) {
    var properties = PropertiesService.getDocumentProperties();
    var values = SpreadsheetApp
                  .getActiveSpreadsheet()
                  .getSheetByName(properties.getProperty("studentData"))
                  .getDataRange()
                  .getValues();
  }
                    
  /**
  * @desc - Gets the html for the schedule updates
  * @return - A list of schedule updates in html
  * @author - hendersonam
  */
  function getScheduleChanges() {
    updatedChanges = false;
    changeshtml = "<h3>Student Lunch Changes:</h3>";
    
    //Get schedule changes, the changes array will have the following format:
    //    [ [firstName, LastName, oldLunchDay, oldLunchTime, newLunchDay, newLunchTime, oldTable, newTable ] ]
    var changes = scheduleChanges();
    if(changes.length === 0) {
      changeshtml += "No Schedule changes to display.";
    }  else {
      changeshtml += "<ul id='changes'>";
      for (var i = 0; i < changes.length; i++) {
        if (changes[i][0] == 1 ) {
          changeshtml += "<li> The following column values have been changed for " + changes[i][1] + " on " + changes[i][2] + " days: ";
          for ( var t = 3; t < changes[i].length; t++) {
          changeshtml += " " + changes[i][t];
          }
          changeshtml += "</li>";
        } else if (changes[i].length == 2 ) {
          changeshtml += "<li> Lunch time in row " + changes[i][0] + " is misspelt. Currently says " + changes[i][1] + ".</li>";
        } else if (changes[i].length < 6) {
          changeshtml += "<li>" + changes[i][0] + " " + changes[i][1] + " added to the roster.</li>";
        } else if (changes[i][3] == 'early' && changes[i][5] == 'early') {
          changeshtml += "<li>" + changes[i][0] + " " + changes[i][1] + " changed from table " + changes[i][6] + " " + changes[i][3] + " lunch to table " + changes [i][7] + " " + changes[i][5] + " lunch on " + changes[i][4] + " days.</li>";
        } else if (changes[i][3] == 'early') {
          changeshtml += "<li>" + changes[i][0] + " " + changes[i][1] + " changed from table " + changes[i][6] + " " + changes[i][3] + " lunch to " + changes[i][5] + " lunch on " + changes[i][4] + " days.</li>";
        } else if (changes[i][5] == 'early') {
          changeshtml += "<li>" + changes[i][0] + " " + changes[i][1] + " changed from " + changes[i][3] + " lunch to table " + changes[i][7] + " " + changes[i][5] + " lunch on " + changes[i][4] + " days.</li>";
        } else {
          changeshtml += "<li>" + changes[i][0] + " " + changes[i][1] + " changed from " + changes[i][3] + " lunch to " + changes[i][5] + " lunch on " + changes[i][4] + " days.</li>";
        }
      }
      changeshtml += "</ul>";
    }
    if ( changes.length !== 0) {
      promptForChanges();
    }
    updatedChanges = true;
    return changeshtml;
  }
  
/**
 * @desc - Creates/Updates the Scanned Data and Student Schedule Changes sheets and returns the differences
 *         between the Final Student Data and Scanned Data to be displayed in the UI as schedule changes
 * @return - An array of the schedule changes from the previously scanned data to the current data
 * @author - hendersonam
 */
function scheduleChanges() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var properties = PropertiesService.getDocumentProperties();
  
  var currentValues = ss.getSheetByName(properties.getProperty("studentData")).getDataRange().getValues();
  
  var scannedSheet = ss.getSheetByName("Scanned Data");
  if (scannedSheet === null) {
    ss.insertSheet("Scanned Data");
    scannedSheet = ss.getSheetByName("Scanned Data");
    scannedSheet.hideSheet();
    scannedSheet.getRange(1, 1, currentValues.length, currentValues[0].length).setValues(currentValues);
    }
  
  var changesSheet = ss.getSheetByName("Student Schedule Changes");
  if (changesSheet === null) {
    ss.insertSheet("Student Schedule Changes");
    changesSheet = ss.getSheetByName("Student Schedule Changes");
    changesSheet.hideSheet();
    changesSheet.getRange(1, 1, currentValues.length, currentValues[0].length).setValues(currentValues);
    changesSheet.clear();
    changesSheet.appendRow(getListOfColumns(currentValues));
  }
  
  var scannedValues = scannedSheet.getDataRange().getValues();
  
  if (currentValues.length > scannedValues.length) {
    scannedValues = checkForNewStudents(scannedValues, currentValues);
  }
  
  if (currentValues.length < scannedValues.length) {
    scannedValues = checkForOldStudents(scannedValues, currentValues);
  }
  
  var changes = findChanges(scannedValues, currentValues, changesSheet);
  
  scannedSheet.getRange(1, 1, currentValues.length, currentValues[0].length).setValues(currentValues); 
  
  return changes;

}

/**
 * @desc - Removes old students from the scanned sheet
 * @param - Object[][] - the oldValues that were previously saved
 *          Object[][] - the newValues that have schedule changes
 * @return - Object[][] - updated scanned Values
 * @author - hendersonam
 */
function checkForOldStudents(oldValues, newValues) {

  var properties = PropertiesService.getDocumentProperties();
  var firstNameColumn = parseInt(properties.getProperty("Student First Name"));
  var lastNameColumn = parseInt(properties.getProperty("Student Last Name"));
  
  oldValues.sort(compareByColumnIndex(lastNameColumn));
  oldValues.sort(compareByColumnIndex(firstNameColumn));
  
  newValues.sort(compareByColumnIndex(lastNameColumn));
  newValues.sort(compareByColumnIndex(firstNameColumn));
  
  var newLength = newValues.length;  
  
  for ( var i = 0, k = 0; i <= newLength; i++, k++) {  
    if ( k >= newLength ) {
      oldValues.splice(k,(oldValues.length - k));
    } else if(newValues[i][firstNameColumn] != oldValues[k][firstNameColumn]) {
      oldValues.splice(k, 1);
      i--;
      k--;
    }
  }
  return oldValues;
}

/**
 * @desc - Adds new students to the scanned sheet
 * @param - Object[][] - the oldValues that were previously saved
 *          Object[][] - the newValues that have schedule changes
 * @return - Object[][] - updated scanned Values
 * @author - hendersonam
 */
function checkForNewStudents(oldValues, newValues) {

  var properties = PropertiesService.getDocumentProperties();
  var firstNameColumn = parseInt(properties.getProperty("Student First Name"));
  var lastNameColumn = parseInt(properties.getProperty("Student Last Name"));
  
  oldValues.sort(compareByColumnIndex(lastNameColumn));
  oldValues.sort(compareByColumnIndex(firstNameColumn));
  
  newValues.sort(compareByColumnIndex(lastNameColumn));
  newValues.sort(compareByColumnIndex(firstNameColumn));
  
  var newLength = newValues.length;
  
  for ( var i = 0, k = 0; i < newLength; i++, k++) {  
    if(newValues[i][firstNameColumn] != oldValues[k][firstNameColumn]) {
      oldValues.push(newValues[i]);
      k--;
    }
  }
   
  return oldValues;
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
  
  var properties = PropertiesService.getDocumentProperties();
  var firstNameColumn = parseInt(properties.getProperty("Student First Name"));
  var lastNameColumn =  parseInt(properties.getProperty("Student Last Name"));
  var LunchTimeColumn =  parseInt(properties.getProperty("Student Lunch Time"));
  var LunchDayColumn =  parseInt(properties.getProperty("Student Lunch Day"));
  var TableColumn =  parseInt(properties.getProperty("Student Lunch Table"));
  var courseColumn = parseInt(properties.getProperty("Student Course Title"));
  var times = JSON.parse(properties.getProperty("lunchTimes"));
  var headers = JSON.parse(properties.getProperty("headers"));
  
  oldValues.sort(compareByColumnIndex(LunchDayColumn));
  oldValues.sort(compareByColumnIndex(lastNameColumn));
  oldValues.sort(compareByColumnIndex(firstNameColumn));
  newValues.sort(compareByColumnIndex(LunchDayColumn));
  newValues.sort(compareByColumnIndex(lastNameColumn));
  newValues.sort(compareByColumnIndex(firstNameColumn));
  
  //Changes sheet values that may/may not need updating
  var changesSheetArray = changesSheet.getDataRange().getValues();
  //Array to log the changes so they can be displayed on the Add-On
  var changes = [];
  //Create an empty row we can use with the correct number of columns
  var emptyRow = [];
  for(var i = 0; i < changesSheetArray[0].length; i++) {
    emptyRow.push(["\t"]);
  }
  for ( var i = 0, k = 0; i < newValues.length; i++, k++) {
    //If this is the header row of the old values, move to the next row
    if ( oldValues[i][0] == "First Name" ) {
      i++;
    }
    //If this is the header row of the new values, move to the next row
    if ( newValues[k][0] == "First Name" ) {
      k++;
    }
    var newRow = newValues[k].toString().toLowerCase();
    var oldRow = oldValues[i].toString().toLowerCase();
    // If the newValue row does not equal the oldValue row, a schedule change happened
    if ( !newRow.equals(oldRow)) {
      if ( newRow[courseColumn] == oldRow[courseColumn]) {
        var mispellings = [1, newValues[k][firstNameColumn], newValues[k][LunchDayColumn]];
        Logger.log(headers.length);
        for ( var p = 0; p < headers.length; p++) {
          if ( newValues[k][p] != oldValues[i][p] ) {
            Logger.log(headers[p]);
            mispellings.push(headers[p]);
          }
        }
        changes.push(mispellings);
      } else if (!times.includes(newRow[LunchTimeColumn]) ){
        changes.push([k+1, newRow[LunchTimeColumn]]);
      } else {
        //Add the old value, new value, and an empty row to the changes sheet array
        changesSheetArray.push(oldValues[i]);
        changesSheetArray.push(newValues[k]);
        changesSheetArray.push(emptyRow);
        //Add the needed information to the changes array
        changes.push( [newValues[k][firstNameColumn],
                       newValues[k][lastNameColumn],
                       oldValues[i][LunchDayColumn],
                       oldValues[i][LunchTimeColumn],
                       newValues[k][LunchDayColumn],
                       newValues[k][LunchTimeColumn],
                       oldValues[i][TableColumn],
                       newValues[k][TableColumn]]);
      }
    }
  }
  changesSheet.getRange(1, 1, changesSheetArray.length, changesSheetArray[0].length).setValues(changesSheetArray);
  return changes;
}

function getChangesHTML() {
  return changeshtml;
}
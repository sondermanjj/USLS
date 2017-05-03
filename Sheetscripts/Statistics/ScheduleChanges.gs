//JSHint verified 4/3/2017 sondermanjj

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
  
  /**
  * @desc - Gets the html for the schedule updates
  * @return - A list of schedule updates in html
  * @author - hendersonam
  */
  function getScheduleChanges() {
    updatedChanges = false;
    changeshtml = "<h3>Student Lunch Changes:</h3>";
    var changes = scheduleChanges();
    if(changes.length == 0) {
      changeshtml += "No Schedule changes to display.";
    }  else {
      changeshtml += "<ul id='changes'>";
      for ( i = 0; i < changes.length; i++) {
        if (changes[i].length < 6) {
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
    if ( changes.length != 0) {
      promptForChanges();
    }
    updatedChanges = true;
    Logger.log("Changes: " + changeshtml);
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
  var lunchDayColumn = parseInt(properties.getProperty("pLunchDayColumn"));
  var firstNameColumn = parseInt(properties.getProperty("pSFNameColumn"));
  var lastNameColumn = parseInt(properties.getProperty("pSLNameColumn"));
  
  currentValues.sort(compareByColumnIndex(lunchDayColumn));
  currentValues.sort(compareByColumnIndex(lastNameColumn));
  currentValues.sort(compareByColumnIndex(firstNameColumn))
  
  var scannedSheet = ss.getSheetByName("Scanned Data");
  if (scannedSheet == null) {
    ss.insertSheet("Scanned Data");
    scannedSheet = ss.getSheetByName("Scanned Data");
    scannedSheet.hideSheet();
    scannedSheet.getRange(1, 1, currentValues.length, currentValues[0].length).setValues(currentValues);
  }
  
  var changesSheet = ss.getSheetByName("Student Schedule Changes");
  if (changesSheet == null) {
    ss.insertSheet("Student Schedule Changes");
    changesSheet = ss.getSheetByName("Student Schedule Changes");
    changesSheet.hideSheet();
    changesSheet.getRange(1, 1, currentValues.length, currentValues[0].length).setValues(currentValues);
    changesSheet.clear();
    changesSheet.appendRow(getListOfColumns(currentValues));
  }
  
  var scannedValues = scannedSheet.getDataRange().getValues();
  scannedValues.sort(compareByColumnIndex(lunchDayColumn));
  scannedValues.sort(compareByColumnIndex(lastNameColumn));
  scannedValues.sort(compareByColumnIndex(firstNameColumn));
  
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
  
  var changesSheetArray = changesSheet.getDataRange().getValues();
  
  var emptyRow = []
  for(var i = 0; i < changesSheetArray[0].length; i++) {
    emptyRow.push(["\t"]);
  }
  
  var properties = PropertiesService.getDocumentProperties();
  
  var firstNameColumn = parseInt(properties.getProperty("pSFNameColumn"));
  var lastNameColumn =  parseInt(properties.getProperty("pSLNameColumn"));
  var LunchTimeColumn =  parseInt(properties.getProperty("pLunchTimeColumn"));
  var LunchDayColumn =  parseInt(properties.getProperty("pLunchDayColumn"));
  var TableColumn =  parseInt(properties.getProperty("pTableColumn"));
  
  var changes = [];

  if ( oldValues.length != newValues.length) {
    var count = oldValues.length;
    for( count ; count < newValues.length; count++) {
      
      oldValues.push(newValues[count]);
      
      changes.push( [newValues[count][firstNameColumn],
                     newValues[count][lastNameColumn],
                     newValues[count][LunchDayColumn],
                     newValues[count][LunchTimeColumn]]);
    }
  }
  var k = 0;
  var i = 0;
  
  for ( i ; i < newValues.length; i++, k++) {
  
    if ( oldValues[i][0] == "First Name" ) {
      i++;
    }
    
    if ( newValues[k][0] == "First Name" ) {
      k++;
    }
    
    if(oldValues[i] === null) {
      changes.push( [newValues[k][firstNameColumn],
                     newValues[k][lastNameColumn],
                     newValues[k][LunchDayColumn],
                     newValues[k][LunchTimeColumn],
                     newValues[k][TableColumn]]);
      
    } else if ( !newValues[k].toString().equals(oldValues[i].toString())) {
      
      changesSheetArray.push(oldValues[i]);
      changesSheetArray.push(newValues[k]);
      changesSheetArray.push(emptyRow);
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
  
  changesSheet.getRange(1, 1, changesSheetArray.length, changesSheetArray[0].length).setValues(changesSheetArray);
  return changes;
}

function getChangesHTML(){
  return changeshtml;
}
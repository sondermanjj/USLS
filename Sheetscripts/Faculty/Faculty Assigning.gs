//JSHint verified 4/3/2017 sondermanjj

/**
@desc 
@author sondermanjj
@return
@param
*/
function addFacultyTables() {
  addTeachersToTableList();
}

var tableList;
var teacherList;
var dodListsheet;
var letterDays;
var properties
var offset;

/**
@desc Assigns the teachers randomly to the lunch tables, filling as many as possible
before reporting to a sheet how many tables are used.
@author sondermanjj
@return NULL
*/
function addTeachersToTableList() {
  
  var documentProperties = PropertiesService.getDocumentProperties();
  properties = documentProperties.getProperties();
  var lunchDays = JSON.parse(properties.lunchDays);
  var lunchList = [];
  var emptySlots;
  
  
  for (var k = 0; k < lunchDays.length; k++) {
    for (var i = 0; i < lunchDays[0].times.length; i++) {
      if (lunchDays[0].times[i].assignedBy == "table") {
        if (lunchDays[0].times[i].maxTables == null) {
          SpreadsheetApp.getUi().alert("The assignable lunch has no values for Max, unable to assign faculty");
          return;
        }
      }
    }
  }
  
  //Finds which lunches are assigned by table, as those are the ones we care about.
  for (var i = 0; i < lunchDays[0].times.length; i++) {
    if (lunchDays[0].times[i].assignedBy == "table") {
      lunchList.push(lunchDays[0].times[i]);
    }
  }
  
  tableList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.teacherTables);
  
  Logger.log("Adding teachers begun");
  
  teacherList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.teacherChoices);
  dodListsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.DODList);
  
  var settings = JSON.parse(properties["lunchDays"]);
  letterDays = getDays(settings);
  
  tableList.getRange(1, 1, 700).setBackground("white");
  var missingLunchTables = [];
  //Go through each lunch and assign them
  for (var i = 0 ; i < lunchList.length; i++) {
    missingLunchTables.push(alternateSort(lunchList[i]));
  }
  
  var missingRows = [["Table", "Letter Day", "Lunch"]];
  for (var i = 0; i < missingLunchTables.length; i++) {
    for (var k = 0; k < missingLunchTables[i].length; k++) {
      missingRows.push(missingLunchTables[i][k]);
    }
  }
  
  createNewSheet(missingRows, "Missing Faculty Tables");
  
}




/**
@desc Assigns the teachers randomly to the lunch tables, filling as many as possible
before reporting how many tables aren't used
@author sondermanjj
@return An array of the tables that were not assigned
@param lunchTime: The lunch time information property
*/    
function alternateSort(lunchTime) {
  
  Logger.log("Starting Faculty Sort for " + lunchTime.name);
  var tLAssignmentColumn = parseInt(properties["Teacher Lunch Assignment"]);
  var tTableColumn = parseInt(properties["Teacher Table"]);
  var tLastNameColumn = parseInt(properties["Teacher Last Name"]);
  var tDayColumn = parseInt(properties["Teacher Lunch Day"]);
  
  var realTableNumbers = getRealTableNumberForLunches();
  
  Logger.log(realTableNumbers);
  
  var lunchCount = 0;
  var allTeachersLunch = teacherList.getRange(1, 1, teacherList.getLastRow(), teacherList.getLastColumn()).getValues();
  var adjustedTeachersLunch = allTeachersLunch;
  
  //Clear choices from current lunch being sorted
  for (var i = 0; i < adjustedTeachersLunch.length; i++) {
    if (adjustedTeachersLunch[i][tLastNameColumn] != "Last Name" && adjustedTeachersLunch[i][tLAssignmentColumn] == lunchTime.name) {
      adjustedTeachersLunch[i][tTableColumn] = "";
    }
  }
  
  //Add in the DOD's if they are relevant to this lunch
  var startAtZero = false;
  var dodList = dodListsheet.getRange(1,1, 16, 6).getValues();
  var relevantDOD = [];
  for (var i = 0; i < dodList.length ; i++) {
    if (dodList[i][5] == lunchTime.name) {
      relevantDOD.push(dodList[i]);
    }
  }
  if (relevantDOD.length == 0) {
    Logger.log("The assigned lunch " + lunchTime.name + " has no DOD's assigned to it, random teachers are being assigned instead");
    //SpreadsheetApp.getUi().alert("The assignable lunch " + lunchTime.name + " has no DOD's assigned to it, random teachers are being assigned instead");
    startAtZero = true;
  } else {
    
    //Puts each DOD in the 1st table of the lunch
    for (var i = 0; i < adjustedTeachersLunch.length; i++) {
      for (var j = 0; j < relevantDOD.length; j++) {
        if (adjustedTeachersLunch[i][tLastNameColumn] == relevantDOD[j][2] &&
          adjustedTeachersLunch[i][tDayColumn] == relevantDOD[j][4] &&
          adjustedTeachersLunch[i][tLAssignmentColumn] == relevantDOD[j][5]) {
          adjustedTeachersLunch[i][tTableColumn] = 1;
        }
      }
    }
  }
  
  var startingTable = 1;
  if (startAtZero) {startingTable = 0;}
  Logger.log("Starting at zero: " + startAtZero);
  shuffleArray(adjustedTeachersLunch);
  // Sort the array by lunch assignment, then day, then by random number
  adjustedTeachersLunch.sort(function(a, b){
    var number = (a[tLAssignmentColumn]<b[tLAssignmentColumn]?-1:(a[tLAssignmentColumn]>b[tLAssignmentColumn]?1:0));  
    if (number == 0) {
      return (a[tDayColumn]<b[tDayColumn]?-1:(a[tDayColumn]>b[tDayColumn]?1:0));  
    } else {
      return number;
    }
  });
  
  letterDays.sort();
  
  var currentRow = 0;
  
  //find where where our lunch time starts
  while (adjustedTeachersLunch[currentRow][tLAssignmentColumn] != lunchTime.name) {
    currentRow++;
  }
  
  var startOfLunch = currentRow;
  var numberOfTables = lunchTime.maxTables;
  var missingRows = [];
  
  //Assigns each of the remaining tables to a lunch, if there are empty lunches then it will put those into a array that will be returned.
  for (var k = 0; k < letterDays.length; k++) {
    numberOfTables = realTableNumbers[k];
    var tablesAssigned = startingTable;
    while (currentRow < adjustedTeachersLunch.length && 
           adjustedTeachersLunch[currentRow][tDayColumn] == letterDays[k] &&
           tablesAssigned < numberOfTables) {
      if (adjustedTeachersLunch[currentRow][tTableColumn] == "") {
        tablesAssigned++;
        adjustedTeachersLunch[currentRow][tTableColumn] = tablesAssigned;
      }
      currentRow++;
    }
    
    //If there are still tables that are unassigned, put them into a array for later.
    if (tablesAssigned != numberOfTables) {
      for (tablesAssigned; tablesAssigned < numberOfTables; tablesAssigned++) {
        missingRows.push([(tablesAssigned+1), letterDays[k], lunchTime.name]);
      }
    }
    
    //Iterate through remaining teachers not assigned.
    while (currentRow < adjustedTeachersLunch.length && 
      adjustedTeachersLunch[currentRow][tDayColumn] == letterDays[k]) {
      currentRow++;
    }
  }
  
  // Now actually assign them to the lunches
  
  teacherList.clear();
  teacherList.getRange(1, 1, adjustedTeachersLunch.length,  adjustedTeachersLunch[0].length).setValues(adjustedTeachersLunch);
  
  //Return any tables that were missing teachers
  return missingRows;
  
}

function getRealTableNumberForLunches() {
  var documentProperties = PropertiesService.getDocumentProperties();
  properties = documentProperties.getProperties();
  
  var primarySheetName = properties.studentData;
  var primary = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(primarySheetName).getDataRange().getValues();
  
  var sLTimeColumn = parseInt(properties["Student Lunch Time"]);
  var sTableColumn = parseInt(properties["Student Lunch Table"]);
  var sDayColumn = parseInt(properties["Student Lunch Day"]);

  var lunchDays = JSON.parse(properties.lunchDays);
  var realTableLengths = [];
  Logger.log(lunchDays);
  
  for (var i = 0; i < lunchDays.length; i++) {
      realTableLengths.push(0);
  }
  Logger.log("Primary Length: "+primary.length);
  for (var i = 0; i < primary.length; i++) {
      var day = primary[i][sDayColumn];
      var time = primary[i][sLTimeColumn];
      var table = primary[i][sTableColumn];
      for (var k = 0; k < lunchDays.length; k++) {
        if (day == lunchDays[k].letter) {
          if (realTableLengths[k] < table) {
            realTableLengths[k] = table;
          }
        }
      }
    }
    
  return realTableLengths;   
        
}

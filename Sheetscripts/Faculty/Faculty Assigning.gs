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
 
  var earlyCount = 0; //Number of teachers for early lunch
  
  /**
  @desc Assigns the teachers randomly to the lunch tables, filling as many as possible
  before reporting how many tables aren't used
  @author sondermanjj
  @return NULL
  @param id: The sheet ID to be edited
  */
  function addTeachersToTableList() {
    
    var documentProperties = PropertiesService.getDocumentProperties();
    var properties = documentProperties.getProperties();
    populateTableList();
    
    Logger.log("Adding teachers begun");

    var tableList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.teacherTables);
    var teacherList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.teacherChoices);
    var dodListsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.DODList);
    var settings = JSON.parse(properties["lunchDays"]);
    var letterDays = getDyas(settings);

    
    var teacherRow;
    
    tableList.getRange(1, 1, 500).setBackground("white");
    
    Logger.log("Spreadsheets retrieved");
    
  
    teacherList.sort(5);
    
    var offset = 0; //Variable to handle whether the first row is frozen or not.
    var firstRow = teacherList.getRange(1, 1, 1, 15).getValues();
    for (var i = 0; i < 15; i++) {
      if (firstRow[0][i] == "First Name") { //if first row is frozen, then it will set the offset
        offset = 1;
      }
    }
    
    if (offset) {
       Logger.log("Header is frozen");
    } else {
      Logger.log("Header unfrozen");
     }
     
    //Reset tables assigned to 0
    teacherList.getRange(1+offset, 8, teacherList.getLastRow()-1, 1).setValue(0);
    teacherList.getRange(1+offset, 9, teacherList.getLastRow()-1, 1).setValue(null);
    
    Logger.log("Spreadsheet 0 values assigned");
    
    var allTeachersLunch = teacherList.getRange(1+offset, 5, teacherList.getLastRow(), 1).getValues();
    var earlyTeachersRows = [];
    //Assign random numbers to all the early teachers
    var lastRow = teacherList.getLastRow();
  
    for (var i = 0; i < lastRow; i++) {
      if (allTeachersLunch[i].toString().toLowerCase() == "early") {

        earlyTeachersRows.push(i+1);
        earlyCount++;
      }
    }
    
    Logger.log("All early teachers row numbers collected");
  
    var length = earlyTeachersRows.length;
    for (i = 0; i < length;i++) {
      teacherList.getRange(earlyTeachersRows[i]+offset, 9).setValue(Math.random()*100);
    }  
    
    Logger.log("Random numbers set and put in");
    
    //First go through and get the DOD's and assign them to the first tables
    teacherList.sort(9); //Sort by the random numbers  
    teacherRow = teacherList.getRange(1+offset, 1, earlyCount, 8).getValues();
    
    Logger.log("Early teachers values retrieved");
    var tablesAssigned = []; 
    var dodList = dodListsheet.getRange(1,1, 8, 8).getValues();
    var teacherValues;
    for (var t = 0; t < 8; t++) {
      for (i = 0; i < earlyCount; i++) {
        if (teacherRow[i][2]==dodList[t][4] && teacherRow[i][1]==dodList[t][2]) {  
          teacherRow[i][5] = 1;
          teacherRow[i][7]++;
          teacherValues = [teacherRow[i]];
          tableList.getRange(((t * 19)+2), 1, 1, 8).setValues(teacherValues);
          teacherList.getRange((i+1+offset), 1, 1, 8).setValues(teacherValues);
          tablesAssigned[(t * 19)+2] = 1;
        }
      }
    }
    
    Logger.log("DOD's inserted");
    //reset values as we've changed some values
    
    var startingRow = 0;
  
    for (t = 0; t < earlyCount; t++) {
      startingRow = -5;
      if (teacherRow[t][7]=="0") {
        for (i = 0; i< 8; i++) {
          if (teacherRow[t][2] == letterDays[i]) {
            startingRow = (i*19)+2;
          }
        }
        for (var z = 0; z < 19; z++) {
          if (tablesAssigned[z+startingRow] != "1") {
            teacherRow[t][5] = z+1;
            teacherRow[t][7]++;
            var teacherValues = [teacherRow[t]];
            tableList.getRange((z+startingRow), 1, 1, 8).setValues(teacherValues);
            teacherList.getRange((t+1+offset), 1, 1, 8).setValues(teacherValues);
            tablesAssigned[startingRow+z] = 1;
            z = 25;
          }
        }
      }
    }
    
    Logger.log("Other teachers sorted into place");
    
  
    //Now clear up the useless rows in tablelist and teacherlist
    teacherList.getRange(1+offset, 8, teacherList.getLastRow(), 2).clear();
    tableList.getRange(1+offset, 8, teacherList.getLastRow(), 2).clear();
    
    //Then highlight any empty spaces and count em up.
    var tableLastRow = tableList.getLastRow();
    Logger.log("TableRows: "+ tableLastRow);
    var emptyCount = 0;
    var tableRows = tableList.getRange(2, 2, tableLastRow).getValues();
    for (var r = 0; r < tableLastRow-1; r++) {
      if (tableRows[r][0] === "") {
        emptyCount++;
        tableList.getRange(r+2, 1, 1, 6).setBackground("red");
      }
    }
    
    tableList.getRange(1, 8).setValue("Empty Slots");
    tableList.getRange(2, 8).setValue(emptyCount);
    
    
    Logger.log("Empty Spots marked");
  }
  
  /**
  @desc Takes all the teacher information (After sorting) and puts it into a 2d array object to be used
  in the primary student list, guarenteeing that the teachers have lunches too.
  @author sondermanjj
  @return returns the formatted teacher data, with all tables assigned
  @functional YES
  */
  function copyTeacherDataToPrimary() {
    var documentProperties = PropertiesService.getDocumentProperties();
    var properties = documentProperties.getProperties();
    var teacherList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.teacherChoices);
    teacherList.sort(1);
    teacherList.getRange(2, 11, teacherList.getLastRow(), 15).clear();
    var teacherData = teacherList.getRange(2, 1, teacherList.getLastRow(), 6).getValues();
    var formattedTeacherData = [[],[]];
    
    var lastRow = teacherList.getLastRow();
    for (var i = 0; i < lastRow; i++) {
      formattedTeacherData[i] = [];
      formattedTeacherData[i][1] = teacherData[i][0]; 
      formattedTeacherData[i][10] = teacherData[i][0];
      if (teacherData[i][4] == "early") {
        formattedTeacherData[i][12] = teacherData[i][0];
      } else {
        formattedTeacherData[i][12] = ""; 
      }
      formattedTeacherData[i][11] = teacherData[i][1];
      formattedTeacherData[i][4] = teacherData[i][5];
      formattedTeacherData[i][13] = teacherData[i][2];
      formattedTeacherData[i][14] = teacherData[i][4];
      
      formattedTeacherData[i][0] = "";
      formattedTeacherData[i][2] = "";
      formattedTeacherData[i][3] = "";
      formattedTeacherData[i][5] = "";
      formattedTeacherData[i][6] = "";
      formattedTeacherData[i][7] = "";
      formattedTeacherData[i][8] = "";
      formattedTeacherData[i][9] = "";
    }
    
    teacherList.getRange(2, 11, teacherList.getLastRow(), 15).setValues(formattedTeacherData);
    return formattedTeacherData;
  }
  
  function getAssignedLunches(settings) {
    var assignedLunches = [];
    for(var j = 0; j < settings[0].times.length; j++) {
      if(settings[0].times[j].assignedBy == "table") {
        assignedLunches.push(settings[0].times[j]);
      }
    }
    
  }
  
  /**
  @desc Makes (or clears) the old table list and generates it based on the number of tables.
  @author sondermanjj
  @param id: id of the sheet to be edited
  @returns True if process was succesful
  @functional YES
  */
  function populateTableList() {
  
    var documentProperties = PropertiesService.getDocumentProperties();
    var properties = documentProperties.getProperties();
    var tableList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.teacherTables);
    
    var settings = JSON.parse(properties["lunchDays"]);
    var letterDays = getDays(settings);
    
    var assignedLunches = getAssignedLunches(settings);
    var headerList = [["First Name", "Last Name", "Letter Day", "Lunch Preference", "Lunch", "Table"]];
    
    tableList.getRange("A1:F1").setValues(headerList);
    
    //Then populate the tableList with the letter day and table #'s, 19 tables to each day.
    var rowNumber;
    var rowInit = 2;
    for(var j = 0; j < assignedLunches.length; j++){
      if(j > 0){
          rowInit = rowNumber + assignedLunches[j-1].maxTables;
      }
      var numberOfTables = assignedLunches[j].maxTables;
      for (var i = 0; i < letterDays.length; i++) {
        rowNumber = rowInit + (i * numberOfTables);
        tableList.getRange(rowNumber, 3, numberOfTables).setValue(letterDays[i]);
      }
      
      for (i = rowInit; i <= ((numberOfTables * letterDays.length)+rowInit-1); i++) {
        tableList.getRange(i, 6).setValue(((i-2)%numberOfTables)+1);
      }
    }
    return true;
  }
  
  /**
  @desc creates a new sheet (or overwrites old one) with the data involved)
  @param data: Data to be inserted into the sheet
  name: Name of the sheet
  id: id of the sheet to be edited.
  @Functional YES
  */

  function createNewSheets(data, name, id) {
    var sheet = SpreadsheetApp.openById(id);
    var ts = sheet.getSheetByName(name); //Target sheet
  
    if (ts === null) {
      sheet.insertSheet(name);
      ts = sheet.getSheetByName(name); //Target sheet
    }
     ts.getRange(1, 1, ts.getMaxRows(), ts.getMaxColumns()).setBackground("white"); 
    ts.clearContents();
    
    //set the target range to the values of the source data
    if (data !== null) {
      ts.getRange(1, 1, data.length, data[0].length).setValues(data);
    }
  }
  
 /**
 * @desc - Prompts the user whether they should add the faculty to the student data or not. First removes
           all the teachers from the list and adds in the ones from the Faculty Choices. Finds teachers by
           them not having a advisor
 * @functional - yes
 * @author - sondermanjj
 */
function facultyAddingPrompt(){  
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('Do you want to add the faculty to the final student data?', ui.ButtonSet.YES_NO);
  if(response == ui.Button.YES) {
    var docProperties = PropertiesService.getDocumentProperties();
    var properties = docProperties.getProperties();
    var pValues = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.studentData).getDataRange().getValues();
    var advisorCol = parseInt(properties["Student Advisor"]);
    var gradeCol = parseInt(properties["Student Grade Level"]);
    for (var i = 0; i < pValues.length;i++) {
      if (pValues[advisorCol][i] == "Advisor") {
      //do nothing
      } else {
        if (pValues[i][advisorCol] === "" && pValues[i][gradeCol] === "") {
          pValues.splice(i, 1)
          i--;
        }
      }
    }
    
    pValues = addFacultyToStudentData(pValues, properties);
    
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.studentData).getDataRange().clear();
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.studentData).getRange(1, 1, pValues.length, pValues[0].length).setValues(pValues);
  }
}

/**
 * @desc - Adds the faculty choices data to the student data.
 * @functional - yes
 * @author - sondermanjj
 */
function addFacultyToStudentData(pValues, properties){  

  var tValues = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.teacherChoices).getDataRange().getValues();
  //First get all the teacher property column indexes
  var tFNameColumn = parseInt(properties["Teacher First Name"]);
  var tLNameColumn = parseInt(properties["Teacher Last Name"]);
  var tLunchDayColumn = parseInt(properties["Teacher Lunch Day"]);
  var tLunchTimeColumn = parseInt(properties["Teacher Lunch Assignment"]);
  var tTableColumn = parseInt(properties["Teacher Table"]);
  var tHouseColumn = parseInt(properties["Teacher House"]);
  //Then the where the teacher values should be put in.
  var pSFNameColumn = parseInt(properties["Student First Name"]);
  var pSLFNameColumn = parseInt(properties["Student Last Name"]);
  var pLunchDayColumn = parseInt(properties["Student Lunch Day"]);
  var pLunchTimeColumn = parseInt(properties["Student Lunch Time"]);
  var pTableColumn = parseInt(properties["Student Lunch Table"]);
  var pHouseColumn = parseInt(properties["Student House"]);
  
  var placeHolder;
  for (var i = 0; i < tValues.length; i++) {
    if (tValues[i][tFNameColumn] == "First Name" || tValues[i][tFNameColumn] === "") {
      //do nothing
    } else {
      placeHolder = [];
      for (var j = 0; j < pValues[0].length; j++) {
        placeHolder.push([]);
      }
      placeHolder[pSFNameColumn] = tValues[i][tFNameColumn];
      placeHolder[pSLFNameColumn] = tValues[i][tLNameColumn];
      placeHolder[pLunchDayColumn] = tValues[i][tLunchDayColumn];
      placeHolder[pLunchTimeColumn] = tValues[i][tLunchTimeColumn];
      placeHolder[pTableColumn] = tValues[i][tTableColumn];
      placeHolder[pHouseColumn]  = tValues[i][tHouseColumn];
      
      pValues.push(placeHolder);
      Logger.log(placeHolder);
    }
  }
  
  return pValues;
}

  

/**
@desc Retrieves the information from Final Student Data to place students
into separate sheets based on house.
@funtional - yes
@author - dicksontc
*/
function splitIntoNewSheets(){
  var sheet = SpreadsheetApp.getActiveSheet();
  var primary = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Final Student Data");
  
  var primaryData = primary.getDataRange();
  
  var pValues = primaryData.getValues();
  
  var pNumRows = primaryData.getNumRows();
  var pNumColumns = primaryData.getNumColumns();
  
  var lunchTimeColumn;
  var lunchTableColumn;
  var fNameColumn;
  var lNameColumn;
  var houseColumn;
  var lunchDayColumn;
  var gradeColumn;
  
  for(var i = 0; i < pNumColumns; i++){
    var column = pValues[0][i];
    if(column == 'Lunch Day') {
      lunchDayColumn = i ;
    }else if(column == 'Lunch Time'){
      lunchTimeColumn = i;
    }else if(column == 'First Name'){
      fNameColumn = i;
    }else if(column == 'Last Name'){
      lNameColumn = i;
    }else if(column == 'Lunch Table'){
      lunchTableColumn = i;
    }else if(column == 'House'){
      houseColumn = i;
    }else if(column == 'Grade Level'){
      gradeColumn = i;
    }
  }
  
  
  var academy = [];
  var crest = [];
  var arrow = [];
  var ledger = [];
  var rowZero = ["First Name", "Last Name", "Grade", "Lunch Day", "EML", "Table", "House"];
  academy.push(rowZero);
  crest.push(rowZero);
  arrow.push(rowZero);
  ledger.push(rowZero);
  
  for(var i = 0; i < pNumRows; i++){
    var house = pValues[i][houseColumn];
    var fName = pValues[i][fNameColumn];
    var lName = pValues[i][lNameColumn];
    var day = pValues[i][lunchDayColumn];
    var grade = pValues[i][gradeColumn];
    var time = pValues[i][lunchTimeColumn];
    var table = pValues[i][lunchTableColumn];
    
    var temp = [fName, lName, grade, day, time, table, house];
    if(house == "Academy")
      academy.push(temp);
    else if(house == "Ledger")
      ledger.push(temp);
    else if(house == "Arrow")
      arrow.push(temp);
    else if(house == "Crest")
      crest.push(temp);
  }
  
  createNewSheet(academy, "Academy");
  createNewSheet(ledger, "Ledger");
  createNewSheet(crest, "Crest");
  createNewSheet(arrow, "Arrow");
}

/**
 * @desc creates a new sheet (or overwrites old one) with the data involved)
 * @param - data[][] - data from a sheet
 *          name - name of the new sheet
 * @functional - yes
 * @author - sondermanjj
 */
function createNewSheet(data, name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var ts = sheet.getSheetByName(name); //Target sheet
  
  if (ts == null) {
    sheet.insertSheet(name);
    ts = sheet.getSheetByName(name); //Target sheet
  }
  ts.clearContents();
  
  //set the target range to the values of the source data
  ts.getRange(1, 1, data.length, data[0].length).setValues(data);
}
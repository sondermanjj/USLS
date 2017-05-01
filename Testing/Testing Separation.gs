//JSHint verified 4/3/2017 sondermanjj

/**
 * @desc - puts the test messages into an array that is passed on to the main tester
 * @author -dicksontc
 */
function mainTester() {  
  var messages = [];
  messages[0] = testHouseSheets();
  messages[1] = testTableSheets();
  return messages;
}

/**
 * @desc - Tests that all the house's have the correct number of students and matches other data
 * @author -dicksontc
 */
function testHouseSheets(){
  return allTests(function(t) {
    var academySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Academy");
    var arrowSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Arrow");
    var crestSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Crest");
    var ledgerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ledger");
    
    var acData = academySheet.getDataRange();
    var arData = arrowSheet.getDataRange();
    var cData = crestSheet.getDataRange();
    var lData = ledgerSheet.getDataRange();
    
    var acVals = acData.getValues();
    var arVals = arData.getValues();
    var cVals = cData.getValues();
    var lVals = lData.getValues();
    
    var acRows = acData.getNumRows();
    var arRows = arData.getNumRows();
    var cRows = cData.getNumRows();
    var lRows = lData.getNumRows();
        
    var acCount = 0;
    var arCount = 0;
    var cCount = 0;
    var lCount = 0;
    
    var houseColumn;
    
    for(var i = 0; i < acData.getNumColumns(); i++){
      var title = acVals[0][i];
      if(title == "House"){
        houseColumn = i;
        i = acData.getNumColumns();
      }
    }
    
    for(i = 1; i < acRows; i++){
      if(acVals[i][houseColumn] != "Academy"){
        acCount++;
      }
    }
    for(i = 1; i < arRows; i++){
      if(arVals[i][houseColumn] != "Arrow"){
        arCount++;
      }
    }
    for(i = 1; i < cRows; i++){
      if(cVals[i][houseColumn] != "Crest"){
        cCount++;
      }
    }
    for(i = 1; i < lRows; i++){
      if(lVals[i][houseColumn] != "Ledger"){
        lCount++;
      }
    }
    
    if(acCount === 0 && arCount === 0 && cCount === 0 && lCount){
      t.errorSpot("All house tests passed!", true);
    }else{
      if(acCount > 0)
        t.errorSpot("Academy sheet has incorrect students!", false);
      if(arCount > 0)
        t.errorSpot("Arrow sheet has incorrect students!", false);
      if(cCount > 0)
        t.errorSpot("Crest sheet has incorrect students!", false);
      if(lCount > 0)
        t.errorSpot("Ledger sheet has incorrect students!", false);
    }
  });
}

/**
 * @desc - Tests that the tables have the correct number of students
 * @author -dicksontc
 */
function testTableSheets(){
  return allTests(function(t) {
    var tablesSheets = [];
    var data = [];
    var vals = [];
    for(var i = 0; i < 19; i++){
      tablesSheets[i] = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Table " + (i+1));
      data[i] = tablesSheets[i].getDataRange();
      vals[i] = data[i].getValues();
    }
    
    var counter = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    
    var tableColumn;
    for(i = 0; i < data[0].getNumColumns(); i++){
      var title = vals[0][0][i];
      if(title == "Table"){
        tableColumn = i;
        i = data[0].getNumColumns();
      }
    }
    
    for(i = 0; i < data.length; i++){
      for(var j = 1; j < data[i].getNumRows(); j++){
        if(vals[i][j][tableColumn] != i+1){
          counter[i]++;
        }
      }
    }
    
    var count = 0;
    for(i = 0; i < counter.length; i++){
      if(counter[i] !== 0){
        t.errorSpot("Table " + (i+1) + " sheet has incorrect students!", false);
        count++;
      }
    }
    if(count === 0)
      t.errorSpot("All table tests passed!", true);
  });
}

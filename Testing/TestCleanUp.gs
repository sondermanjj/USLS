
/**
*
*/
function runCleanUpTests() {
  
  var dataSheet = SpreadsheetApp.getActive().getSheetByName("Raw Data");
  cleanUp(dataSheet);
  
  runCorrectBlockDataTest();
  runCorrectLunchDayDataTest();
  
}

function runCorrectBlockDataTest() {  
  
  // Here's where we actually run the tests:
  return allTests(function(t) {
    
    var errors = 0;
    //Check the framework is working
    t.areEqual(1,1);
    //Get necessary data 
    var range = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Final Student Data")
    .getDataRange();
    
    var values = range.getValues();
    
    var numRows = values.length;
    var numColumns = values[0].length;
    
    for (var i = 0; i <= numColumns - 1; i++) {
      var column = values[0][i];
      if (column == 'Block') {
        blockFound = true;
        var blockColumn = i ;
      }
    }
    
    //Check for innapropriate blocks
    for (var j = 1; j < numRows - 1; j++) {
      var row = values[j][blockColumn];
      if(row == "1" || row == "2" || 
         row == "3" || row == "4" || 
         row == "5" || row == "6" || 
         row == "7" || row == "8" ||
         row == "E1" || row == "G2" || 
         row == "A3" || row == "C4" || 
         row == "F5" || row == "H6" || 
         row == "B7" || row == "D8") {
        
        t.errorSpot("Lunch Ok!", true);
      } else {
        range.getCell(j+1, blockColumn +1).setBackground("red");
        t.errorSpot("Cell ("+(j+1)+","+(blockColumn+1)+"), innapropriate block", false);
      }
    }
    
  });
}

function runCorrectLunchDayDataTest() {  
  
  // Here's where we actually run the tests:
  return allTests(function(t) {
    
    //Check the framework is working
    t.areEqual(1,1);
    
    
    //Get necessary data 
    var range = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Final Student Data")
    .getDataRange();
    
    var values = range.getValues();
    
    var numRows = values.length;
    var numColumns = values[0].length;
    
    //Get the indices for the 'Block' and 'Lunch Day' columns
    for (var i = 0; i <= numColumns - 1; i++) {
      var column = values[0][i];
      if (column == 'Block') {
        blockFound = true;
        var blockColumn = i ;
      }
      
      if (column == 'Lunch Day') {
        lunchDayFound = true;
        var lunchDayColumn = i ;
      }
    }
    
    //Check for innapropriate lunch days
    for (var j = 0; j <= numRows - 1; j++) {
      if (values[j][blockColumn] == "1" || values[j][blockColumn] == "E1") {
        
        if (values[j][lunchDayColumn] != "E") {
          range.getCell(j+1, lunchDayColumn+1).setBackground("red");
          t.errorSpot("Cell ("+(j+1)+","+(lunchDayColumn+1)+"), innapropriate block", false);
        } else {
          t.errorSpot("Lunch Okay", true);
        }
        
      } else if (values[j][blockColumn] == "2" || values[j][blockColumn] == "G2") {
        
        if (values[j][lunchDayColumn] != "G") {
          range.getCell(j+1, lunchDayColumn+1).setBackground("red");
          t.errorSpot("Cell ("+(j+1)+","+(lunchDayColumn+1)+"), innapropriate block", false);
          
        } else {
          t.errorSpot("Lunch Okay", true);
        }
        
      } else if (values[j][blockColumn] == "3" || values[j][blockColumn] == "A3") {
        
        if (values[j][lunchDayColumn] != "A") {
          range.getCell(j+1, lunchDayColumn+1).setBackground("red");
          t.errorSpot("Cell ("+(j+1)+","+(lunchDayColumn+1)+"), innapropriate block", false);
          
        } else {
          t.errorSpot("Lunch Okay", true);
        }
        
      } else if (values[j][blockColumn] == "4" || values[j][blockColumn] == "C4") {
        
        if (values[j][lunchDayColumn] != "C") {
          range.getCell(j+1, lunchDayColumn+1).setBackground("red");
          t.errorSpot("Cell ("+(j+1)+","+(lunchDayColumn+1)+"), innapropriate block", false);
          
        } else {
          t.errorSpot("Lunch Okay", true);
        }
        
      } else if (values[j][blockColumn] == "5" || values[j][blockColumn] == "F5") {
        
        if (values[j][lunchDayColumn] != "F") {
          range.getCell(j+1, lunchDayColumn+1).setBackground("red");
          t.errorSpot("Cell ("+(j+1)+","+(lunchDayColumn+1)+"), innapropriate block", false);
          
        } else {
          t.errorSpot("Lunch Okay", true);
        }
        
      } else if (values[j][blockColumn] == "6" || values[j][blockColumn] == "H6") {
        
        if (values[j][lunchDayColumn] != "H") {
          range.getCell(j+1, lunchDayColumn+1).setBackground("red");
          t.errorSpot("Cell ("+(j+1)+","+(lunchDayColumn+1)+"), innapropriate block", false);
          
        } else {
          t.errorSpot("Lunch Okay", true);
        }
        
      } else if (values[j][blockColumn] == "7" || values[j][blockColumn] == "B7") {
        
        if (values[j][lunchDayColumn] != "B") {
          range.getCell(j+1, lunchDayColumn+1).setBackground("red");
          t.errorSpot("Cell ("+(j+1)+","+(lunchDayColumn+1)+"), innapropriate block", false);
          
        } else {
          t.errorSpot("Lunch Okay", true);
        }
        
      } else if (values[j][blockColumn] == "8" || values[j][blockColumn] == "D8") {
        
        if (values[j][lunchDayColumn] != "D") {
          range.getCell(j+1, lunchDayColumn+1).setBackground("red");
          t.errorSpot("Cell ("+(j+1)+","+(lunchDayColumn+1)+"), innapropriate block", false);
          
        } else {
          t.errorSpot("Lunch Okay", true);
        }
      }
    }
    
  });
}
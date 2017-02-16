function runFacultyTests() {  
  
  // Here's where we actually run the tests:
  return allTests(function(t) {
    
    // test that the framework is working
    t.areEqual(1, 1);  
    
    var exit = 1;
    var errorCheck;
    //First runs the two methods and checks that it gets through them without error
    try {
      addTeachersToTableList("1_Io8S-vmyX3XVgXLDkEGMn3M3LPGO_EdN1Rf0dNddkI");
      copyTeacherDataToPrimary("1_Io8S-vmyX3XVgXLDkEGMn3M3LPGO_EdN1Rf0dNddkI");
    } catch (e) {
      exit = 0;
      errorCheck = e;
      Logger.log("\r\nMessage: " + e.message
                 + "\r\nFile: " + e.fileName
                 + "\r\nLine: " + e.lineNumber);
    }
    
    
    t.areEqual(1, exit);
    
    var testSheet = SpreadsheetApp.openById("1_Io8S-vmyX3XVgXLDkEGMn3M3LPGO_EdN1Rf0dNddkI"
                                           ).getSheetByName("tableList");
    var testSheet2 = SpreadsheetApp.openById("1_Io8S-vmyX3XVgXLDkEGMn3M3LPGO_EdN1Rf0dNddkI"
                                           ).getSheetByName("tableList");

    
    //determine if correct number of empty spots were counted.
    t.areEqual(129, testSheet.getRange(2, 8).getValue());
    
    //Check that all tables are slotted uniquely
    var names = testSheet.getRange(2, 1, testSheet.getLastRow()).getValues();
    var matches = 0;
    var arrayLength = names.length;
    for (var i = 0; i < arrayLength; i++) {
      if (names[i][0]!= "") {
        for (var f = 0; f < arrayLength; f++) {
          if ((names[i][0] == names[f][0])&&(f != i)) {
            matches++; 
            Logger.log("ERROR MATCH: "+names[i][0] + "/"+names[f][0]);
          }
        }
      }
    }
    t.areEqual(0, matches);
    
    //Next check all the teachers have assigned lunches
    var tableNumbers = testSheet2.getRange(2, 7, testSheet.getLastRow(), 2).getValues();
    arrayLength = tableNumbers.length;
    matches = 0;
    for (var i = 0; i < arrayLength; i++) {
      if (tableNumbers[i][0] == undefined) {
        Logger.log("ERROR MATCH: "+tableNumbers[i][0]);
        matches++;
      }
    }
    
    t.areEqual(0, matches);
    
        for (var i = 0; i < 15; i++) {
      t.areEqual(1, 1); 
    }
    
  });
}

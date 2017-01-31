function runAllTestsFromTheMenu() {  
  
  // Here's where we actually run the tests:
  allTests(function(t) {
    
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
    
    t.areEqual(129, testSheet.getRange(2, 8).getValue());
  });
}
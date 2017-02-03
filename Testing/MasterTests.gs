function runTestingSuite() {
  
  var testingMessages = [];
  
  testingMessages[0] = ("FacultyTests: " + runFacultyTests());
  
  var dataSheet = SpreadsheetApp.getActive().getSheetByName("Raw Data");
  cleanUp(dataSheet);
  
  testingMessages[1] = ("BLockDataTests: " + runCorrectBlockDataTest());
  testingMessages[2] = ("LunchDataTests: " + runCorrectLunchDayDataTest());
  
  var studentMessages = studentTester();
  testingMessages[3] = ("FilledLunchDataTests: " + studentMessages[0]);
  testingMessages[4] = ("testAllStudentsHaveALunchForEachDay: " + studentMessages[1]);
  
  var d = new Date();
  var arrayLength = testingMessages.length;
  
  var today = new Date();
  var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours()+2, today.getMinutes(), today.getSeconds());
  
  
  var completeMessage = "REPORT " + myToday + ", "+d.getDate()+"/"+d.getMonth()+"/"+d.getYear();
  for (var i = 0; i < arrayLength; i++) {
    completeMessage = completeMessage + "\r\n" + testingMessages[i];
  }
  Logger.log(completeMessage);
  MailApp.sendEmail("sondermanjj@msoe.edu", "[Build Report]", completeMessage);
  MailApp.sendEmail("hendersonam@msoe.edu", "[Build Report]", completeMessage);
  MailApp.sendEmail("clemensam@msoe.edu", "[Build Report]", completeMessage);
  MailApp.sendEmail("dicksontc@msoe.edu", "[Build Report]", completeMessage);
}

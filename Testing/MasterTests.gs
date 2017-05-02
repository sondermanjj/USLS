function runTestingSuite() {
  
  var testingMessages = [];
  var i = 0;

  var cleanUpMessages = runCleanUpTests();
  var studentMessages = studentTester();

  
  for (var v = 0; v < cleanUpMessages.length; v++) {
   testingMessages[i] = cleanUpMessages[v]+ "\n";
    i++;
  }
  
  for (var v = 0; v< studentMessages.length; v++) {
   testingMessages[i] = studentMessages[v] + "\n"; 
    i++;
  }
  
  testingMessages[i] = ("FacultyTests: " + runFacultyTests()+ "\n");
  i++
    
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

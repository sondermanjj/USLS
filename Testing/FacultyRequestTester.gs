//JSHint verified 5/17/2017 dicksontc

/**
* @desc - Wraps the FacultyRequest tests into a message that can be used.
* @author - dicksontc
*/
function runFacultyRequestTests() {
  parseRequests();
  var messages = [];
  
  messages[0] = "testHouseAssignmentForFaculty: " + testHouseAssignmentForFaculty();
  messages[1] = "testHouseAssignmentForStudents: " + testHouseAssignmentForStudents();
  
  Logger.log(messages);

  return messages;
  
}

/**
  * @desc - Test to make sure the houses are being correctly assigned to faculty
  * @author - dicksontc
  */
function testHouseAssignmentForFaculty() {

  return allTests(function(t) {
    var properties = PropertiesService.getDocumentProperties();
    var responses = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
    var teacher = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("teacherChoices"));
    
    var responseData = responses.getDataRange().getValues();
    var teacherData = teacher.getDataRange().getValues();
    
    var listOfColumnsResponse = getListOfColumns(responseData);
    var listOfColumnsTeacher = getListOfColumns(teacherData);
    var firstNameColumnR = getColumnIndex(listOfColumnsResponse, "First Name");
    var lastNameColumnR = getColumnIndex(listOfColumnsResponse, "Last Name");
    var houseColumnR = getColumnIndex(listOfColumnsResponse, "House");
    var firstNameColumnT = getColumnIndex(listOfColumnsTeacher, "First Name");
    var lastNameColumnT = getColumnIndex(listOfColumnsTeacher, "Last Name");
    var houseColumnT = getColumnIndex(listOfColumnsTeacher, "House");
    
    for( var i = 0; i < teacherData.length; i++) {
      var tFName = teacherData[i][firstNameColumnT];
      var tLName = teacherData[i][lastNameColumnT];
      var tHouse = teacherData[i][houseColumnT];
      if(tFName !== "First Name"){
        for(var j = 0; j < responseData.length; j++){
          var rFName = responseData[j][firstNameColumnR];
          var rLName = responseData[j][lastNameColumnR];
          var rHouse = responseData[j][houseColumnR];
          if (rFName !== "First Name" && tFName === rFName && tLName === rLName) {
            if(tHouse === rHouse){
              t.errorSpot("" + tFName + " " + tLName + " house correct", true);
            }else{
              t.errorSpot("" + tFName + " " + tLName + " house incorrect", false);
            }
            j = responseData.length;
          }
        }
      }
    }
  });
}

/**
  * @desc - Test to make sure the houses are being correctly assigned to students
  * @author - dicksontc
  */
function testHouseAssignmentForStudents() {

  return allTests(function(t) {
    var properties = PropertiesService.getDocumentProperties();
    var student = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("studentData"));
    var teacher = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("teacherChoices"));
    
    var studentData = student.getDataRange().getValues();
    var teacherData = teacher.getDataRange().getValues();
    
    var listOfColumnsStudent = getListOfColumns(studentData);
    var listOfColumnsTeacher = getListOfColumns(teacherData);
    var advisorColumnS = getColumnIndex(listOfColumnsStudent, "Advisor");
    var houseColumnS = getColumnIndex(listOfColumnsStudent, "House");
    var firstNameColumnS = getColumnIndex(listOfColumnsStudent, "First Name");
    var lastNameColumnS = getColumnIndex(listOfColumnsStudent, "Last Name");
    var firstNameColumnT = getColumnIndex(listOfColumnsTeacher, "First Name");
    var lastNameColumnT = getColumnIndex(listOfColumnsTeacher, "Last Name");
    var houseColumnT = getColumnIndex(listOfColumnsTeacher, "House");
    
    for( var i = 0; i < studentData.length; i++) {
      var sAdvisor = studentData[i][advisorColumnS];
      var sHouse = studentData[i][houseColumnS];
      var sFName = studentData[i][firstNameColumnS];
      var sLName = studentData[i][lastNameColumnS];
      if(sAdvisor !== "Advisor"){
        for(var j = 0; j < teacherData.length; j++){
          var tName = "" + teacherData[j][firstNameColumnT] + " " + teacherData[j][lastNameColumnT];
          var tHouse = teacherData[j][houseColumnT];
          
          if (sAdvisor === tName) {
            if(sHouse === tHouse){
              t.errorSpot("" + sFName + " " + sLName + " house correct", true);
            }else{
              t.errorSpot("" + sFName + " " + sLName + " house incorrect", false);
            }
            j = teacherData.length;
          }
        }
      }
    }
  });
}


//JSHint verified 5/17/2017 dicksontc

/**
* @desc - Wraps the FacultyRequest tests into a message that can be used.
* @author - dicksontc
*/
function runFacultyRequestTests() {

  var messages = [];
  
  messages[0] = "testHouseAssignmentForFaculty: " + testHouseAssignmentForFaculty();
  
  Logger.log(messages[0]);

  return messages;
  
}

/**
  * @desc - Test to make sure the houses are being correctly assigned
  * @author - dicksontc
  */
function testHouseAssignmentForFaculty() {

  return allTests(function(t) {
    var properties = PropertiesService.getDocumentProperties();
    var responses = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
    var teacher = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("teacherChoices"));
    
    sortSheetBy(responses, ["First Name", "Last Name"]);
    var responseData = responses.getDataRange().getValues();
    sortSheetBy(teacher, ["First Name", "Last Name"]);
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
          }
        }
      }
    }
  });
}


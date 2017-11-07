/**
 * @desc - Sets the properties for the document, cleans the raw file, assigns students, assigns
 *         faculty tables, and scans the data to retrieve statistics and to prepare for schedule changes
 * @author - hendersonam
 */
function initialization(sheetNames) {

  Logger.log(sheetNames);
  PropertiesService.getDocumentProperties().deleteAllProperties();
  setLunchProperties();

  setRawSheetProperty(sheetNames.raw);
  var cleanedSheet = cleanUp(sheetNames.raw, sheetNames.student);
  
  if (cleanedSheet) {
  
    var oldData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Scanned Data");
    if (oldData != null ) {
      SpreadsheetApp.getActiveSpreadsheet().deleteSheet(oldData);
    }
    var oldChanges = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Schedule Changes");
    if (oldChanges != null ) {
      SpreadsheetApp.getActiveSpreadsheet().deleteSheet(oldChanges);
    }
    
    setSheetProperties(cleanedSheet, sheetNames.faculty, sheetNames.dod, sheetNames.choices);
    setFacultyCourses();
    assignStudents();
  
  } else {
    return;
  }
}

function assignStudents() {
    assignStudentLunchDays();
    pushCoursesToCourseSheet();
    addFacultyTables();
}
/**
 * @desc - Sets the properties for the document, cleans the raw file, assigns students, assigns
 *         faculty tables, and scans the data to retrieve statistics and to prepare for schedule changes
 * @author - hendersonam
 */
function initialization() {

  PropertiesService.getDocumentProperties().deleteAllProperties();
  setLunchProperties();

  var cleanedSheet = sheetCleanupPrompt();
  
  if (cleanedSheet) {
  
    var oldData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Scanned Data");
    if (oldData != null ) {
      SpreadsheetApp.getActiveSpreadsheet().deleteSheet(oldData);
    }
    var oldChanges = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Student Schedule Changes");
    if (oldChanges != null ) {
      SpreadsheetApp.getActiveSpreadsheet().deleteSheet(oldChanges);
    }
    
    setSheetProperties(cleanedSheet);
    assignStudentLunchDays();
    addFacultyTables();
  
  } else {
    SpreadsheetApp.getUi().alert("Clean up failed, cannot set properties!");
  }
}
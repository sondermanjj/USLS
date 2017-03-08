/**
 * @desc - Sorts the active sheet according to macro shortcut Option+Cmd+1
 * @author - hendersonam
 */
function sortByLunches() {
  sortSheetBy(SpreadsheetApp.getActiveSheet(), ["First Name", "Last Name", "Grade Level", "Table Head", "Lunch Day"]);
}

/**
 * @desc - Sorts the active sheet according to macro shortcut Option+Cmd+j
 * @author - hendersonam
 */
function sortByLunchesThenTableNumber() {
  sortSheetBy(SpreadsheetApp.getActiveSheet(), ["First Name", "Last Name", "Grade Level", "Table Head", "Table Number", "Lunch Day"]);
}

/**
 * @desc - Sorts the active sheet according to macro shortcut Option+Cmd+k
 * @author - hendersonam
 */
function sortByTable() {
  sortSheetBy(SpreadsheetApp.getActiveSheet(), ["First Name", "Last Name", "Grade Level", "Table Head", "Lunch Day", "Table Number"]);
}

/**
 * @desc - Sorts the active sheet according to macro shortcut Option+Cmd+t
 * @author - hendersonam
 */
function sortByCourses() {
  sortSheetBy(SpreadsheetApp.getActiveSheet(), ["First Name", "Last Name", "Grade Level", "Section Identifier", "Course Title", "Faculty First Name", "Faculty Last Name"]);
}

/**
 * @desc - Sorts the active sheet according to macro shortcut Option+Cmd+g
 * @author - hendersonam
 */
function sortByIndivicualsByLunchDay() {
  sortSheetBy(SpreadsheetApp.getActiveSheet(), ["Lunch Days", "First Name", "Last Name", "Grade Level"]);
}

/**
 * @desc - Sorts the active sheet according to macro shortcut Option+Cmd+n
 * @author - hendersonam
 */
function sortByLunches() {
  sortSheetBy(SpreadsheetApp.getActiveSheet(), ["Block", "Lunch Day", "First Name", "Last Name", "Grade Level"]);
}

/**
 * @desc - Sorts the active sheet according to macro shortcut Option+Cmd+p
 * @author - hendersonam
 */
function sortByHouse() {
  sortSheetBy(SpreadsheetApp.getActiveSheet(), ["First Name", "Last Name", "Grade Level", "Lunch Day", "House"]);
}
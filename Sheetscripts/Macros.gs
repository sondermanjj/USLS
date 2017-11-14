//JSHint verified 11/10/2017 dicksontc

/**
* Universal search methods that determines which sort to do based on letter passed in which represents the buton that was pressed
* @ author - clemensam
*/
function sort(x){
  var sort = x.split(",");
  switch(sort[0]){
    case "l": 
      sortByLunches();
      break;
    case "n":
      sortByLunchesThenTableNumber();
      break;
    case "j":
      sortByTable();
      break;
    case "k":
      sortByCourses();
      break;
    case "t":
      sortByIndividualsByLunchDay();
      break;
    case "g":
      sortByIndividualsByBlock();
      break;
    case "p":
      sortByHouse();
      break;
    case "sort":
      var filters = [];
      for(var i = 1; i < sort.length; i++){
        filters.push(sort[i].toString());
      }
      sortSheetBy(SpreadsheetApp.getActiveSheet(), filters);
  }
}

/**
 * @desc - Sorts the active sheet according to macro shortcut Option+Cmd+1
 * @author - hendersonam
 */
function sortByLunches() {
  sortSheetBy(SpreadsheetApp.getActiveSheet(), ["First Name", "Last Name", "Grade Level", "Table Head", "Lunch Day"]);
}

/**
 * @desc - Sorts the active sheet according to macro shortcut Option+Cmd+n
 * @author - hendersonam
 */
function sortByLunchesThenTableNumber() {
  sortSheetBy(SpreadsheetApp.getActiveSheet(), ["First Name", "Last Name", "Grade Level", "Table Head", "Lunch Table", "Lunch Day"]);
}

/**
 * @desc - Sorts the active sheet according to macro shortcut Option+Cmd+j
 * @author - hendersonam
 */
function sortByTable() {
  sortSheetBy(SpreadsheetApp.getActiveSheet(), ["First Name", "Last Name", "Grade Level", "Table Head", "Lunch Day", "Lunch Table"]);
}

/**
 * @desc - Sorts the active sheet according to macro shortcut Option+Cmd+k
 * @author - hendersonam
 */
function sortByCourses() {
  sortSheetBy(SpreadsheetApp.getActiveSheet(), ["First Name", "Last Name", "Grade Level", "Section Identifier", "Course Title", "Faculty First Name", "Faculty Last Name"]);
}

/**
 * @desc - Sorts the active sheet according to macro shortcut Option+Cmd+t
 * @author - hendersonam
 */
function sortByIndividualsByLunchDay() {
  sortSheetBy(SpreadsheetApp.getActiveSheet(), ["Lunch Day", "First Name", "Last Name", "Grade Level"]);
}

/**
 * @desc - Sorts the active sheet according to macro shortcut Option+Cmd+g
 * @author - hendersonam
 */
function sortByIndividualsByBlock() {
  sortSheetBy(SpreadsheetApp.getActiveSheet(), ["Block", "First Name", "Last Name", "Grade Level"]);
}

/**
 * @desc - Sorts the active sheet according to macro shortcut Option+Cmd+p
 * @author - hendersonam
 */
function sortByHouse() {
  sortSheetBy(SpreadsheetApp.getActiveSheet(), ["First Name", "Last Name", "Grade Level", "Lunch Day", "House"]);
}
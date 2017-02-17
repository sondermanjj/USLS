/**
 * @desc - Returns the statistics for the students and teachers
 * @return - String - HTML for 2 tables, one for student statistics and one for teacher statistics
 * @author - hendersonam
 */
function getStatistics() {
  var html = "Number of Students:\n" + getStudentStatistics();
  html += "Number of Teachers:\n" + getTeacherStatistics();
  return html;
}

/**
 * @desc - Returns an html table with current student statistics
 * @return - An html table with the number of students in each lunch on each day
 * @author - hendersonam
 */
function getStudentStatistics() {
  var time = ["Early", "Mid", "Late"];
  var day = ["A", "B", "C", "D", "E", "F", "G", "H"];
  var tableValues = statistics(time, day, getFinalStudentDataValues(), true);
  
  return getHTMLTable(time, day, tableValues);
  
}

/**
 * @desc - Returns an html table with current teacher statistics
 * @return - An html table with the number of teachers in each lunch on each day
 * @author - hendersonam
 */
function getTeacherStatistics() {
  var time = ["Early", "Mid", "Late"];
  var day = ["A", "B", "C", "D", "E", "F", "G", "H"];
  var tableValues = statistics(time, day, getFinalStudentDataValues(), false);
  
  return getHTMLTable(time, day, tableValues);
}

/**
 * @desc- Returns an html table with the given data
 * @param - Array[] - An array with the name of each column
 *          Array[] - An array with the name of each row
 *          Array[row][column] - An array with the data for each cell in the table
 * @return - String - table in html format to be displayed in the UI
 * @author - hendersonam
 */
function getHTMLTable(columns, rows, values) {
  
  var html = "<table>";
  html += "<tr>\n<th></th>\n";
  for(var column = 0; column < columns.length; column++){
     html += "<th>" + columns[column] + "</th>\n";
  }
  html += "</tr>\n";
  
  for ( var row = 0; row < rows.length ; row++ ) {
    html += "<tr><td>" + rows[row] + "</td>";
    for ( column = 0; column < columns.length ; column++ ) {
      html += "<td>" + values[row][column] + "</td>";
    }
    html += "</tr>\n";
  }
  html += "</table>\n";
  
  return html;
      
}


/**
 * @desc - Counts the number of people in each lunch on each day
 * @param - Boolean - true if getting student statistics, false for teacher statistics
 * @return - Array[row][column] - the number of students for each lunch
 * @author - hendersonam
 */
function statistics(time, day, values, students) {

  var stats = new Array();
  for (var i = 0; i < day.length; i++) {
    stats[i] = new Array();
  }
  for (var i = 0; i < day.length; i++) {
    for( var j = 0; j < time.length; j++) { 
      stats[i][j] = 0;
    }
  }
  
  
  var listOfColumns = getListOfColumns(values);
  var lunchDayColumn = getColumnIndex(listOfColumns, "Lunch Day");
  var gradeColumn = getColumnIndex(listOfColumns, "Grade");
  var lunchTimeColumn = getColumnIndex(listOfColumns, "Lunch Time");
  var flag;
  var lunchDay;
  var lunchTime;
  
  for( var k = 1; k < values.length; k++) {
  
    lunchDay = values[k][lunchDayColumn].toString().toUpperCase();
    lunchTime = values[k][lunchTimeColumn].toString().toLowerCase();
    
    if( (values[k][gradeColumn] != "") == students) {
    
      switch (lunchDay) {
      
        case 'A':
          lunchDay = 0;
          switch (lunchTime) {
            case 'early':
              lunchTime = 0;
              break;
            case 'mid':
              lunchTime = 1;
              break;
            case 'late':
              lunchTime = 2;
              break;
            default:
              //SpreadsheetApp.getUi().alert("Row " + k + " has an incorrect lunch time");
              break;
          }
          break;
        case 'B':
            lunchDay = 1;
          switch (lunchTime) {
            case 'early':
              lunchTime = 0;
              break;
            case 'mid':
              lunchTime = 1;
              break;
            case 'late':
              lunchTime = 2;
              break;
            default:
              //SpreadsheetApp.getUi().alert("Row " + k + " has an incorrect lunch time");
              break;
          }
          break;
        case 'C':
            lunchDay = 2;
          switch (lunchTime) {
            case 'early':
              lunchTime = 0;
              break;
            case 'mid':
              lunchTime = 1;
              break;
            case 'late':
              lunchTime = 2;
              break;
            default:
              //SpreadsheetApp.getUi().alert("Row " + k + " has an incorrect lunch time");
              break;
          }
          break;
        case 'D':
            lunchDay = 3;
          switch (lunchTime) {
            case 'early':
              lunchTime = 0;
              break;
            case 'mid':
              lunchTime = 1;
              break;
            case 'late':
              lunchTime = 2;
              break;
            default:
              //SpreadsheetApp.getUi().alert("Row " + k + " has an incorrect lunch time");
              break;
          }
          break;
        case 'E':
            lunchDay = 4;
          switch (lunchTime) {
            case 'early':
              lunchTime = 0;
              break;
            case 'mid':
              lunchTime = 1;
              break;
            case 'late':
              lunchTime = 2;
              break;
            default:
              //SpreadsheetApp.getUi().alert("Row " + k + " has an incorrect lunch time");
              break;
          }
          break;
        case 'F':
            lunchDay = 5;
          switch (lunchTime) {
            case 'early':
              lunchTime = 0;
              break;
            case 'mid':
              lunchTime = 1;
              break;
            case 'late':
              lunchTime = 2;
              break;
            default:
              //SpreadsheetApp.getUi().alert("Row " + k + " has an incorrect lunch time");
              break;
          }
          break;
        case 'G':
            lunchDay = 6;
          switch (lunchTime) {
            case 'early':
              lunchTime = 0;
              break;
            case 'mid':
              lunchTime = 1;
              break;
            case 'late':
              lunchTime = 2;
              break;
            default:
              //SpreadsheetApp.getUi().alert("Row " + k + " has an incorrect lunch time");
              break;
          }
          break;
        case 'H':
            lunchDay = 7;
          switch (lunchTime) {
            case 'early':
              lunchTime = 0;
              break;
            case 'mid':
              lunchTime = 1;
              break;
            case 'late':
              lunchTime = 2;
              break;
            default:
              //SpreadsheetApp.getUi().alert("Row " + k + " has an incorrect lunch time");
              break;
          }
          break;
        default:
          //SpreadsheetApp.getUi().alert("Row " + k + " has an incorrect lunch day");
          break;  
      }
      if (!isNaN(lunchDay) && !isNaN(lunchTime)) { 
        stats[lunchDay][lunchTime] += 1;
      }
    }
  }
  return stats;
}



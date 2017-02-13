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
 * @desc - Counts the number of students in each lunch on each day
 * @param - Boolean - true if getting student statistics, false for teacher statistics
 * @return - Array[row][column] - the number of students for each lunch
 * @author - hendersonam
 */
function statistics(time, day, values, students) {

  var stats = new Array();
  
  var lunchTimeColumn,
    lunchDayColumn,
    gradeColumn,
    count;
  
  for (var i = 0; i <= values[0].length; i++) {
    var column = values[0][i];
    if (column == 'Lunch Time') {
      lunchTimeColumn = i ;
    }
    if (column == 'Lunch Day') {
      lunchDayColumn = i ;
    }
    if (column == 'Grade') {
      gradeColumn = i;
    }
  }
  
  for( i = 0; i < day.length; i++) {
    stats[i] = new Array();
    for( var j = 0;  j < time.length; j++) {
      count =0;
      for( var k = 0; k < values.length; k++) {
        if(values[k][lunchTimeColumn] == time[j].toString().toLowerCase() && values[k][lunchDayColumn] == day[i]) {
          if(students) {
            if(values[k][gradeColumn] != "") {
              count++;
            }
          } else {
            if(values[k][gradeColumn] == "") {
              count++;
            }
          }
        }
      }
      stats[i][j] = count;
    }
  }

  return stats;
}

/**
 * @desc - Returns the data values from the Final Student Data sheet
 * @return Object[][] - the data values
 * @author - hendersonam
 */
function getFinalStudentDataValues() {
  return SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Final Student Data")
    .getDataRange()
    .getValues();
  
}


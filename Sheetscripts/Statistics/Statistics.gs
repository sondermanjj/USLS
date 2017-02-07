
/**
 * @desc- Returns statistics for how many students are in each lunch on each day
 * @return - String - statistics in html format to be displayed in a table
 * @author - hendersonam
 */
function getHTMLForStatistics() {
  var time = ["Early", "Mid", "Late"];
  var day = ["A", "B", "C", "D", "E", "F", "G", "H"];
  var values = getFinalStudentDataValues();
  
  var html = "Data pulled from Final Student Data:\n<table>";
  html += "<tr>\n<th></th>\n";
  for(var numTimes = 0; numTimes < time.length; numTimes++){
     html += "<th>" + time[numTimes] + "</th>\n";
  }
  html += "</tr>\n";
  
  for ( var numDays = 0; numDays < day.length ; numDays++ ) {
    html += "<tr><td>" + day[numDays] + "</td>";
    for ( var numTime = 0; numTime < time.length ; numTime++ ) {
      html += "<td>" + statsFor(time[numTime], day[numDays], values) + "</td>";
    }
    html += "</tr>\n";
  }
  html += "</table>\n";
  
  Logger.log(html);
  return html;
      
}


/**
 * @desc - Counts the number of students in the given lunch time on the given lunch day
 * @param - String - The lunch time
 *          String - The lunch day
 *          Object[][] - the array of values from the sheet to search through
 * @return - int - the number of students
 */
function statsFor(time, day, values) {
  
  var lunchTimeColumn, lunchDayColumn, gradeColumn;
  var numberOfStudents = 0;
  
  for (var i = 0; i <= values[0].length - 1; i++) {
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
  
  for(var j = 0; j < values.length - 1; j++) {
    if(values[j][lunchTimeColumn] == time.toString().toLowerCase() && values[j][lunchDayColumn] == day && gradeColumn != "") {
      numberOfStudents++;
    }
  }
  
  return numberOfStudents.toString();
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


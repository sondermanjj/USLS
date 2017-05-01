//JSHint verified 4/3/2017 sondermanjj
var statshtml = "";
var updatedStats = false;

function getStatisticsHTML(){
  return statshtml;
}

/**
 * @desc - Returns the statistics for the students and teachers
 * @return - String - HTML for 2 tables, one for student statistics and one for teacher statistics
 * @author - hendersonam
 */
function getStatistics() {
  var statshtml = "<h3 id='studentTableHeader'>Number of Students:</h3>" + getStats(true);
  statshtml += "<h3 id='teacherTableHeader'>Number of Teachers:</h3>" + getStats(false);
  return statshtml;
}

/**
 * @desc - Returns an html table with current student statistics
 * @param - Boolean - True if getting student statistics, Fals if getting teacher statistics
 * @return - An html table with the number of students in each lunch on each day
 * @author - hendersonam
 */
function getStats(students) {

  var properties = PropertiesService.getDocumentProperties();
  var days = JSON.parse(properties.getProperty("letterDays"));
  var times = JSON.parse(properties.getProperty("lunchTimes"));
  var values = SpreadsheetApp
                  .getActiveSpreadsheet()
                  .getSheetByName(properties.getProperty("studentData"))
                  .getDataRange()
                  .getValues();
                  
  var tableValues = statistics(times, days, values, students);
  
  return "<table id='studentStatsTable'>" + getHTMLTable(times, days, tableValues);
  
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
  
  var tablehtml = "";
  //var html = "<table class='statsTable'>";
  tablehtml += "<tr><th></th>";
  for(var column = 0; column < columns.length; column++){
     tablehtml += "<th>" + columns[column] + "</th>";
  }
  tablehtml += "</tr>";
  
  for ( var row = 0; row < rows.length ; row++ ) {
    tablehtml += "<tr><td>" + rows[row] + "</td>";
    for ( column = 0; column < columns.length ; column++ ) {
      tablehtml += "<td>" + values[row][column] + "</td>";
    }
    tablehtml += "</tr>";
  }
  tablehtml += "</table>";
  
  return tablehtml;
      
}


/**
 * @desc - Counts the number of people in each lunch on each day
 * @param - Boolean - true if getting student statistics, false for teacher statistics
 * @return - Array[row][column] - the number of students for each lunch
 * @author - hendersonam
 */
function statistics(time, day, values, students) {


  var stats = [];

  for (var i = 0; i < day.length; i++) {
    stats[i] = [];
  }
  for (i = 0; i < day.length; i++) {
    for( var j = 0; j < time.length; j++) { 
      stats[i][j] = 0;
    }
  }
  
  var properties = PropertiesService.getDocumentProperties();
  
  var lunchDayColumn = parseInt(properties.getProperty("pLunchDayColumn"));
  var gradeColumn = parseInt(properties.getProperty("pGradeColumn"));
  var lunchTimeColumn = parseInt(properties.getProperty("pLunchTimeColumn"));
  var flag;
  var lunchDay;
  var lunchTime;
  var count;
  
  for( var k = 0; k < values.length; k++) {
  
    lunchDay = values[k][lunchDayColumn].toString().toLowerCase();
    lunchTime = values[k][lunchTimeColumn].toString().toLowerCase();
    
    if( (values[k][gradeColumn] !== "") == students) {
    
      count = 0;
      while( isNaN(lunchDay) ) {
        lunchDay == day[count].toString().toLowerCase() ? lunchDay = count : count++;
        if (count == day.length) break;
      }
      
      count = 0;
      while ( isNaN(lunchTime) ) {
        lunchTime == time[count].toString().toLowerCase() ? lunchTime = count : count++;
        if (count == time.length) break;
      }
      
      if (!isNaN(lunchDay) && !isNaN(lunchTime)) { 
        stats[lunchDay][lunchTime] += 1;
        if (count == time.length) break;
      }
      
      if (isNaN(lunchDay) && lunchDay != "lunch day" ) {
        SpreadsheetApp.getUi().alert("Alert! Row " + (k+1) + " has an incorrect lunch day value!");
      }
      
      if (isNaN(lunchTime) && lunchTime != "lunch time") {
        SpreadsheetApp.getUi().alert("Alert! Row " + (k+1) + " has an incorrect lunch time value!");
      }
    }
  }
  return stats;
}

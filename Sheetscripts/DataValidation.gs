function validateData(sheetData) {
  validateLunchTimes(sheetData);
  validateLunchDays(sheetData);
  validateTableNumbers(sheetData);
}

function validateColumn(data, column) {
  var properties = PropertiesService.getDocumentProperties();
  var lunchTimeColumn = parseInt(properties.getProperty("Student " + column));
  
  
  var incorrectCells = [];
  var sheetCell;
  var valid;
  
  for (var i = 0; i < data.length; i++) {
    sheetCell = sheetData[i][lunchTimeColumn]
    valid = false;
    for ( var j = 0; j < correctColumnValues.length; j ++) {
      if(sheetCell == correctColumnValues[j]) {
        valid = true;
      }
    }
    if(!valid) {
      incorrectCells.push(i+1);
    }
  }
  if (incorrectCells.length > 0) {
    //TODO
  }
}

function qwe() {
  var properties = PropertiesService.getDocumentProperties();
  var lunchTimeColumn = parseInt(properties.getProperty("pLunchTimeColumn"));
  var times = JSON.parse(properties.getProperty("lunchTimes"));
  
  Logger.log(times[1]);
}

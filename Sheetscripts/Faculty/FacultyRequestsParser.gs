//JSHint verified 4/3/2017 sondermanjj

/**
 * @desc - Parses through the responses from the Faculty Google Form
 * @functional - YES
 * @author - dicksontc
 */
function parseRequests() {
  var properties = PropertiesService.getDocumentProperties();
  var sheet = SpreadsheetApp.getActiveSheet();
  var responses = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
  if(responses !== null){
    var check = true;
    while(check){
      var teacher = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("teacherChoices"));
        
      var responseData = responses.getDataRange();
      var teacherData = teacher.getDataRange();
      
      var rValues = responseData.getValues();
      var tValues = teacherData.getValues();
      
      var rNumRows = responseData.getNumRows();
      var rNumColumns = responseData.getNumColumns();
      var tNumColumns = teacherData.getNumColumns();
      
      var rFNameColumn;
      var rLNameColumn;
      var rADayColumn;
      var rBDayColumn;
      var rCDayColumn;
      var rDDayColumn;
      var rEDayColumn;
      var rFDayColumn;
      var rGDayColumn;
      var rHDayColumn;
      var rEarlyColumn;
      var rMidColumn;
      var rLateColumn;
      var rCommentsColumn;
      var rHouseColumn;
      
      var tFNameColumn = parseInt(properties.getProperty("tFNameColumn"));
      var tLNameColumn = parseInt(properties.getProperty("tLNameColumn"));
      var tLunchDayColumn = parseInt(properties.getProperty("tLunchDayColumn"));
      var tLunchPreferenceColumn = parseInt(properties.getProperty("tLunchPreferenceColumn"));
      var tLunchTimeColumn = parseInt(properties.getProperty("tLunchTimeColumn"));
      var tCommentsColumn = parseInt(properties.getProperty("tCommentsColumn"));
      var tSectionColumn = parseInt(properties.getProperty("tSectionColumn"));
      var tHouseColumn = parseInt(properties.getProperty("tHouseColumn"));
      var tLunchTableColumn = parseInt(properties.getProperty("tLunchTableColumn"));
      var finalRows = [];
      if(tFNameColumn === undefined){
        teacher.clear();
        var newHeaders = ["First Name","Last Name","Lunch Day","Lunch Preference","Lunch Assignment","Table","House","Section","Comments"];
        for(var k = 0; k < newHeaders.length; k++){
          finalRows[0][k] = newHeaders[k];
        }
      }
      check = false;
    }
    var column;
    
    for(var i = 0; i < rNumColumns; i++){
      column = rValues[0][i];
      
      if(column == "First Name") {
        rFNameColumn = i ;
      }else if(column == "Last Name"){
        rLNameColumn = i;
      }else if(column == "Select for each day if you are Free, Teaching, or Off [A]"){
        rADayColumn = i;
      }else if(column == "Select for each day if you are Free, Teaching, or Off [B]"){
        rBDayColumn = i;
      }else if(column == "Select for each day if you are Free, Teaching, or Off [C]"){
        rCDayColumn = i;
      }else if(column == "Select for each day if you are Free, Teaching, or Off [D]"){
        rDDayColumn = i;
      }else if(column == "Select for each day if you are Free, Teaching, or Off [E]"){
        rEDayColumn = i;
      }else if(column == "Select for each day if you are Free, Teaching, or Off [F]"){
        rFDayColumn = i;
      }else if(column == "Select for each day if you are Free, Teaching, or Off [G]"){
        rGDayColumn = i;
      }else if(column == "Select for each day if you are Free, Teaching, or Off [H]"){
        rHDayColumn = i;
      }else if(column == "Early Lunch"){
        rEarlyColumn = i;
      }else if(column == "Mid Lunch"){
        rMidColumn = i;
      }else if(column == "Late Lunch"){
        rLateColumn = i;
      }else if(column == "Comments"){
        rCommentsColumn = i;
      }else if(column == "House"){
        rHouseColumn = i;
      }
    }
    
    var count = 0;
    for(i = 1; i < rNumRows; i++){
      var fname = rValues[i][rFNameColumn];
      var lname = rValues[i][rLNameColumn];
      if(fname !== "" && lname !== ""){
        var A = [];
        var B = [];
        var C = [];
        var D = [];
        var E = [];
        var F = [];
        var G = [];
        var H = [];
      
        var aSect = rValues[i][rADayColumn];
        var bSect = rValues[i][rBDayColumn];
        var cSect = rValues[i][rCDayColumn];
        var dSect = rValues[i][rDDayColumn];
        var eSect = rValues[i][rEDayColumn];
        var fSect = rValues[i][rFDayColumn];
        var gSect = rValues[i][rGDayColumn];
        var hSect = rValues[i][rHDayColumn];
        
        var comments = rValues[i][rCommentsColumn];
        
        var house = rValues[i][rHouseColumn];
        
        var early = rValues[i][rEarlyColumn].split(", ");
        var mid = rValues[i][rMidColumn].split(", ");
        var late = rValues[i][rLateColumn].split(", ");
      
        var everyDay = checkDays(early, mid, late, A, B, C, D, E, F, G, H);
        if(everyDay){
         for(var j = 0; j < 8; j++){
           count++;
           var tempArray = new Array(9);
    
           tempArray[tFNameColumn] = fname;
           tempArray[tLNameColumn] = lname;
           tempArray[tLunchDayColumn] = "";
           tempArray[tLunchPreferenceColumn] = "";
           tempArray[tLunchTimeColumn] = "";
           tempArray[tLunchTableColumn] = "";
           tempArray[tHouseColumn] = house;
           tempArray[tSectionColumn] = "";
           tempArray[tCommentsColumn] = comments;
           
           if(j === 0){
             tempArray[tLunchDayColumn] = "A";
             if(aSect != "Off")
               tempArray[tLunchPreferenceColumn] = A.toString();
             tempArray[tSectionColumn] = aSect;
           }else if(j == 1){
             tempArray[tLunchDayColumn] = "B";
             if(bSect != "Off")
               tempArray[tLunchPreferenceColumn] = B.toString();
             tempArray[tSectionColumn] = bSect;
           }else if(j == 2){
             tempArray[tLunchDayColumn] = "C";
             if(cSect != "Off")
               tempArray[tLunchPreferenceColumn] = C.toString();
             tempArray[tSectionColumn] = cSect;
           }else if(j == 3){
             tempArray[tLunchDayColumn] = "D";
             if(dSect != "Off")
               tempArray[tLunchPreferenceColumn] = D.toString();
             tempArray[tSectionColumn] = dSect;
           }else if(j == 4){
             tempArray[tLunchDayColumn] = "E";
             if(eSect != "Off")
               tempArray[tLunchPreferenceColumn] = E.toString();
             tempArray[tSectionColumn] = eSect;
           }else if(j == 5){
             tempArray[tLunchDayColumn] = "F";
             if(fSect != "Off")
               tempArray[tLunchPreferenceColumn] = F.toString();
             tempArray[tSectionColumn] = fSect;
           }else if(j == 6){
             tempArray[tLunchDayColumn] = "G";
             if(gSect != "Off")
               tempArray[tLunchPreferenceColumn] = G.toString();
             tempArray[tSectionColumn] = gSect;
           }else if(j == 7){
             tempArray[tLunchDayColumn] = "H";
             if(hSect != "Off")
               tempArray[tLunchPreferenceColumn] = H.toString();
             tempArray[tSectionColumn] = hSect;
           }
           finalRows.push(tempArray);
         }     
        }else{
          Logger.log("Row " + i + "does not have a lunch time picked for each day");
        }
      }
    }
    
    if(count > 0){
      pushToSheet(teacher, finalRows, count);
    }
    return 0;
  }else{
    SpreadsheetApp.getUi().alert("\"Form Responses 1\" sheet does not exist! Cannot assign faculty!");
    return -1;
  }
}

/**
 * @desc - Checks to see if the faculty member picked at least
 *          one lunch for each day
 * @param - early - the list of the days the faculty member
 *            wants early lunch
 *          mid - the list of the days the faculty member
 *            wants early lunch
 *          late - the list of the days the faculty member
 *            wants early lunch
 *          A - the list of lunch times for the day
 *          B - the list of lunch times for the day
 *          C - the list of lunch times for the day
 *          D - the list of lunch times for the day
 *          E - the list of lunch times for the day
 *          F - the list of lunch times for the day
 *          G - the list of lunch times for the day
 *          H - the list of lunch times for the day
 * @functional - YES
 * @author - dicksontc
 */
function checkDays(early, mid, late, A, B, C, D, E, F, G, H){
  var a = false;
  var b = false;
  var c = false;
  var d = false;
  var e = false;
  var f = false;
  var g = false;
  var h = false;
  
  for(var j = 0; j < early.length; j++){
    if(early[j] == "A"){
      a = true;
      A.push("early");
    }else if(early[j] == "B"){
      b = true;
      B.push("early");
    }else if(early[j] == "C"){
      c = true;
      C.push("early");
    }else if(early[j] == "D"){
      d = true;
      D.push("early");
    }else if(early[j] == "E"){
      e = true;
      E.push("early");
    }else if(early[j] == "F"){
      f = true;
      F.push("early");
    }else if(early[j] == "G"){
      g = true;
      G.push("early");
    }else if(early[j] == "H"){
      h = true;
      H.push("early");
    }
  }
  for(j = 0; j < mid.length; j++){
    if(mid[j] == "A"){
      a = true;
      A.push("mid");
    }else if(mid[j] == "B"){
      b = true;
      B.push("mid");
    }else if(mid[j] == "C"){
      c = true;
      C.push("mid");
    }else if(mid[j] == "D"){
      d = true;
      D.push("mid");
    }else if(mid[j] == "E"){
      e = true;
      E.push("mid");
    }else if(mid[j] == "F"){
      f = true;
      F.push("mid");
    }else if(mid[j] == "G"){
      g = true;
      G.push("mid");
    }else if(mid[j] == "H"){
      h = true;
      H.push("mid");
    }
  }
  for(j = 0; j < late.length; j++){
    if(late[j] == "A"){
      a = true;
      A.push("late");
    }else if(late[j] == "B"){
      b = true;
      B.push("late");
    }else if(late[j] == "C"){
      c = true;
      C.push("late");
    }else if(late[j] == "D"){
      d = true;
      D.push("late");
    }else if(late[j] == "E"){
      e = true;
      E.push("late");
    }else if(late[j] == "F"){
      f = true;
      F.push("late");
    }else if(late[j] == "G"){
      g = true;
      G.push("late");
    }else if(late[j] == "H"){
      h = true;
      H.push("late");
    }
  }
  if(a&&b&&c&&d&&e&&f&&g&&h)
    return true;
  else
    return false;
}

/**
 * @desc - Sets the values in the a given sheet to the parsed rows
 * @param - sheet - the sheet being edited
 *          rows - the values being added
 *          numRows - the number of rows being added
 * @functional - YES
 * @author - dicksontc
 */
function pushToSheet(sheet, rows, numRows){
  var sheetRange = sheet.getRange(2, 1, numRows, 9);
  sheetRange.setValues(rows);
}
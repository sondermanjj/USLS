/**
@desc Make sure each Early lunch is full, switching around faculty and mid lunch individuals as necessary
to reach 133 students. For late lunch, students are assigned to one of four groups based on their house.
*/
function assignStudentLunchDays() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var primary = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Primary List");
  var teacher = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Faculty Choices");
  
  var primaryData = primary.getDataRange();
  var teacherData = teacher.getDataRange();
  
  var pValues = primaryData.getValues();
  var tValues = teacherData.getValues();
  
  var pNumRows = primaryData.getNumRows();
  var pNumColumns = primaryData.getNumColumns();
  var tNumRows = teacherData.getNumRows();
  var tNumColumns = teacherData.getNumColumns();
  
  var pLunchTimeColumn;
  var pLunchDayColumn;
  var pSFNameColumn;
  var pSLNameColumn;
  var pTFNameColumn;
  var pTLNameColumn;
  var pTableColumn;
  var pHouseColumn;
  var tFNameColumn;
  var tLNameColumn;
  var tLunchDayColumn;
  var tLunchTimeColumn;
  
  //Set needed variables in Primary List
  for(var i = 0; i < pNumColumns; i++){
    var column = pValues[0][i];
    if(column == 'Lunch Day') {
      pLunchDayColumn = i ;
    }else if(column == 'Lunch Time'){
      pLunchTimeColumn = i;
    }else if(column == 'Faculty First Name'){
      pTFNameColumn = i;
    }else if(column == 'Faculty Last Name'){
      pTLNameColumn = i;
    }else if(column == 'First Name'){
      pSFNameColumn = i;
    }else if(column == 'Last Name'){
      pSLNameColumn = i;
    }else if(column == 'Lunch Table'){
      pTableColumn = i;
    }else if(column == 'House'){
      pHouseColumn = i;
    }
  }
  
  //Set needed variables in Faculty Choices
  for(var i = 0; i < tNumColumns; i++){
    var column = tValues[0][i];
    if(column == 'Lunch Day') {
      tLunchDayColumn = i ;
    }else if(column == 'First Name'){
      tFNameColumn = i;
    }else if(column == 'Last Name'){
      tLNameColumn = i;
    }else if(column == 'Lunch Assignment'){
      tLunchTimeColumn = i;
    }
  }
  
  //For every column in primary list assign student a lunch time based on the teacher
  //they have
  for(var i = 1; i < pNumRows; i++){
    var day = pValues[i][pLunchDayColumn];
    var teacherFName = pValues[i][pTFNameColumn];
    var teacherLName = pValues[i][pTLNameColumn];
    for(var j = 0; j < tNumRows; j++){
      if(teacherFName == '' && teacherLName == '' && day != 'I'){
        primaryData.getCell(i+1,pLunchTimeColumn+1).setValue('mid');
        j = tNumRows;
      }else if(tValues[j][tFNameColumn] == teacherFName && tValues[j][tLNameColumn] == teacherLName && tValues[j][tLunchDayColumn] == day ){
        primaryData.getCell(i+1,pLunchTimeColumn+1).setValue(tValues[j][tLunchTimeColumn]);
        j = tNumRows;
      }
    }
  }
  
  //assignZELM
  for(var i = 1; i < pNumRows; i++){
    var teacherFName = pValues[i][pTFNameColumn];
    var teacherLName = pValues[i][pTLNameColumn];
    if(teacherFName == '' && teacherLName == '' && day != 'I'){
      
    }
  }
  
  var pEarlyStudents = [];
  var pLateStudents = [];
  for(var i = 1; i < pNumRows; i++){
    var time = pValues[i][pLunchTimeColumn];
    if(time == 'early'){
      pEarlyStudents.push({firstName: pValues[i][pSFNameColumn], lastName: pValues[i][pSLNameColumn], day: pValues[i][pLunchDayColumn], row: i});
    }else if(time == 'late'){
      doLateAssignment(i,pHouseColumn, pValues, primaryData);
    }
  }
  
  var A = [];
  var B = [];
  var C = [];
  var D = [];
  var E = [];
  var F = [];
  var G = [];
  var H = [];
  
  for(var i = 0; i < pEarlyStudents.length; i++){
    var stu = pEarlyStudents[i];
    if(stu.day == "A")
      A.push(stu);
    else if(stu.day == "B")
      B.push(stu);
    else if(stu.day == "C")
      C.push(stu);
    else if(stu.day == "D")
      D.push(stu);
    else if(stu.day == "E")
      E.push(stu);
    else if(stu.day == "F")
      F.push(stu);
    else if(stu.day == "G")
      G.push(stu);
    else if(stu.day == "H")
      H.push(stu);
  }
  
  var cont = false;
  //While is for when I get picking new teachers down
  //while(!cont){
    if(A.length > 133 || B.length > 133 || C.length > 133 || D.length > 133 || E.length > 133 || F.length > 133 || G.length > 133 || H.length > 133){
      //Make teacher(s) pick new lunch times
    }else{
      cont = true;
    }
  //}
  
  if(A.length < 133){
    //Put mid students in to fill A
  }
  if(B.length < 133){
    //Put mid students in to fill B
  }
  if(C.length < 133){
    //Put mid students in to fill C
  }
  if(D.length < 133){
    //Put mid students in to fill D
  }
  if(E.length < 133){
    //Put mid students in to fill E
  }
  if(F.length < 133){
    //Put mid students in to fill F
  }
  if(G.length < 133){
    //Put mid students in to fill G
  }
  if(H.length < 133){
    //Put mid students in to fill H
  }
  
  doRandomAssignment(A,B,C,D,E,F,G,H, pTableColumn);
  
  if(A.length == 133 && B.length == 133 && C.length == 133 && D.length == 133 && E.length == 133 && F.length == 133 && G.length == 133 && H.length == 133){
    doRandomAssignment(A,B,C,D,E,F,G,H, pTableColumn);
  }
}

function doRandomAssignment(A,B,C,D,E,F,G,H, pTableColumn){
  var sheet = SpreadsheetApp.getActiveSheet();
  var primary = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Primary List");
  
  var primaryData = primary.getDataRange();
  var nums = [];
  for(var i = 0; i < 19 * 7; i++){
    nums.push(i%19+1);
  }
  
  nums = shuffleArray(nums);
  
  for(var i = 0; i < A.length; i++){
    primaryData.getCell(A[i].row + 1, pTableColumn + 1).setValue(nums[i]);
  }
  
  nums = shuffleArray(nums);
  
  for(var i = 0; i < B.length; i++){
    primaryData.getCell(B[i].row + 1, pTableColumn + 1).setValue(nums[i]);
  }
  
  nums = shuffleArray(nums);
  
  for(var i = 0; i < C.length; i++){
    primaryData.getCell(C[i].row + 1, pTableColumn + 1).setValue(nums[i]);
  }
  
  nums = shuffleArray(nums);
  
  for(var i = 0; i < D.length; i++){
    primaryData.getCell(D[i].row + 1, pTableColumn + 1).setValue(nums[i]);
  }
  
  nums = shuffleArray(nums);
  
  for(var i = 0; i < E.length; i++){
    primaryData.getCell(E[i].row + 1, pTableColumn + 1).setValue(nums[i]);
  }
  
  nums = shuffleArray(nums);
  
  for(var i = 0; i < F.length; i++){
    primaryData.getCell(F[i].row + 1, pTableColumn + 1).setValue(nums[i]);
  }
  
  nums = shuffleArray(nums);
  
  for(var i = 0; i < G.length; i++){
    primaryData.getCell(G[i].row + 1, pTableColumn + 1).setValue(nums[i]);
  }
  
  nums = shuffleArray(nums);
  
  for(var i = 0; i < H.length; i++){
    primaryData.getCell(H[i].row + 1, pTableColumn + 1).setValue(nums[i]);
  }
}

function doLateAssignment(row, col, pValues,primaryData){
  var house = pValues[row][col];
  primaryData.getCell(row+1, col+1).setValue(house);
}
  
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
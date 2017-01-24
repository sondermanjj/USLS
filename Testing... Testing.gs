function runAllTestsFromTheMenu() {  
  
  // Here's where we actually run the tests:
  allTests(function(t) {
    
    // test that the framework is working
    t.areEqual(1, 1);  
    
    // test the `add` function
    t.areEqual(5, add(1, 2));
    t.areEqual(7, add(0, 7));
    t.areEqual(1, add(10, -9));
 
  });
}

function add(one, two) {
 return one+two; 
}
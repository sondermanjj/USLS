/**
Initial Framework taken from Daniel Bernier in http://engineering.continuity.net/test-for-google-apps-script/
Adapted to our own use


*/
function allTests(thisFnWrapsAllYourTests) {
  var successes = 0;
  var failures = [];
  var scopes = [];
  
  var msgInScope = function(msg) {
    return scopes.concat([msg]).join(": ");
  }
  
  var doTheseListsMatch = function(expected, actual) {
    if (expected.length != actual.length) {
      return false;
    }
    
    for (var i = 0; i < expected.length; i++) {
      if (expected[i].constructor === Array && actual[i].constructor === Array) {
        if (!doTheseListsMatch(expected[i], actual[i])) {
          return false;
        }
      }
      else if (expected[i] !== actual[i]) {
        return false;
      }
    }
    return true;
  }
  
  function runTestAndRecordResult(message, fn) {
    try {
      if (fn()) {
        successes += 1;
      } else {
        failures.push(msgInScope(message));
      }
    }
    catch(x) {
      failures.push(msgInScope(x));
    }
  }
  
  thisFnWrapsAllYourTests({
    describe: function(blockName, thisFnWrapsOneTest) {
      scopes.push(blockName);
      thisFnWrapsOneTest();
      scopes.pop();
    },
    
    listMatch: function(expected, actual) {
      runTestAndRecordResult("Expected " + expected + ", got " + actual + ".", function() {
        return doTheseListsMatch(expected, actual);
      });
    },
    
    areEqual: function(expected, actual) {
      runTestAndRecordResult("Expected " + expected.constructor.name + " " + expected + ", got " + actual.constructor.name + " " + actual + ".", function() {
        return expected === actual;
      });
    },
    
    areClose: function(expected, actual, epsilon) {
      if (epsilon === undefined) {
        epsilon = 0.001;
      }
      runTestAndRecordResult("Expected " + expected + " (+/- " + epsilon + "), got " + actual + ".", function() {
        return Math.abs(expected - actual) <= epsilon;
      });
    }
  });
  
  var totalTests = successes + failures.length;
  Logger.log(successes + " of " + totalTests + " tests passed.\n" + failures.length + " failures.\n" + failures.join("\n"));
}
// Mastering the Module Pattern for ECMAScript 5 (see https://ultimatecourses.com/blog/mastering-the-module-pattern)
// Module for draft UI (only for manual test reason)
var UIdraft = (function () {

  var config = {
    FPS: 30,
  };

  var _fixVal = function(value, sign0, sign1) {
    if (value == null) {
      return "  ";
    } else if (value == 0) {
      return sign0;
    } else {
      return sign1;
    }
  };

  var _currentFieldMessage  = function(f0, f1, f2, f3, f4, f5, f6, f7, f8, s0, s1) {
    var message = "";
    message += _fixVal(f0, s0, s1) + " | " + _fixVal(f1, s0, s1) + " | " + _fixVal(f2, s0, s1) + "\n";
    message += "---------\n";
    message += _fixVal(f3, s0, s1) + " | " + _fixVal(f4, s0, s1) + " | " + _fixVal(f5, s0, s1) + "\n";
    message += "---------\n";
    message += _fixVal(f6, s0, s1) + " | " + _fixVal(f7, s0, s1) + " | " + _fixVal(f8, s0, s1) + "\n";
    return message;
  };

  var setup = function() {
    // Nothing to setup in this UI version
  };

  var updateFrame = function(gameStatus, f0, f1, f2, f3, f4, f5, f6, f7, f8, s0, s1) {
    // Nothing to update in this UI version
  };

  var showStartQuestion = function(callbackAnswer) {
    if(callbackAnswer) {
      callbackAnswer(confirm('Would you like to play Tic Tac Toe?'))
    } else {
      throw Error('Function needs callback');
    }
  };

  var beginHumanTurn = function(callbackResult, f0, f1, f2, f3, f4, f5, f6, f7, f8, s0, s1) {
    if(callbackResult) {
      if (f0 == null || f1 == null || f2 == null ||
          f3 == null || f4 == null || f5 == null ||
          f6 == null || f7 == null || f8 == null) {
        var result = 0;
        do {
          var message = "Please choose empty place index for your sign [0-8] (your sign is \"" + s1 + "\")\n";
          message += _fixVal(f0, s0, s1) + " | " + _fixVal(f1, s0, s1) + " | " + _fixVal(f2, s0, s1) + "            0 | 1 | 2 " + "\n";
          message += "---------          ---------\n";
          message += _fixVal(f3, s0, s1) + " | " + _fixVal(f4, s0, s1) + " | " + _fixVal(f5, s0, s1) + "            3 | 4 | 5 " + "\n";
          message += "---------          ---------\n";
          message += _fixVal(f6, s0, s1) + " | " + _fixVal(f7, s0, s1) + " | " + _fixVal(f8, s0, s1) + "            6 | 7 | 8 " + "\n";
          result = parseInt(prompt(message, 0));
        } while (isNaN(result) || result < 0 || result > 8 || arguments[result + 1] != null);
        callbackResult(result);
      } else {
        throw Error('No empty places');
      }
    } else {
      throw Error('Function needs callback');
    }
  };

  var humanWin = function(callbackEnd, f0, f1, f2, f3, f4, f5, f6, f7, f8, s0, s1) {
    if(callbackEnd) {
      var message = "Human " + "(\"" + s1 + "\")" + " win\n" + _currentFieldMessage(f0, f1, f2, f3, f4, f5, f6, f7, f8, s0, s1);
      alert(message);
      callbackEnd();
    } else {
      throw Error('Function needs callback');
    }
  };

  var cpuWin = function(callbackEnd, f0, f1, f2, f3, f4, f5, f6, f7, f8, s0, s1) {
    if(callbackEnd) {
      var message = "CPU " + "(\"" + s0 + "\")" + " win\n" + _currentFieldMessage(f0, f1, f2, f3, f4, f5, f6, f7, f8, s0, s1);
      alert(message);
      callbackEnd();
    } else {
      throw Error('Function needs callback');
    }
  };

  var deadlock = function(callbackEnd, f0, f1, f2, f3, f4, f5, f6, f7, f8, s0, s1) {
    if(callbackEnd) {
      var message = "Deadlock\n" + _currentFieldMessage(f0, f1, f2, f3, f4, f5, f6, f7, f8, s0, s1);
      alert(message);
      callbackEnd();
    } else {
      throw Error('Function needs callback');
    }
  };

  var showWinLine= function(index1, index2, index3) {
    // Nothing to show in this UI version
  };

  var exit = function(exitUrl) {
    window.location.replace(exitUrl);
  };

  return {
    config: config,
    setup: setup,
    updateFrame: updateFrame,
    showStartQuestion: showStartQuestion,
    beginHumanTurn: beginHumanTurn,
    humanWin: humanWin,
    cpuWin: cpuWin,
    deadlock: deadlock,
    showWinLine: showWinLine,
    exit: exit,
  };

})();

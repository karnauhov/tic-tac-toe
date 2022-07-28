// Mastering the Module Pattern for ECMAScript 5 (see https://ultimatecourses.com/blog/mastering-the-module-pattern)
// Main module of business logic
var Game = (function () {

  // UI module
  var _ui = null;

  // Game state
  var _gs = {
    exitUrl: "https://play.works/",
    status: 0, //-1: EXIT, 0: NOT_STARTED, 1: WAIT, 2: SWITCH_TURN, 3: HUMAN_TURN, 4: CPU_TURN, 5: HUMAN_WIN, 6: CPU_WIN, 7: DEADLOCK
    whoseTurn: 0, //0: CPU, 1: Human
    cpuSign: "x",
    humanSign: "o",
    fld: [null, null, null, null, null, null, null, null, null], //Row1: 0, 1, 2; Row2: 3, 4, 5; Row3: 6, 7, 8;
  };

  var _generateRandomPositive = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var _getRandomEmptyFieldIndex = function() {
    var emptyIndexes = [];
    for (var i = 0; i < _gs.fld.length; i++) {
      if (_gs.fld[i] == null) {
        emptyIndexes.push(i);
      }
    }
    return emptyIndexes[_generateRandomPositive(1, emptyIndexes.length) - 1];
  };

  var _findDoubleValue = function(val, arrIndexes) {
    var arrValues = [];
    for (var j = 0; j < arrIndexes.length; j++) {
      arrValues.push(_gs.fld[arrIndexes[j]]);
    }
    var counter = 0;
    var emptyIndex = -1;
    for (var i = 0; i < arrValues.length; i++) {
      if (arrValues[i] == null) {
        emptyIndex = arrIndexes[i];
      } else if (arrValues[i] == val) {
        counter++;
      }
    }
    return counter >= 2 ? emptyIndex : -1;
  }

  var _findPossibleWinIndex = function(val) {
    var result = -1;
    var checkLinesArray = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (var i = 0; i < checkLinesArray.length; i++) {
      result = _findDoubleValue(val, checkLinesArray[i]);
      if (result != -1) {
        return result;
      }
    }
    return result;
  }

  var _calcCpuStep = function() {
    // Check own possible wins
    var ownResult = _findPossibleWinIndex(0);
    if (ownResult != -1) {
      return ownResult;
    }

    // Check human possible wins
    var humanResult = _findPossibleWinIndex(1);
    if (humanResult != -1) {
      return humanResult;
    }

    // Set random place
    return _getRandomEmptyFieldIndex();
  }

  var _setRandomTurn = function() {
    if (Math.random() < 0.5) {
      _gs.whoseTurn = 0;
      _gs.cpuSign = "x";
      _gs.humanSign = "o";
    } else {
      _gs.whoseTurn = 1;
      _gs.cpuSign = "o";
      _gs.humanSign = "x";
    }
  };

  var _updateGameStateMachine  = function() {
    switch (_gs.status) {
      case -1: // EXIT
        stop();
        _ui.exit(_gs.exitUrl);
        return;
      case 0: // NOT_STARTED
        _setRandomTurn();
        _gs.status = 1; // WAIT
        _ui.showStartQuestion(startAnswer);
        break;
      case 2: // SWITCH_TURN
        if (_gs.whoseTurn) {
          _gs.status = 3; // HUMAN_TURN
        } else {
          _gs.status = 4; // CPU_TURN
        }
        break;
      case 3: // HUMAN_TURN
        _gs.status = 1; // WAIT
        _ui.beginHumanTurn(humanAnswer, _gs.fld[0], _gs.fld[1], _gs.fld[2], _gs.fld[3], _gs.fld[4], _gs.fld[5], _gs.fld[6], _gs.fld[7], _gs.fld[8], _gs.cpuSign, _gs.humanSign);
        break;
      case 4: // CPU_TURN
        _gs.status = 1; // WAIT
        beginCpuTurn(cpuAnswer);
        break;
      case 5: // HUMAN_WIN
        _gs.status = 1; // WAIT
        _ui.humanWin(endGame, _gs.fld[0], _gs.fld[1], _gs.fld[2], _gs.fld[3], _gs.fld[4], _gs.fld[5], _gs.fld[6], _gs.fld[7], _gs.fld[8], _gs.cpuSign, _gs.humanSign);
        break;
      case 6: // CPU_WIN
        _gs.status = 1; // WAIT
        _ui.cpuWin(endGame, _gs.fld[0], _gs.fld[1], _gs.fld[2], _gs.fld[3], _gs.fld[4], _gs.fld[5], _gs.fld[6], _gs.fld[7], _gs.fld[8], _gs.cpuSign, _gs.humanSign);
        break;
      case 7: // DEADLOCK
        _gs.status = 1; // WAIT
        _ui.deadlock(endGame, _gs.fld[0], _gs.fld[1], _gs.fld[2], _gs.fld[3], _gs.fld[4], _gs.fld[5], _gs.fld[6], _gs.fld[7], _gs.fld[8], _gs.cpuSign, _gs.humanSign);
        break;
      default:
        break;
    }
  };

  var loop = function() {
    _updateGameStateMachine();
    _ui.updateFrame(_gs.status, _gs.fld[0], _gs.fld[1], _gs.fld[2], _gs.fld[3], _gs.fld[4], _gs.fld[5], _gs.fld[6], _gs.fld[7], _gs.fld[8], _gs.cpuSign, _gs.humanSign);
  };

  var start = function (ui) {
    if (!ui) {
      throw Error('Please pass UI module inside function start');
    }
    _ui = ui;
    intervalID = setInterval(loop, 1000 / _ui.config.FPS);
  };

  var startAnswer = function(isPlay) {
    if (isPlay) {
      _gs.status = 2; // SWITCH_TURN
    } else {
      _gs.status = -1; // EXIT
    }
  };

  var humanAnswer = function(index) {
    _gs.fld[index] = 1;
    checkEndGame();
  };

  var cpuAnswer = function(index) {
    _gs.fld[index] = 0;
    checkEndGame();
  };

  var beginCpuTurn = function(callbackResult) {
    if(callbackResult) {
      var resultIndex = _calcCpuStep();
      setTimeout(callbackResult, 300, resultIndex);
    } else {
      throw Error('Function needs callback');
    }
  };

  var checkEndGame = function() {
    var result = checkField();
    if (result == 0) {
      _gs.status = 6; // CPU_WIN
    } else if (result == 1) {
      _gs.status = 5; // HUMAN_WIN
    } else if (result == -1) {
      _gs.status = 7; //DEADLOCK
    } else { // TURN NEXT
      _gs.whoseTurn = _gs.whoseTurn ? 0 : 1;
      _gs.status = 2; // SWITCH_TURN
    }
  };

  var checkField = function() { // Return null for continue, -1 for deadlock; 0 for cpu win, 1 for human win
    // Check winner
    for(var win = 0; win <= 1; win++) {
      if ((_gs.fld[0] == win && _gs.fld[1] == win && _gs.fld[2] == win) ||      //row 1
          (_gs.fld[3] == win && _gs.fld[4] == win && _gs.fld[5] == win) ||      //row 2
          (_gs.fld[6] == win && _gs.fld[7] == win && _gs.fld[8] == win) ||      //row 3
          (_gs.fld[0] == win && _gs.fld[3] == win && _gs.fld[6] == win) ||      //column 1
          (_gs.fld[1] == win && _gs.fld[4] == win && _gs.fld[7] == win) ||      //column 2
          (_gs.fld[2] == win && _gs.fld[5] == win && _gs.fld[8] == win) ||      //column 3
          (_gs.fld[0] == win && _gs.fld[4] == win && _gs.fld[8] == win) ||      //diag 1
          (_gs.fld[2] == win && _gs.fld[4] == win && _gs.fld[6] == win)         //diag 2
      ){
        return win;
      }
    }

    // Check deadlock
    for (var i = 0; i < _gs.fld.length; i++) {
      if (_gs.fld[i] == null) {
        return null;
      }
    }
    return -1;
  };

  var endGame = function() {
    for (var i = 0; i < _gs.fld.length; i++) {
      _gs.fld[i] = null;
    }
    // Restart
    _gs.status = 0; // NOT_STARTED
  };

  var stop = function () {
    clearInterval(intervalID);
  };

  return {
    start: start,
    stop: stop,
  };

})();

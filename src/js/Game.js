// Mastering the Module Pattern for ECMAScript 5 (see https://ultimatecourses.com/blog/mastering-the-module-pattern)
// Main module of business logic
var Game = (function () {

  var _ui = null;
  var _gameState = {
    exitUrl: "https://play.works/",
    status: 0, //-1: EXIT, 0: NOT_STARTED, 1: WAIT, 2: SWITCH_TURN, 3: HUMAN_TURN, 4: CPU_TURN, 5: HUMAN_WIN, 6: CPU_WIN, 7: DEADLOCK
    whoseTurn: 0, //0: CPU, 1: Human
    cpuSign: "X",
    humanSign: "O",
    field: [null, null, null, null, null, null, null, null, null], //Row1: 0, 1, 2; Row2: 3, 4, 5; Row3: 6, 7, 8;
  };

  var _setRandomTurn = function() {
    if (Math.random() < 0.5) {
      _gameState.whoseTurn = 0;
      _gameState.cpuSign = "X";
      _gameState.humanSign = "O";
    } else {
      _gameState.whoseTurn = 1;
      _gameState.cpuSign = "O";
      _gameState.humanSign = "X";
    }
  };

  var _updateGameStateMachine  = function() {
    switch (_gameState.status) {
      case -1: // EXIT
        stop();
        _ui.exit(_gameState.exitUrl);
        return;
      case 0: // NOT_STARTED
        _setRandomTurn();
        _gameState.status = 1; // WAIT
        _ui.showStartQuestion(startAnswer);
        break;
      case 2: // SWITCH_TURN
        if (_gameState.whoseTurn) {
          _gameState.status = 3; // HUMAN_TURN
        } else {
          _gameState.status = 4; // CPU_TURN
        }
        break;
      case 3: // HUMAN_TURN
        _gameState.status = 1; // WAIT
        _ui.beginHumanTurn(humanAnswer);
        break;
      case 4: // CPU_TURN
        _gameState.status = 1; // WAIT
        beginCpuTurn(cpuAnswer);
        break;
      case 5: // HUMAN_WIN
        _gameState.status = 1; // WAIT
        _ui.humanWin(endGame);
        break;
      case 6: // CPU_WIN
        _gameState.status = 1; // WAIT
        _ui.cpuWin(endGame);
        break;
      case 7: // DEADLOCK
        _gameState.status = 1; // WAIT
        _ui.deadlock(endGame);
        break;
      default:
        break;
    }
  };

  var loop = function() {
    _updateGameStateMachine();
    _ui.updateFrame(_gameState.status);
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
      _gameState.status = 2; // SWITCH_TURN
    } else {
      _gameState.status = -1; // EXIT
    }
  };

  var humanAnswer = function(index) {
    _gameState.field[index] = 1
    checkEndGame();
  };

  var cpuAnswer = function(index) {
    _gameState.field[index] = 0
    checkEndGame();
  };

  var beginCpuTurn = function(callbackResult) {
    if(callbackResult) {
      // TODO CPU turn
      console.log("TODO: CPU turn");
      setTimeout(callbackResult, 1000, 7); // 7 for test example
    }
  };

  var checkEndGame = function() {
    var result = checkField()
    if (result == 0) {
      _gameState.status = 6; // CPU_WIN
    } else if (result == 1) {
      _gameState.status = 5; // HUMAN_WIN
    } else if (result == -1) {
      _gameState.status = 7; //DEADLOCK
    } else { // TURN NEXT
      _gameState.whoseTurn = _gameState.whoseTurn ? 0 : 1;
      _gameState.status = 2; // SWITCH_TURN
    }
  };

  var checkField = function() { // Return null for continue, -1 for deadlock; 0 for human win, 1 for cpu win
    // TODO check field
    return null
  };

  var endGame = function() {
    for (var i = 0; i < _gameState.field.length; i++) {
      _gameState.field[i] = null;
    }
    // Restart
    _gameState.status = 0; // NOT_STARTED
  };

  var stop = function () {
    clearInterval(intervalID);
  };

  return {
    start: start,
    stop: stop,
  };

})();

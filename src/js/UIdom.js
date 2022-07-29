// Mastering the Module Pattern for ECMAScript 5 (see https://ultimatecourses.com/blog/mastering-the-module-pattern)
// Module for dom UI (UI based on DOM model, without any graphics)
var UIdom = (function () {

  var config = {
    FPS: 30,
    xChar: "&#x2573;",
    oChar: "&#9711;",
  };
  var _LEFT = [0, 0, 1, 3, 3, 4, 6, 6, 7];
  var _RIGHT = [1, 2, 2, 4, 5, 5, 7, 8, 8];
  var _UP = [0, 1, 2, 0, 1, 2, 3, 4, 5];
  var _DOWN = [3, 4, 5, 6, 7, 8, 6, 7, 8];
  var _selectedCell = 4;
  var _cells = [];
  var _symbols = [];
  var _fld = [null, null, null, null, null, null, null, null, null];
  var _prevFld = [null, null, null, null, null, null, null, null, null];
  var _curTurnFld = [null, null, null, null, null, null, null, null, null];
  var _flashingIntervalID = null;
  var _isHumanTurn = false;
  var _humanAnswer = null;
  var _isStartAnswer = false;
  var _startAnswer = null;
  var _isExitAnswer = false;
  var _exitCallback = null;

  var _listenKeys = function (state) {
    if (state) {
      document.addEventListener('keydown', _keyPush);
    } else {
      document.removeEventListener('keydown', _keyPush);
    }
  };

  var _keyPush = function (evt) {
    if (_isStartAnswer) {
      _startHandler(evt);
    } else if (_isExitAnswer) {
      _exitHandler(evt);
    } else if (_isHumanTurn) {
      _stepHandler(evt);
    }
  };

  var _stepHandler = function(evt) {
    var _prevSelected = _selectedCell;
    switch(evt.keyCode) {
      case 37: // Left
        _selectedCell = _LEFT[_selectedCell];
        if (_selectedCell != _prevSelected) {
          _unselectCell(_prevSelected);
        }
        evt.preventDefault();
        break;
      case 38: // Up
        _selectedCell = _UP[_selectedCell];
        if (_selectedCell != _prevSelected) {
          _unselectCell(_prevSelected);
        }
        evt.preventDefault();
        break;
      case 39: // Right
        _selectedCell = _RIGHT[_selectedCell];
        if (_selectedCell != _prevSelected) {
          _unselectCell(_prevSelected);
        }
        evt.preventDefault();
        break;
      case 40: // Down
        _selectedCell = _DOWN[_selectedCell];
        if (_selectedCell != _prevSelected) {
          _unselectCell(_prevSelected);
        }
        evt.preventDefault();
        break;
      case 13: // Enter
        if (_curTurnFld[_selectedCell] == null && _humanAnswer != null) {
          _isHumanTurn = false;
          _unselectAllCells();
          _humanAnswer(_prevSelected);
        }
        evt.preventDefault();
        break;
      case 27: // Esc
        _isExitAnswer = true;
        _showDialog("modalExit", true);
        evt.preventDefault();
        break;
    }
  };

  var _startHandler = function(evt) {
    switch(evt.keyCode) {
      case 13: // Enter
        _isStartAnswer = false;
        _hideAllModalWindows();
        if (_startAnswer) {
          _startAnswer(true);
        }
        evt.preventDefault();
        break;
      case 27: // Esc
        _isStartAnswer = false;
        _hideAllModalWindows();
        if (_startAnswer) {
          _startAnswer(null);
        }
        evt.preventDefault();
        break;
    }
  };

  var _exitHandler = function(evt) {
    switch(evt.keyCode) {
      case 13: // Enter
        _isExitAnswer = false;
        _hideAllModalWindows();
        if (_exitCallback) {
          _exitCallback();
        }
        evt.preventDefault();
        break;
      case 27: // Esc
        _isExitAnswer = false;
        _hideAllModalWindows();
        evt.preventDefault();
        break;
    }
  };

  var _showDialog = function(id, isFade) {
    if (isFade) {
      document.querySelector(".modal-fader").className += " active";
    }
    document.querySelector("#" + id).className += " active";
  };

  var _hideAllModalWindows = function() {
    var modalFader = document.querySelector(".modal-fader");
    var modalWindows = document.querySelectorAll(".modal-window");
    
    if(modalFader.className.indexOf("active") !== -1) {
        modalFader.className = modalFader.className.replace("active", "");
    }
    
    modalWindows.forEach(function (modalWindow) {
        if(modalWindow.className.indexOf("active") !== -1) {
            modalWindow.className = modalWindow.className.replace("active", "");
        }
    });
  };

  var _fixVal = function(value, sign0, sign1) {
    if (value == null) {
      return "";
    } else if (value == 0) {
      return config[sign0 + "Char"];
    } else {
      return config[sign1 + "Char"];
    }
  };

  var _flashing = function() {
    if (_selectedCell != -1) {
      if (_cells[_selectedCell].style.backgroundColor == "") {
        _cells[_selectedCell].style.backgroundColor = "gold";
      } else {
        _cells[_selectedCell].style.backgroundColor = "";
      }
    }
  };

  var _unselectCell = function(index) {
    _cells[index].style.backgroundColor = "";
  };

  var _unselectAllCells = function() {
    clearInterval(_flashingIntervalID);
    _selectedCell = -1;
    for (var i = 0; i < _cells.length; i++) {
        _cells[i].style.backgroundColor = "";
    }
  };



  var setup = function(exitCallback) {
    _exitCallback = exitCallback;
    _listenKeys(true);
    for(var i = 0; i < 9; i++) {
      _cells.push(document.getElementById("cell" + i));
      _symbols.push(document.getElementById("symbol" + i));
    }
  };

  var updateFrame = function(gameStatus, f0, f1, f2, f3, f4, f5, f6, f7, f8, s0, s1) {
    _fld = [f0, f1, f2, f3, f4, f5, f6, f7, f8];
    for (var i = 0; i < _fld.length; i++) {
      if (_prevFld[i] != _fld[i]) {
        _symbols[i].innerHTML = _fixVal(_fld[i], s0, s1);
      }
    }
    _prevFld = _fld;
  };

  var showStartQuestion = function(callbackAnswer) {
    _unselectAllCells();
    if(callbackAnswer) {
      _startAnswer = callbackAnswer;
      _isStartAnswer = true;
      _showDialog("modalStart", true);
    } else {
      throw Error('Function needs callback');
    }
  };

  var beginHumanTurn = function(callbackResult, f0, f1, f2, f3, f4, f5, f6, f7, f8, s0, s1) {
    if(callbackResult) {
      if (f0 == null || f1 == null || f2 == null ||
          f3 == null || f4 == null || f5 == null ||
          f6 == null || f7 == null || f8 == null) {
        _curTurnFld = [f0, f1, f2, f3, f4, f5, f6, f7, f8];
        _humanAnswer = callbackResult;
        _unselectAllCells();
        _selectedCell = 4
        _isHumanTurn = true;
        _flashingIntervalID = setInterval(_flashing, 400);
      } else {
        throw Error('No empty places');
      }
    } else {
      throw Error('Function needs callback');
    }
  };

  var humanWin = function(callbackEnd, f0, f1, f2, f3, f4, f5, f6, f7, f8, s0, s1) {
    if(callbackEnd) {
      var message = "You win";
      document.querySelector("#endMessage").innerHTML = message;
      _showDialog("modalEnd", false);
      setTimeout(_hideAllModalWindows, 2000);
      setTimeout(callbackEnd, 2100);
    } else {
      throw Error('Function needs callback');
    }
  };

  var cpuWin = function(callbackEnd, f0, f1, f2, f3, f4, f5, f6, f7, f8, s0, s1) {
    if(callbackEnd) {
      var message = "You lose";
      document.querySelector("#endMessage").innerHTML = message;
      _showDialog("modalEnd", false);
      setTimeout(_hideAllModalWindows, 2000);
      setTimeout(callbackEnd, 2100);
    } else {
      throw Error('Function needs callback');
    }
  };

  var deadlock = function(callbackEnd, f0, f1, f2, f3, f4, f5, f6, f7, f8, s0, s1) {
    if(callbackEnd) {
      var message = "Deadlock, try again";
      document.querySelector("#endMessage").innerHTML = message;
      _showDialog("modalEnd", false);
      setTimeout(_hideAllModalWindows, 2000);
      setTimeout(callbackEnd, 2100);
    } else {
      throw Error('Function needs callback');
    }
  };

  var showWinLine= function(index1, index2, index3) {
    _cells[index1].style.backgroundColor = "red";
    _cells[index2].style.backgroundColor = "red";
    _cells[index3].style.backgroundColor = "red";
  };

  var exit = function(exitUrl) {
    _listenKeys(false);
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

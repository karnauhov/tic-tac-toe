// Mastering the Module Pattern for ECMAScript 5 (see https://ultimatecourses.com/blog/mastering-the-module-pattern)
// Module for draft UI (only for manual test reason)
var UIdraft = (function () {

  var config = {
    FPS: 30,
  };

  var updateFrame = function(gameStatus) {
    // TODO update field
    //console.log(gameStatus);
  };

  var showStartQuestion = function(callbackAnswer) {
    if(callbackAnswer) {
      callbackAnswer(confirm('Would you like to play Tic Tac Toe?'))
    } else {
      throw Error('Function needs callback');
    }
  };

  var beginHumanTurn = function(callbackResult) {
    if(callbackResult) {
      // TODO human turn
      console.log("TODO: Human turn");
      setTimeout(callbackResult, 3000, 5); // 5 for test example
    } else {
      throw Error('Function needs callback');
    }
  };

  var humanWin = function(callbackEnd) {
    if(callbackEnd) {
      // TODO human win
      console.log("TODO: Human win");
      setTimeout(callbackEnd, 3000);
    } else {
      throw Error('Function needs callback');
    }
  };

  var cpuWin = function(callbackEnd) {
    if(callbackEnd) {
      // TODO CPU win
      console.log("TODO: CPU win");
      setTimeout(callbackEnd, 3000);
    } else {
      throw Error('Function needs callback');
    }
  };

  var deadlock = function(callbackEnd) {
    if(callbackEnd) {
      // TODO Deadlock
      console.log("TODO: Deadlock");
      setTimeout(callbackEnd, 3000);
    } else {
      throw Error('Function needs callback');
    }
  };

  var exit = function(exitUrl) {
    window.location.replace(exitUrl);
  };

  return {
    config: config,
    updateFrame: updateFrame,
    showStartQuestion: showStartQuestion,
    beginHumanTurn: beginHumanTurn,
    humanWin: humanWin,
    cpuWin: cpuWin,
    deadlock: deadlock,
    exit: exit,
  };

})();

var Module = (function () {

  var _privateMethod = function () {
    // private stuff
    alert('bla-bla-bla')
  };

  var publicMethod = function () {
    _privateMethod();
  };

  return {
    publicMethod: publicMethod
  };

})();

Module.publicMethod();
//console.log(Module.publicMethod);

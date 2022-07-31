// Mastering the Module Pattern for ECMAScript 5 (see https://ultimatecourses.com/blog/mastering-the-module-pattern)
// Module for embed ads
var Ads = (function () {

  var config = {
    url: "https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=",
  };
  var _videoElement = null;
  var _adContainer = null;
  var _adDisplayContainer = null;
  var _adsLoader = null;
  var _adsManager = null;
  var _continueCallback = null;
  var _setupDone = false;
  var _requestDone = false;
  var _responseError = false;
  var _adsLoaded = false;

  var _onAdsManagerLoaded = function(adsManagerLoadedEvent) {
    _adsManager = adsManagerLoadedEvent.getAdsManager(_videoElement);
    _adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, _onAdError);
    _adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, _onAdsCompleted.bind(this, true));
    _adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, _onAdsCompleted.bind(this, true));
  };
  
  var _onAdError = function(adErrorEvent) {
    _responseError = true;
    _adsLoaded = false;
    console.error("Ads response error", adErrorEvent.getError());
    if(_adsManager) {
      _adsManager.destroy();
    }
  }

  var _onAdsCompleted = function(startCalback) {
    _adsLoaded = false;
    _adContainer.style.visibility = "hidden";
    _videoElement.style.visibility = "hidden";
    if (_continueCallback && startCalback) {
      _continueCallback();
    }
  }

  var setup = function() {
    _setupDone = false;
    try {
      _videoElement = document.getElementById("video-element");
      _adContainer = document.getElementById("ad-container");
      _adDisplayContainer = new google.ima.AdDisplayContainer(_adContainer, _videoElement);
      _adsLoader = new google.ima.AdsLoader(_adDisplayContainer);
      _adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, _onAdsManagerLoaded, false);
      _adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, _onAdError, false);
      _setupDone = true;
    } catch (adError) {
      console.error("Ads setup error", adError);
    }
  };

  var requestAds = function() {
    if (!_setupDone) {
      return;
    }
    _requestDone = false;
    try {
      _responseError = false;
      var adsRequest = new google.ima.AdsRequest();
      adsRequest.adTagUrl = config.url;
      adsRequest.linearAdSlotWidth = _videoElement.clientWidth;
      adsRequest.linearAdSlotHeight = _videoElement.clientHeight;
      adsRequest.nonLinearAdSlotWidth = _videoElement.clientWidth;
      adsRequest.nonLinearAdSlotHeight = _videoElement.clientHeight / 3;
      _adsLoader.contentComplete();
      _adsLoader.requestAds(adsRequest);
      _requestDone = true;
    } catch (adError) {
      console.error("Ads request error", adError);
    }
  };

  var startAds = function(callbackContinue) {
    if (callbackContinue) {
      _continueCallback = callbackContinue;
    } else {
      throw Error('Function needs callback');
    }

    if(_adsLoaded || !_setupDone || !_requestDone || _responseError) {
      _continueCallback(true);
      return;
    }

    _adsLoaded = true;
    try {
      _adContainer.style.visibility = "visible";
      _videoElement.style.visibility = "visible";
      _videoElement.load();
      _adDisplayContainer.initialize();
      _adsManager.init(_videoElement.clientWidth, _videoElement.clientHeight, google.ima.ViewMode.NORMAL);
      _adsManager.start();
    } catch (adError) {
      console.error("AdsManager could not be started");
      _onAdsCompleted(true);
    }
  };

  return {
    config: config,
    setup: setup,
    requestAds: requestAds,
    startAds: startAds,
  };
})();

// Change to fit App & Account
var adCode = 'ca-app-pub-123456789012/123421';

/**
 * AdMob plugin
 */
var admob = {
  initialized: false,
  adshown: false,

  //initialize the goodies
  initAd: function() {
    if ( window.plugins && window.plugins.AdMob ) {
      var ad_units = {
        ios: { banner: adCode, interstitial: adCode },
        android: { banner: adCode, interstitial: adCode }
      };

      var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;

      window.plugins.AdMob.setOptions( {
        publisherId: admobid.banner,
        interstitialAdId: admobid.interstitial,
        adSize: window.plugins.AdMob.AD_SIZE.SMART_BANNER,	//use SMART_BANNER, BANNER, LARGE_BANNER, IAB_MRECT, IAB_BANNER, IAB_LEADERBOARD
        bannerAtTop: false, // set to true, to put banner at top
        overlap: true, // banner will overlap webview
        offsetTopBar: false, // set to true to avoid ios7 status bar overlap
        isTesting: false, // receiving test ad
        autoShow: false // auto show interstitial ad when loaded
      });

      admob.registerAdEvents();

      window.plugins.AdMob.createInterstitialView();	//get the interstitials ready to be shown
      window.plugins.AdMob.requestInterstitialAd();

    } else {
        //alert( 'admob plugin not ready' );
    }

    admob.initialized = true;
  },

  //functions to allow you to know when ads are shown, etc.
  registerAdEvents: function() {
    document.addEventListener('onReceiveAd', function(){ console.log('onReceiveAd'); });
    document.addEventListener('onFailedToReceiveAd', function(data){ console.log('onFailedToReceiveAd'); admob.adshown = false; });
    document.addEventListener('onPresentAd', function(){ console.log('onPresentAd'); admob.adshown = false; });
    document.addEventListener('onDismissAd', function(){ console.log('onDismissAd'); admob.adshown = false; });
    document.addEventListener('onLeaveToAd', function(){ console.log('onLeaveToAd'); admob.adshown = false; });
    document.addEventListener('onReceiveInterstitialAd', function(){ console.log('onReceiveInterstitialAd'); });
    document.addEventListener('onPresentInterstitialAd', function(){ console.log('onPresentInterstitialAd'); });
    document.addEventListener('onDismissInterstitialAd', function(){
    	window.plugins.AdMob.createInterstitialView();			//REMOVE THESE 2 LINES IF USING AUTOSHOW
      window.plugins.AdMob.requestInterstitialAd();			//get the next one ready only after the current one is closed
    });
  },

  //display the banner
  showADBanner: function() {
    if( !admob.initialized ) {
      admob.initAd();
    }

    if( admob.adshown ) { return; }

    admob.adshown = true;
    window.plugins.AdMob.createBannerView();
  },

  // display the interstitial
  showADInterstitial: function() {
    // get the interstitials ready to be shown and show when it's loaded.
    window.plugins.AdMob.createInterstitialView();
    window.plugins.AdMob.requestInterstitialAd();
  },

  hideADBanner: function() {
    if( !admob.adshown ) return;

    admob.adshown = false;
    window.plugins.AdMob.destroyBannerView();
  }
};

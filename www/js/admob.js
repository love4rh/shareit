var adInitialized = false;
var adShown = false;

//initialize the goodies
function initAd(){
  if ( window.plugins && window.plugins.AdMob ) {
    var ad_units = {
      ios : {
          banner: 'ca-app-pub-9642508933294633/7058764503',		//PUT ADMOB ADCODE HERE
          interstitial: 'ca-app-pub-9642508933294633/7058764503'	//PUT ADMOB ADCODE HERE
      },
      android : {
          banner: 'ca-app-pub-9642508933294633/7058764503',		//PUT ADMOB ADCODE HERE
          interstitial: 'ca-app-pub-9642508933294633/7058764503'	//PUT ADMOB ADCODE HERE
      }
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

    registerAdEvents();
    window.plugins.AdMob.createInterstitialView();	//get the interstitials ready to be shown
    window.plugins.AdMob.requestInterstitialAd();

  } else {
      //alert( 'admob plugin not ready' );
  }

  adInitialized = true;
}

//functions to allow you to know when ads are shown, etc.
function registerAdEvents() {
  document.addEventListener('onReceiveAd', function(){ console.log('onReceiveAd'); });
  document.addEventListener('onFailedToReceiveAd', function(data){ console.log('onFailedToReceiveAd'); adShown = false; });
  document.addEventListener('onPresentAd', function(){ console.log('onPresentAd'); adShown = false; });
  document.addEventListener('onDismissAd', function(){ console.log('onDismissAd'); adShown = false; });
  document.addEventListener('onLeaveToAd', function(){ console.log('onLeaveToAd'); adShown = false; });
  document.addEventListener('onReceiveInterstitialAd', function(){ console.log('onReceiveInterstitialAd'); });
  document.addEventListener('onPresentInterstitialAd', function(){ console.log('onPresentInterstitialAd'); });
  document.addEventListener('onDismissInterstitialAd', function(){
  	window.plugins.AdMob.createInterstitialView();			//REMOVE THESE 2 LINES IF USING AUTOSHOW
    window.plugins.AdMob.requestInterstitialAd();			//get the next one ready only after the current one is closed
  });
}

//display the banner
function showADBanner() {
  if( !adInitialized ) {
    initAd();
  }

  if( adShown ) { return; }

  adShown = true;
  window.plugins.AdMob.createBannerView();
}
//display the interstitial
function showADInterstitial() {
    window.plugins.AdMob.createInterstitialView();	//get the interstitials ready to be shown and show when it's loaded.
    window.plugins.AdMob.requestInterstitialAd();
}

function hideADBanner() {
  if( !adShown ) return;

  adShown = false;
  window.plugins.AdMob.destroyBannerView();
}

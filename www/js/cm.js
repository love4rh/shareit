const cUnit = 'px';
const footerHeight = 48;
const headerHeight = 46;
var hmUrl = 'wss://www.tool4.us:9697/hermes';

const remainLimit = 300;  // 5min

var runningOnBrowser = true;


function isValid(obj) {
  return obj != undefined && obj != null;
}

function isValid2(val) {
  return val != '' && isValid(val);
}

function place(obj, l, t, w, h) {
  if( obj == undefined ) { return; }

  var rect = {};

  if( isValid(l) ) rect.left = l + cUnit;
  if( isValid(t) ) rect.top = t + cUnit;
  if( isValid(w) ) rect.width = w + cUnit;
  if( isValid(h) ) rect.height = h + cUnit;

  obj.css(rect);
}

function convertTagToNormal(html) {
  return $('<p/>').text(html).text();
}

function isRunningOnBrowser() {
  return runningOnBrowser;
}

function showToast(msg) {
  if( isRunningOnBrowser() ) {
    // Get the snackbar DIV
    var sbar = $('#snackbar');
    sbar.html( convertTagToNormal(msg) );
    sbar.addClass('show');

    setTimeout(function(){ sbar.removeClass('show'); }, 2500);
  } else {
    // window.plugins.toast.showShortBottom(message);
    window.plugins.toast.showWithOptions({
      message: msg,
      duration: "3000",
      position: "bottom",
      addPixelsY: -140,
      styling: {
        opacity: 0.9, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
        backgroundColor: '#009688', // make sure you use #RRGGBB. Default #333333
        textColor: '#FFFFFF', // Ditto. Default #FFFFFF
        cornerRadius: 100, // minimum is 0 (square). iOS default 20, Android default 100
        horizontalPadding: 50, // iOS default 16, Android default 50
        verticalPadding: 30, // iOS default 12, Android default 30
        textSize: 15 // Default is approx. 13.
      }
    });
  }
}

var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

function isValidUrl(str) {
  return urlPattern.test(str);
}

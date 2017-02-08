

var sendMgr = {
  board: undefined,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'sendMgr'; },

  getHeaderInfo: function() {
    return {'title':R.text('sendPage'), 'mainButton':'back'};
  },

  onActivated: function(prevMgr, options) {
    var hs = '';
    var textSent = '';

    if( options && options['text'] ) { textSent = options['text']; }

    console.log(options);

    hs += '<div class="w3-container w3-large">'
      + '<div class="x-theme-d1 x-tab-title x-tab-grad">' + R.text('sentData') + '</div>'
      + '<div class="w3-container w3-center x-theme-panel x-panel" style="width:100%;">'
      + '<textarea id="dataSent" class="w3-input x-theme-textpanel" style="width:100%;" rows="3" val=""></textarea>'
      + '<div class="w3-left" style="margin-top: 10px;">'
      + '<input class="w3-radio" type="radio" name="dataType" value="normal" checked>'
      + '<label class="w3-validate"> ' + R.text('typeNormal') + '</label><span>&nbsp;&nbsp;</span>'
      + '<input class="w3-radio" type="radio" name="dataType" value="url">'
      + '<label class="w3-validate"> ' + R.text('typeUrl') + '</label>'
      + '</div>'
      + '</div></div>'
      + '<div class="w3-container w3-large">'
      + '<div class="x-theme-d1 x-tab-title x-tab-grad">' + R.text('remoteID') + '</div>'
      + '<div class="w3-container w3-center x-theme-panel x-panel" style="width:100%;">'
      + '<input id="authCode" type="number" class="w3-input x-theme-textpanel" style="width:100%;" placeholder="' + R.text('enterCode') + '">'
      + '<button class="w3-btn w3-large" style="margin: 16px 5px 0 5px;" onclick="sendMgr.sendData();">' + R.text('actionSend') + '</button>'
      ;

    /*
    if( !isRunningOnBrowser() ) {
      hs += '<button class="w3-btn" style="margin: 16px 5px 0 5px;" onclick="sendMgr.scanCode();">' + R.text('actionScan') + '</button>';
    } // */
    hs += '</div></div>';

    this.board.html(hs);
    this.board.find('#dataSent').off('change').on('change', this.onDataChanged);

    if( isValid2(textSent) ) {
      console.log('set: ' + textSent);
      this.board.find('#dataSent').val(textSent);
    }
  },

  onDeactivated: function(activePage) {
    //
  },

  onDataChanged: function(event) {
    var textData = $('#dataSent').val();
    if( !isValid2(textData) ) { return; }

    sendMgr.board.find(':radio[name="dataType"]').removeAttr('checked');

    if( isValidUrl(textData) ) {
      sendMgr.board.find(':radio[value="url"]').attr('checked', true);
    } else {
      sendMgr.board.find(':radio[value="normal"]').attr('checked', true);
    }
  },

  sendData: function() {
    var textData = $('#dataSent').val();
    var authCode = $('#authCode').val();

    if( !isValid2(textData) ) {
      showToast( R.text('missData') );
      return;
    }

    if( !isValid2(authCode) ) {
      showToast( R.text('missAuth') );
      return;
    }

    var dataType = sendMgr.board.find(':radio[name="dataType"]:checked').val();
    var sentObj = { 'dataType':dataType, 'text':textData };

    Hermes.sendToRemote(hmUrl, authCode, JSON.stringify(sentObj),
      // success data
      function() {
        showToast(R.text('sendSuccess'));
      },
      // error occurred
      function(error) {
        if( error == '9' ) {
          showToast(R.text('invalidAuthCode'));
        } else {
          showToast(R.text('sendError'));
        }
      }
    );
  }

  /*
  scanCode: function() {
    var textData = $('#dataSent').val();

    if( !isValid2(textData) ) {
      showToast( R.text('missData2') );
      return;
    }

    cordova.plugins.barcodeScanner.scan(
      // success callback
      function(result) {
        console.log( JSON.stringify(result) );

        var data = result;

        if( !isValid2(data['authCode']) ) {
          showToast(R.text('invalidQRCode'));
        } else {
          $('#authCode').val(data['authCode']);
          sendMgr.sendData();
        }
      },
      // error callback
      function(error) {
        console.log('error: ' + JSON.stringify(error) );
      }, {  // Scanning options
        preferFrontCamera : false, // iOS and Android
        showFlipCameraButton : true, // iOS and Android
        showTorchButton : true, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        prompt : 'Place a barcode inside the scan area', // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats : 'QR_CODE,PDF_417', // default: all but PDF_417 and RSS_EXPANDED
        // orientation : 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations : true // iOS
      });
  } // */
};

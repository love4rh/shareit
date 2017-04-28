var codeSize = 140;

var recvMgr = {
  board: undefined,
  countDown: 0,
  countdownTimer: undefined,

  initialize: function(board) {
    this.board = board;

    codeSize = isRunningOnBrowser() ? 180 : 140;
  },

  getPageID: function() { return 'recvMgr'; },

  getHeaderInfo: function() {
    return {'title':R.text('recvPage'), 'mainButton':'back'};
  },

  onActivated: function(prevMgr, options) {
    // TODO waiting
    if( isValid2(recvMgr.countdownTimer) ) {
      return;
    }

    var hs = '';

    hs += '<div class="w3-container w3-large">'
      + '<div class="x-title">' + R.text('remoteID') + '</div>'
      + '<hr style="margin: 5px 0 !important;" />'
      + '<div class="x-description">' + R.text('recvHelp') + '</div>'
      + '<div id="authcode" class="x-authcode x-text-red">00000</div>'
      + '<div id="idmsg" class="x-text-orange w3-center">' + R.text('remainTime') + '</div>'
      + '</div>';

    hs += '<div class="w3-container w3-large" style="margin-top: 24px;">'
      + '<div class="x-title">' + R.text('recvData') + '</div>'
      + '<hr style="margin: 5px 0 !important;" />'
      + '<textarea id="recvData" class="w3-input x-theme-textpanel" style="width:100%;" rows="3"></textarea>'
      + '<div class="w3-center">'
      + '<button class="w3-btn x-btn-copy" style="margin: 16px 5px 0 5px;">' + R.text('actionCopy') + '</button>'
      + '<button class="w3-btn x-btn-redirect" style="margin: 16px 5px 0 5px;">' + R.text('actionRedirect') + '</button>'
      + '</div>'
      + '</div>'
      ;

    this.board.html(hs);

    this.board.find('.x-btn-copy').off('click').on('click', this.copyToClipboard);
    this.board.find('.x-btn-redirect').off('click').on('click', this.redirectUrl);

    this.waitToReceive();
  },

  onDeactivated: function(activePage) {
    recvMgr.doneToWait();
  },

  doneToWait: function(msg) {
    Hermes.cleanUp();

    if( recvMgr.countdownTimer ) { clearInterval(recvMgr.countdownTimer); }
    recvMgr.countdownTimer = undefined;

    $('#authcode').html('-----');
    $('#idmsg').empty()
      .html(msg + ' <a href="#" class="x-text-green" onclick="recvMgr.waitToReceive()">' + R.text('retry') + '</a>');
  },

  makeRemainTime: function(t) {
    var r = '';
    var h = Math.floor(t / 3600);
    t -= h * 3600;
    var m = Math.floor(t / 60);
    var s = t % 60;

    if( h > 0 ) { r = h + R.text('hour')}
    if( m > 0 ) { r = m + R.text('min')}
    if( s > 0 ) { r += (m > 0 ? ' ' : '') + s + R.text('sec'); }

    return R.text('remainTime') + ': ' + r;
  },

  waitToReceive: function() {
    Hermes.beginToWait(hmUrl, remainLimit,
      // connection ok
      function(connectionID) {
        // data: remoteID, proxyServer
        $('#authcode').html(connectionID);
        $('#idmsg').text(recvMgr.makeRemainTime(remainLimit));

        recvMgr.countDown = remainLimit;
        recvMgr.countdownTimer = setInterval(function() {
          recvMgr.countDown -= 1;

          if( recvMgr.countDown <= 0 ) {
            recvMgr.doneToWait(R.text('timeExpired'));
            return;
          }

          $('#idmsg').text(recvMgr.makeRemainTime(recvMgr.countDown));
        }, 1000);
      },
      // received data
      function(data) {
        var nextAction = ''
        var reserve = '';
        var recvText = data;
        var outDiv = $('#recvData');

        try {
          var recvObj = JSON.parse(data);

          nextAction = recvObj['dataType'];
          recvText = decodeURI(recvObj['text']);
          reserve = recvObj['aa'];

          rsHistory.add(recvObj['text'], true);
        } catch(err) {
          console.log(err);
        }

        outDiv.val(recvText);

        if( nextAction == 'url' ) {
          showToast(R.text('redirect'));
          setTimeout(function() { location.href = recvText; }, 500);
        } else if( nextAction == 'urlpop' ) {
          showToast(R.text('redirect'));
          setTimeout(function() { window.open(recvText, 'sherit'); }, 500);
        }

        /*
        if( reserve == 'continue') {
          recvMgr.countDown = remainLimit;
        } else {
          recvMgr.doneToWait(R.text('workDone'));
        } // */
        recvMgr.countDown = 180; // reset waiting time to 3 min for another message
      },
      // error occurred
      function(error) {
        recvMgr.doneToWait(R.text('error'));
      }
    );
  },

  copyToClipboard: function(event) {
    var outDiv = $('#recvData');

    outDiv.select();

    try {
      if( document.execCommand('copy') ) {
        showToast(R.text('copyOk'));
      } else {
        showToast(R.text('copyError'));
      }
    } catch (err) {
      console.log(err);
      showToast(R.text('copyError'));
    }
  },

  redirectUrl: function(event) {
    var textUrl = $('#recvData').val();

    if( isValidUrl(textUrl) ) {
      showToast(R.text('redirect'));
      setTimeout(function() { location.href = textUrl; }, 500);
    } else {
      showToast(R.text('notUrl'));
    }
  }
};

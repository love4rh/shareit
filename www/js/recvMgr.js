var codeSize = 140;

var recvMgr = {
  board: undefined,
  countDown: 0,
  countdownTimer: undefined,

  initialize: function(board) {
    this.board = board;

    if( isRunningOnBrowser() ) {
      codeSize = 180;
    } else {
      codeSize = 140;
    }
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
      + '<div class="x-theme-d1 x-tab-title x-tab-grad">' + R.text('remoteID') + '</div>'
      + '<div class="w3-container w3-center x-theme-panel x-panel" style="width:100%;">'
      ;

    if( isRunningOnBrowser() ) {
      hs += '<div id="idcode" class="w3-border w3-white" style="height:' + (codeSize + 20) + 'px; width:' + (codeSize + 20) + 'px; padding:10px; margin:auto;"></div>'
        + '<div id="idtext" class="x-text-grey">&nbsp;</div>'
        ;
    } else {
      hs += '<div id="idtext" class="x-text-grey">&nbsp;</div>'
        ;
    }

    hs += '<div id="idmsg" class="x-text-orange">' + R.text('remainTime') + ':</div>'
      + '</div></div>'
      + '<div class="w3-container w3-large">'
      + '<div class="x-theme-d1 x-tab-title x-tab-grad">' + R.text('recvData') + '</div>'
      + '<div class="w3-container w3-center x-theme-panel x-panel" style="width:100%;">'
      + '<textarea id="recvData" class="w3-input x-theme-textpanel" style="width:100%;" rows="3" disabled></textarea>'
      + '<button class="w3-btn x-btn-copy" style="margin: 16px 5px 0 5px;">' + R.text('actionCopy') + '</button>'
      + '<button class="w3-btn x-btn-redirect" style="margin: 16px 5px 0 5px;">' + R.text('actionRedirect') + '</button>'
      + '</div></div>'
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

    $('#idmsg').empty().html(msg + '<br><a href="#" class="x-text-green" onclick="recvMgr.waitToReceive()">' + R.text('retry') + '</a>');

    if( isRunningOnBrowser() ) {
      $('#idcode').empty().qrcode({'width':codeSize, 'height':codeSize, 'text':'0000'});
    }

    $('#idtext').html('&nbsp;');
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
        if( isRunningOnBrowser() ) {
          $('#idcode').empty().qrcode({
            'width':codeSize, 'height':codeSize,
            'text':JSON.stringify({'version':'1', 'authCode':connectionID})
          });
        }
        $('#idtext').html(R.makeText('recvExplain', connectionID));
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
          recvText = recvObj['text'];
          reserve = recvObj['aa'];
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

        if( reserve == 'continue') {
          recvMgr.countDown = remainLimit;
        } else {
          recvMgr.doneToWait(R.text('workDone'));
        }
      },
      // error occurred
      function(error) {
        recvMgr.doneToWait(R.text('error'));
      }
    );
  },

  copyToClipboard: function(event) {
    var outDiv = $('#recvData');

    // 선택하려는 텍스트가 disabled라면 선택이 되지 않음
    outDiv.removeAttr('disabled');
    outDiv.select();

    try {
      if( document.execCommand('copy') ) {
        showToast(R.text('copyOk'));
      } else {
        showToast(R.text('copyError'));
      }
    } catch (err) {
      showToast(R.text('copyError'));
    }
    outDiv.attr('disabled', true);
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

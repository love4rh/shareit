

var pageMain = {
  board: undefined,
  displayed: false,
  fullMode: true, // no header mode

  initialize: function(board) {
    this.board = board;
    this.fullMode = !isRunningOnBrowser();
  },

  getPageID: function() { return 'pageMain'; },

  getHeaderInfo: function() {
    return { 'title':R.text('appTitle'), 'mainButton':'normal', 'fullMode': false,
      'headerHtml': '<img src="./img/logo.png" style="width:24px; height:24px;">' };
  },

  isMainContent: function() { return true; },

  onActivated: function(prevMgr, options) {
    var me = pageMain;

    if( me.displayed ) { return; }

    var hs, bs;

    bs = '<button class="w3-btn w3-teal w3-round-xlarge w3-large w3-padding-medium x-receive"><i class="fa fa-cloud-download"></i> ' + R.text('recvPage') + '</button>'
      + '<button class="w3-btn w3-khaki w3-round-xlarge w3-large w3-padding-medium x-send"><i class="fa fa-cloud-upload"></i> ' + R.text('sendPage') + '</button>'
      + '<button class="w3-btn w3-brown w3-round-xlarge w3-large w3-padding-medium x-history"><i class="fa fa-history"></i> ' + R.text('historyPage') + '</button>'
      ;

    if( me.fullMode ) {
      hs ='<div class="w3-container w3-center x-jumbotron">'
        + '<div class="w3-display-middle">'
        + '<img src="./img/head.png">'
        + '</div>'
        + '</div>'
        + '<div class="w3-container w3-center" style="margin-top: 16px;">' + bs + '</div>';
    } else {
      hs = '<div class="w3-container w3-center" style="margin-top: 24px;">' + bs + '</div>'
        + '<div class="w3-container w3-center" style="padding: 20px;">'
        + '<table>'
        + '<tr><td style="padding:5px;"><img class="x-expl-icon" src="./img/cellphone.png"></td>'
        + '<td style="padding:5px; text-align:left;">' + R.text('explPhone') + '</td></tr>'
        + '<tr><td style="padding:5px;"><img class="x-expl-icon" src="./img/pc.png"></td>'
        + '<td style="padding:5px; text-align:left;">' + R.text('explPC') + '</td></tr>'
        + '<tr><td style="padding:5px;"><img class="x-expl-icon" src="./img/tablet.png"></td>'
        + '<td style="padding:5px; text-align:left;">' + R.text('explTablet') + '</td></tr>'
        + '</table>'
        + '</div>';
    }

    me.board.html(hs);

    me.board.find('.x-receive').off('click').on('click', function(){ app.showPage(recvMgr) });
    me.board.find('.x-send').off('click').on('click', function(){ app.showPage(sendMgr) });
    me.board.find('.x-history').off('click').on('click', function(){ app.showPage(historyPage) });

    me.displayed = true;
  },

  adjustLayout: function(w, h) {
    place(pageMain.board.find('.x-jumbotron'), undefined, undefined, w, 200);
  },

  onDeactivated: function(activePage) {
    //
  }
};

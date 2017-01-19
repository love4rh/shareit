

var pageMain = {
  board: undefined,
  displayed: false,

  initialize: function(board) {
    this.board = board;
  },

  getPageID: function() { return 'pageMain'; },

  getHeaderInfo: function() {
    return {'title':R.text('appTitle'), 'mainButton':'normal'};
  },

  onActivated: function(prevMgr, options) {
    if( pageMain.displayed ) { return; }

    var hs = '<div style="height:220px;">Title Image here</div>'
      + '<div calss="w3-container w3-center">'
      + '<button class="w3-btn-block w3-teal w3-round-xlarge w3-large w3-padding-medium x-receive" style="width:90%"><i class="fa fa-cloud-download"></i> ' + R.text('recvPage') + '</button>'
      + '<button class="w3-btn-block w3-khaki w3-round-xlarge w3-large w3-padding-medium x-send" style="width:90%"><i class="fa fa-cloud-upload"></i> ' + R.text('sendPage') + '</button>'
      + '</div>'
    ;

    pageMain.board.html(hs);

    pageMain.board.find('.x-receive').off('click').on('click', function(){ app.showPage(recvMgr) });
    pageMain.board.find('.x-send').off('click').on('click', function(){ app.showPage(sendMgr) });

    pageMain.displayed = true;
  },

  onDeactivated: function(activePage) {
    //
  }
};

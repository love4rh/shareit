var historyLimit = 64;
var rsHistoryKey = 'texender';

// history of contents sent or received
var rsHistory = {
  history: { 'dataList':[], 'version':1 },

  initialize: function() {
    this.restore();
  },

  store: function() {
    localStorage.setItem(rsHistoryKey, JSON.stringify(this.history));
  },

  restore: function() {
    var data = localStorage.getItem(rsHistoryKey);

    if( isValid(data) ) {
      this.history = JSON.parse(data);
    }
  },

  add: function(text, received) {
    this.history.dataList.push({'data':text, 'got':received, 'tick':tickCount()});

    if( this.history.dataList.length > historyLimit ) {
      this.history.dataList.shift();
    }

    this.store();
  },

  size: function() {
    return this.history.dataList.length;
  },

  get: function(idx) {
    return this.history.dataList[idx];
  }
};


// History Page Class
var historyPage = {
  board: undefined,

  initialize: function(board) {
    rsHistory.initialize();
    this.board = board;
  },

  getPageID: function() { return 'historyPage'; },

  getHeaderInfo: function() {
    return {'title':R.text('historyPage'), 'mainButton':'back'};
  },

  onActivated: function(prevMgr, options) {
    var curTick = tickCount();
    var hs = '<table class="x-table">';

    for(var idx = rsHistory.size() - 1; idx >= 0; --idx) {
      // {'data':text, 'got':received, 'tick'}
      var obj = rsHistory.get(idx);

      hs += '<tr data-idx="' + idx + '">'
        + '<td class="x-history-dir w3-xlarge">'
        + (obj.got ? '<i class="x-text-blue fa fa-arrow-circle-o-right"></i>' : '<i class="x-text-red fa fa-arrow-circle-o-left"></i>')
        + '</td>'
        + '<td class="x-history-text x-text-yellow">'
        + '<div class="x-history-time">' + dateStrByTick(obj.tick) + '</div>'
        + '<div class="x-history-one-line">' + convertTagToNormal(decodeURI(obj.data)) + '</div>'
        + '</td>'
        + '<td class="x-history-dir w3-xlarge">' + '<i class="x-text-green fa fa-share-square-o"></i>' + '</td>'
        + '</tr>';
    }

    if( rsHistory.size() == 0 ) {
      hs += '<tr><td>' + R.text('noHistory') +  '</td></tr>'
    }
    hs += '</table>';
    this.board.html(hs);

    this.board.find('.x-table tr').off('click');
    if( rsHistory.size() > 0 ) {
      this.board.find('.x-table tr').on('click', this.onClick);
    }
  },

  adjustLayout: function(w, h) {
    place(this.board.find('.x-table'), undefined, undefined, w, undefined);
    place(this.board.find('.x-history-one-line'), undefined, undefined, w - 60 - 60 - 10, 20);
  },

  onDeactivated: function(activePage) {
    //
  },

  onClick: function(event) {
    var tr = $(event.currentTarget);
    var obj = rsHistory.get(tr.attr('data-idx'));

    app.showPage(sendMgr, {'text':decodeURI(obj.data), 'history':false});
  }
};

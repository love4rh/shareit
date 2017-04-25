var historyLimit = 64;
var rsHistoryKey = 'texender';

// history of contents sent or received
var rsHistory = {
  history: { dataList:[], version:1 },

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
    this.history.dataList.push({data:text, got:received, tick:tickCount()});

    if( this.history.dataList.length > historyLimit ) {
      this.history.dataList.shift();
    }
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

  isMainContent: function() { return true; },

  onActivated: function(prevMgr, options) {
    var hs = '<p>HISTORY LIST</p>'
      ;

    this.board.html(hs);

    app.adjustLayout();
  },

  adjustLayout: function(w, h) {
    //
  },

  onDeactivated: function(activePage) {
    //
  }
};

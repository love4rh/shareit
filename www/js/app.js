var app = {
  pages: {},
  appBoard: $('#appMain'),
  header: $('#appHeader'),
  pageBoard: $('#appBody'),
  mainMenuAsGoBack: false,
  currentPageMgr: undefined,
  pageViewStack: [],

  begin: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    document.addEventListener('pause', this.onPause, false);
    document.addEventListener('resume', this.onResume, false);
    document.addEventListener('backbutton', this.onBackKeyDown, false);
    document.addEventListener('menubutton', this.onMenuKeyDown, false);
  },

  onDeviceReady: function() {
    console.log('device is ready to use on ' + device.platform + '. language: ' + navigator.language);
    app.initialize();
  },

  initialize: function() {
    runningOnBrowser = !isValid(device) || device.platform == 'browser';

    $(window).off('resize').on('resize', function(){ app.adjustLayout(); });

    // set up Language Pack
    R.setLocale(navigator.language);

    app.header.find('li:nth-child(1)').off('click').on('click', app.clickMainMenu);
    app.header.find('li:nth-child(2)').html('<span>' + R.text('appTitle') + '<span>');

    // TODO when you need to add a new page, edit following codes.
    app.addPage(pageMain);
    app.addPage(recvMgr);
    app.addPage(sendMgr);

    app.showPage(pageMain);

    var curUrl = location.href;

    if( curUrl.indexOf('/receive') > 0 ) {
      app.showPage(recvMgr);
    } else if( curUrl.indexOf('/send') > 0 ) {
      app.showPage(sendMgr);
    }

    app.adjustLayout();
  },

  adjustLayout: function() {
    const appHeaderHeight = 50;

    var w = $(window).width();
    var h = $(window).height();

    // TODO iOS: consider status bar height. adjust header top padding, header height.

    place(app.appBoard, undefined, undefined, w, h);
    place(app.header, undefined, undefined, w, appHeaderHeight);
    place(app.pageBoard, undefined, undefined, w, h - appHeaderHeight);
    place(app.pageBoard.find('.x-main-view'), undefined, undefined, w, h - appHeaderHeight);

    app.pageBoard.css({'position':'relative', 'top':appHeaderHeight + cUnit});
  },

  onPause: function(event) {
    //
  },

  onResume: function(event) {
    //
  },

  onBackKeyDown: function(event) {
    app.goBack();
  },

  onMenuKeyDown: function(event) {
    //
  },

  clickMainMenu: function() {
    if( app.mainMenuAsGoBack ) {
      app.onBackKeyDown();
    } else {
      // TODO
    }
  },

  addPage: function(pageMgr) {
    if( app.pages[pageMgr.getPageID()] ) {
      throw 'already defined page.';
    }

    app.pages[pageMgr.getPageID()] = pageMgr;

    var board = $('<div></div>').addClass('x-main-view').attr('id', pageMgr.getPageID()).hide();
    app.pageBoard.append(board);
    pageMgr.initialize(board);
  },

  showPage: function(pageMrg, options) {
    if( pageMrg == app.currentPageMgr ) {
      console.log('already displayed: ' + pageMrg.getPageID());
      return;
    }

    var pageID = pageMrg.getPageID();
    var newMgr = app.pages[pageID];

    if( newMgr == undefined ) {
      console.log('unregistered page manager: ' + pageID);
      return;
    }

    app.switchHeader(newMgr);
    newMgr.onActivated(app.currentPageMgr, options);

    if( app.currentPageMgr ) {
      app.currentPageMgr.onDeactivated(newMgr);
    }

    app.pageBoard.find('.x-main-view').hide();
    app.pageBoard.find('#' + pageID).show();

    if( app.currentPageMgr ) {
      app.pageViewStack.push(app.currentPageMgr);
    }

    app.currentPageMgr = newMgr;
  },

  switchHeader: function(pageMgr) {
    var hi = pageMgr.getHeaderInfo();

    if( hi['mainButton'] == 'back' ) {
      app.header.find('li:nth-child(1)').html('<a href="javascipt:void(0);"><i class="fa fa-arrow-left"></i></a>').off('click').on('click', app.clickMainMenu);
      app.mainMenuAsGoBack = true;
    } else {
      app.header.find('li:nth-child(1)').html('<a href="javascipt:void(0);"><i class="fa fa-bars"></i></a>').off('click').on('click', app.clickMainMenu);
      app.mainMenuAsGoBack = false;
    }

    app.header.find('li:nth-child(2)').html('<span>' + hi['title'] + '<span>');
  },

  goBack: function() {
    if( app.pageViewStack.length < 1 ) { return; }

    app.showPage(app.pageViewStack.pop());
  }
};

app.begin();

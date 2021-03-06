var app = {
  pages: {},
  appBoard: $('#appMain'),
  header: $('#appHeader'),
  pageBoard: $('#appBody'),
  mainMenuAsGoBack: false,
  currentPageMgr: undefined,
  pageViewStack: [],
  wannaExit: false,

  begin: function() {
    var w = $(window).width();
    var h = $(window).height();

    $('body').css({width:w, height:h});

    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    document.addEventListener('pause', this.onPause, false);
    document.addEventListener('resume', this.onResume, false);
    document.addEventListener('backbutton', this.onBackKeyDown, false);
    document.addEventListener('menubutton', this.onMenuKeyDown, false);
  },

  isAdShown: function() {
    return !isRunningOnBrowser() && isValid(window.plugins.AdMob);
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
    var pages = [pageMain, recvMgr, sendMgr, historyPage];

    var clickFunc = function(p) { return function(){ app.showPage(p); }; };
    for(var i = 1; i <= pages.length; ++i) {
      var m = pages[i - 1];
      var hd = m.getHeaderInfo();

      app.addPage(m);

      $('<li/>').addClass('w3-hide-small').append(
        $('<a/>').addClass('w3-hover-none w3-hover-text-grey w3-padding-large')
          .attr('href', '#').html(nvl(hd.headerHtml, hd.title)).on('click', clickFunc(m))
      ).appendTo(app.header);
    }

    app.showPage(pageMain);

    if( !isRunningOnBrowser() && window.plugins && window.plugins.shareit ) {
      window.plugins.shareit.getRecvText(function(data) {
        window.plugins.shareit.clearText();
        app._showNext(data['text']);
      },
      function(error) {
        window.plugins.shareit.clearText();
      });
    } else {
      app._showNext();
    }
  },

  _showNext: function(recvText) {
    var curUrl = location.href;

    if( curUrl.indexOf('/send') > 0 || isValid2(recvText) ) {
      app.showPage(sendMgr, {'text':recvText});
    } else if( curUrl.indexOf('/receive') > 0 ) {
      app.showPage(recvMgr);
    }

    app.adjustLayout();
  },

  adjustLayout: function() {
    var appHeaderHeight = isShown(app.header) ? 50 : 0;
    var adHeight = app.isAdShown() ? admob.getBannerHeight() : 0;

    var w = $(window).width();
    var h = $(window).height();

    // TODO iOS: consider status bar height. adjust header top padding, header height.

    $('body').css({width:w, height:h});

    place(app.appBoard, undefined, undefined, w, h);
    place(app.header, undefined, undefined, w, appHeaderHeight);
    place(app.pageBoard, undefined, undefined, w, h - appHeaderHeight - adHeight);

    app.pageBoard.css({'position':'relative', 'top':appHeaderHeight + cUnit});

    for(var x in app.pages) {
      if( app.pages[x].adjustLayout ) {
        app.pages[x].adjustLayout(w, h);
      }
    }
  },

  onPause: function(event) {
    rsHistory.store();
  },

  onResume: function(event) {
    if( !isRunningOnBrowser() && window.plugins && window.plugins.shareit ) {
      window.plugins.shareit.getRecvText(function(data) {
        if( isValid2(data['text']) ) {
          window.plugins.shareit.clearText();
          app.showPage(sendMgr, {'text':data['text']});
        }
      },
      function(error) {
        window.plugins.shareit.clearText();
      });
    }

    if( app.isAdShown() ) {
      setTimeout(function() { admob.showADBanner(); }, 20);
    }
  },

  onBackKeyDown: function(event) {
    if( app.wannaExit ) { navigator.app.exitApp(); }

    if( !app.goBack() ) {
      app.wannaExit = true;
      showToast(R.text('backExit'));
      setTimeout(function() { app.wannaExit = false; }, 2900);
    }
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
    var pageID = pageMrg.getPageID();
    var newMgr = app.pages[pageID];

    if( newMgr == undefined ) {
      console.log('unregistered page manager: ' + pageID);
      return;
    }

    app.switchHeader(newMgr);
    newMgr.onActivated(app.currentPageMgr, options);

    if( app.currentPageMgr && app.currentPageMgr != newMgr ) {
      app.currentPageMgr.onDeactivated(newMgr);
    }

    app.pageBoard.find('.x-main-view').hide();
    app.pageBoard.find('#' + pageID).show();

    if( app.currentPageMgr && app.currentPageMgr.isMainContent && app.currentPageMgr.isMainContent() ) {
      if( app.pageViewStack.length <= 0 || app.pageViewStack[app.pageViewStack.length - 1] != app.currentPageMgr ) {
        app.pageViewStack.push(app.currentPageMgr);
      }
    }

    app.currentPageMgr = newMgr;

    if( app.isAdShown() ) {
      setTimeout(function() { admob.showADBanner(); }, 20);
    }

    app.adjustLayout();
  },

  switchHeader: function(pageMgr) {
    var hd = pageMgr.getHeaderInfo();

    if( hd['mainButton'] == 'back' ) {
      app.header.find('li:nth-child(1)').html('<a href="#"><i class="fa fa-arrow-left"></i></a>').off('click').on('click', app.clickMainMenu);
      app.mainMenuAsGoBack = true;
    } else {
      app.header.find('li:nth-child(1)').html('<img src="./img/logo.png" style="width:24px; height:24px; margin:13px 10px;">').off('click').on('click', app.clickMainMenu);
      app.mainMenuAsGoBack = false;
    }

    app.header.find('li:nth-child(2)').html('<span>' + hd['title'] + '<span>');

    // In case of using the full window
    app.header.css('display', (nvl(hd['fullMode'], false) ? 'none' : 'block'));
  },

  goBack: function() {
    if( app.pageViewStack.length < 1 ) { return false; }

    app.showPage(app.pageViewStack.pop());

    return true;
  }
};

app.begin();

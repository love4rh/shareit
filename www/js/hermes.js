

var Hermes = {
  socket: undefined,

  cleanUp: function() {
    Hermes.close();
  },

  // server is like this; ws://127.0.0.1:8080/websocket
  // timeout: in seconds. After this time passes, connection will be closed.
  //   if timeout is less than 1, the connection won't be closed by system.
  beginToWait: function(server, timeout, cbInit, cbSuccess, cbError) {
    if (!window.WebSocket) {
      window.WebSocket = window.MozWebSocket;
    }

    if (!window.WebSocket) {
      throw 'Your browser does not support Web Socket.';
      return;
    }

    var hm = this;
    if( hm.socket ) {
      hm.socket.close();
    }

    hm.socket = new WebSocket(server);

    hm.socket.onmessage = function(event) {
      var msg = JSON.parse(event.data);

      if( msg.type == undefined ) {
        console.log('invalid message');
        hm.close();
        return;
      }

      switch(msg.type) {
      case 'hello':
        // hermes.logging('Get ID from the server: ' + msg.id);
        if( cbInit != undefined ) { cbInit(msg.id); }
        console.log(msg.id);

        if( timeout == undefined ) { timeout = 300; };
        if( timeout > 0 ) { setTimeout(Hermes.close, timeout * 1000); }
        break;

      case 'data':
        if( cbSuccess != undefined ) { cbSuccess(msg.value); }
        break;
      }
    };

    hm.socket.onopen = function(event) {
      console.log(event);
      hm.send({'type':'hello', 'want':'receive'});
    };

    hm.socket.onerror = function(event) {
      if( cbError != undefined ) { cbError(event); }
    };

    hm.socket.onclose = Hermes.onClose;
  },

  sendToRemote: function(server, remoteID, data, cbSuccess, cbError) {
    if (!window.WebSocket) {
      window.WebSocket = window.MozWebSocket;
    }

    if (!window.WebSocket) {
      throw 'Your browser does not support Web Socket.';
      return;
    }

    var hm = this;
    if( hm.socket ) {
      hm.socket.close();
    }

    hm.socket = new WebSocket(server);

    hm.socket.onmessage = function(event) {
      var msg = JSON.parse(event.data);

      if( msg.type == undefined ) {
        console.log('invalid message');
        hm.close();
        return;
      }

      switch(msg.type) {
        case 'send':
          console.log('send: ' + msg.code);
          if( cbSuccess != undefined && msg.code == '0' ) {
            cbSuccess();
          }
          if( cbError != undefined && msg.code != '0' ) {
            cbError(msg.code);
          }
          hm.close();
          break;
      }
    };

    hm.socket.onopen = function(event) {
      console.log('Web Socket opened!');
      Hermes.send({'type':'send', 'receiver':remoteID, 'data':data});
    };

    hm.socket.onerror = function(event) {
      if( cbError != undefined ) { cbError(event); }
    };

    hm.socket.onclose = Hermes.onClose;
  },

  send: function(msg) {
    if( Hermes.socket == undefined ) { return; }
    Hermes.socket.send(JSON.stringify(msg));
  },

  close: function() {
    if( Hermes.socket == undefined ) { return; }

    Hermes.socket.close();
  },

  onClose: function(event) {
    console.log('Web Socket closed');
    Hermes.socket = undefined;
  }
};

module.exports = {
  getRecvText: function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'ShareIt', 'getRecvText', []);
  },

  clearText: function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'ShareIt', 'clearText', []);
  },

  setRecvText: function(recvText, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'ShareIt', 'setRecvText', [recvText]);
  }
};

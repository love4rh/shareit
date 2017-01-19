module.exports = {
  setUserID: function(userID, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'Tool', 'setUserID', [userID]);
  },

  addAlarmItem: function(scheduleID, calendarID, progTitle, channelName, timeLong, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'Tool', 'addAlarmItem', [scheduleID, calendarID, progTitle, channelName, timeLong]);
  },

  removeAlarmItem: function(scheduleID, calendarID, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'Tool', 'removeAlarmItem', [scheduleID, calendarID]);
  },

  clearAll: function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'Tool', 'clearAll', []);
  },

  upgrade: function(apkFile, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'Tool', 'upgrade', [apkFile]);
  }
};

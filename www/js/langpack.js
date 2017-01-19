var R = {
  locale: 'ko',
  langPack: {},

  setLocale: function(locale) {
    if( isValid2(locale) ) {
      if( locale.length > 2 ) {
        locale = locale.slice(0, 2);
      }

      R.locale = locale;
    }

    if( 'ko' == locale ) {
      R.langPack = {
        'appTitle': 'SHERIT',
        'recvPage': '받기',
        'sendPage': '보내기',
        'remoteID': '인증코드',
        'recvData': '받은 데이터',
        'sentData': '보낼 데이터',
        'remainTime': '유효시간',
        'timeExpired': '유효시간이 만료되었습니다.',
        'enterCode': '받을 기기의 5자리 코드를 입력하세요.',
        'actionSend': '보내기',
        'actionScan': 'QR 코드 스캔',
        'missData': '보낼 데이터를 입력하여야 합니다.',
        'missData2': '보낼 데이터를 먼저 입력해 주세요.',
        'missAuth': '인증코드를 입력하여야 합니다.',
        'actionCopy': '클립보드에 복사',
        'actionRedirect': '이동하기',
        'invalidQRCode': '알 수 없는 QR 코드입니다.',
        'workDone': '받기 완료!!',
        'error': '오류 발생!!',
        'retry': '다시 대기하시려면 클릭!',
        'sendSuccess': '데이터를 전송하였습니다.',
        'invalidAuthCode': '인증코드가 유효하지 않습니다.',
        'sendError': '데이터 전송 시 오류가 발생하였습니다.',
        'typeNormal': '일반 텍스트',
        'typeUrl': '사이트 주소',
        'redirect': '전송된 사이트로 이동합니다.',
        'hour': '시간',
        'min': '분',
        'sec': '초'
      };
    } else {
      R.langPack = {
        'appTitle': 'SHERIT',
        'recvPage': 'Receive',
        'sendPage': 'Send',
        'remoteID': 'Authenticode',
        'recvData': 'Text Received',
        'sentData': 'Text To Be Sent',
        'remainTime': 'Time Remaining',
        'timeExpired': 'Time expired.',
        'enterCode': 'Enter 5 digits code of the receiver.',
        'actionSend': 'Send',
        'actionScan': 'Scan QR Code',
        'missData': 'You should input text data to be sent.',
        'missData2': 'Please input text data to be sent before scanning QR Code.',
        'missAuth': 'You should input the Authenticode of the receiver.',
        'actionCopy': 'Copy To Clipboard',
        'actionRedirect': 'Explore',
        'invalidQRCode': 'Invalid QR Code',
        'workDone': 'Done to receive data!!',
        'error': 'An error occuured!!',
        'retry': 'Click to retry!',
        'sendSuccess': 'done to send the data.',
        'invalidAuthCode': 'Authenticode is invalid.',
        'sendError': 'An error occrrus in sending the data.',
        'typeNormal': 'Normal Text',
        'typeUrl': 'URL',
        'redirect': 'Move to the web site received.',
        'hour': 'hour(s)',
        'min': 'minute(s)',
        'sec': 'second(s)'
      };
    }
  },

  text: function(type) {
    return R.langPack[type];
  },

  makeText: function(type, options) {
    var genText = '';

    if( 'recvExplain' == type ) {
      switch(R.locale) {
        case 'ko':
          genText = '보낼 기기에서 <span class="w3-xlarge x-text-red">' + options + '</span>를 입력하거나,'
            + '<br>QR 코드를 스캔하세요.';
          break;

        default:
          genText = 'With your sending device, enter ' + '<span class="w3-xlarge x-text-red">' + options + '</span>'
            + ' in Authenticode, or scan the QR code above, please.';
          break;
      }
    }

    return genText;
  }
};

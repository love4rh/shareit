# Need to Modify

## AndroidManifest.xml
MainActivity 에서
1. android:launchMode="singleInstance"
2. 다음 추가
<intent-filter android:label="@string/launcher_name">
    <action android:name="android.intent.action.MAIN" />
    <category android:name="android.intent.category.LAUNCHER" />
</intent-filter>

## MainActivity.java 파일
1. 다음 메소드 추가
@Override
protected void onNewIntent(Intent intent)
{
    super.onNewIntent(intent);
    setShareIntent(intent);
}

private void setShareIntent(Intent intent)
{
    String action = intent.getAction();
    String type = intent.getType();

    if (Intent.ACTION_SEND.equals(action) && type != null) {
        if ("text/plain".equals(type)) {
            String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
            ShareIt.setRecvText(sharedText);
        }

        System.out.println("ACTION_SEND");
    }
}

2. onCreate() 메소드 super.onCreate(savedInstanceState); 다음 라인에 setShareIntent(getIntent()); 추가

3. import 해야할 클래스들 추가해야 함.

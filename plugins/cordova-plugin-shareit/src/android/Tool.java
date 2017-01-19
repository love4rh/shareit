/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/
package com.tool4us.shareit;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class Tool extends CordovaPlugin {
    private static Activity     _mainActivity = null;

    private String      _userID = "";

    public Tool()
    {
        //
    }

    public static void setMainActivity(Activity mainActivity)
    {
        _mainActivity = mainActivity;
    }

    public static Activity getMainActivity()
    {
        return _mainActivity;
    }

    /**
     * Sets the context of the Command. This can then be used to do things like
     * get file paths associated with the Activity.
     *
     * @param cordova The context of the main Activity.
     * @param webView The CordovaWebView Cordova is running in.
     */
    public void initialize(CordovaInterface cordova, CordovaWebView webView)
    {
        super.initialize(cordova, webView);
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArry of arguments for the plugin.
     * @param callbackContext   The callback id used when calling back into JavaScript.
     * @return                  True if the action was valid, false if not.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException
    {
        JSONObject result = new JSONObject();

        if( "setUserID".equals(action) )
        {
            _userID = args.getString(0);
            result.put("type", "setUserID");
            result.put("code", "0");
        }
        else if( "clearAll".equals(action) )
        {
            AlarmService.clearAllItems();

            result.put("type", "clearAll");
            result.put("code", "0");
        }
        else if( "addAlarmItem".equals(action) )
        {
            // scheduleID, calendarID, progTitle, channelName, timeLong(N)
            AlarmService.addAlarmItem(
                      args.getString(0)
                    , args.getString(1)
                    , args.getString(2)
                    , args.getString(3)
                    , args.getLong(4) );

            result.put("type", "addAlarmItem");
            result.put("code", "0");
        }
        else if( "removeAlarmItem".equals(action) )
        {
            // scheduleID, calendarID
            AlarmService.removeAlarmItem(args.getString(0), args.getString(1));
            result.put("type", "removeAlarmItem: " + args.getString(0));
        }
        else if( "upgrade".equals(action) )
        {
            String apkFile = args.getString(0);

            if( _mainActivity != null )
            {
                Intent intent= new Intent(Intent.ACTION_VIEW);

                intent.setDataAndType(Uri.parse(apkFile), "application/vnd.android.package-archive");
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

                _mainActivity.startActivity(intent);
            }
        }
        else
        {
            return false;
        }

        callbackContext.success(result);

        return true;
    }
}

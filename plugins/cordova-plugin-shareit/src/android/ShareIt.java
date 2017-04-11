package com.tool4us.texender;

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


public class ShareIt extends CordovaPlugin {
    private static String       _recvText = null;

    public ShareIt()
    {
        //
    }

    public static void setRecvText(String text) {
        _recvText = text;
    }

    public static String getAndClearRecvText() {
        String text = _recvText;

        _recvText = null;

        return text;
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

        if( "getRecvText".equals(action) )
        {
            result.put("text", (_recvText == null ? "" : _recvText));
        }
        else if( "clearText".equals(action) )
        {
            _recvText = null;
        }
        else if( "setRecvText".equals(action) )
        {
            _recvText = args.getString(0);
        }
        else
        {
            return false;
        }

        callbackContext.success(result);

        return true;
    }
}

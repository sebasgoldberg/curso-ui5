sap.ui.define([
    "sap/ui/core/mvc/Controller",
 ], function (Controller) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.controller.App", {
       onShowHello : function () {
           sap.ui.require([
            "sap/m/MessageToast",
           ], function(MessageToast){
                MessageToast.show("Hello World");
           });
       }
    });
 });
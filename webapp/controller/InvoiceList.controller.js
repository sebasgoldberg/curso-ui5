sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (Controller, JSONModel, formatter, Filter, FilterOperator, MessageToast) {
	"use strict";
	return Controller.extend("sgoldberg.sap.ui.demo.walkthrough.controller.InvoiceList", {
		formatter: formatter, 
		onInit : function () {
			var oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");
		},
		onFilterInvoices : function (oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.byId("invoiceList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		onPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", {
				invoicePath: encodeURIComponent(oItem.getBindingContext("invoice").getPath())
			});
		},
		onInvoiceDelete: function(oEvent) {
			var oItem = oEvent.getParameter("listItem"),
				sPath = oItem.getBindingContext('invoice').getPath();

			this.getView().getModel('invoice').remove(sPath,{
				success: function(){
					MessageToast.show('Invoice eliminada com sucesso.');
				}.bind(this),
				error: function(e){
					console.error(e);
				}.bind(this),
			});
		}
	});
});
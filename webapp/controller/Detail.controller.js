sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/ui/core/UIComponent"
], function (Controller, JSONModel, formatter, History, MessageToast, UIComponent) {
	"use strict";
	return Controller.extend("sgoldberg.sap.ui.demo.walkthrough.controller.Detail", {
		formatter: formatter, 
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
			var oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");
		},
		_onObjectMatched: function (oEvent) {
			this.byId("rating").reset();
			this.byId('invoiceListShipper').bindElement({
				path: decodeURIComponent(oEvent.getParameter("arguments").invoicePath)+'/shipper',
				model: "invoice",
			});
			this.getView().bindElement({
				path: decodeURIComponent(oEvent.getParameter("arguments").invoicePath),
				model: "invoice",
				parameters: {
					expand: "shipper",
				},
			});
		},

		onNavBack: function () {
			var m = this.getView().getModel('invoice');
			m.resetChanges();

			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("overview", {}, true);
			}

		},

		onRatingChange: function (oEvent) {
			var fValue = oEvent.getParameter("value");
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			MessageToast.show(oResourceBundle.getText("ratingConfirmation", [fValue]));
		},

		onGravar: function (oEvent) {
			var m = this.getView().getModel('invoice');
			
			if (!m.hasPendingChanges()){
				MessageToast.show("Sem mudanças para gravar.");
				return;
			}

			this.getView().setBusy(true);

			m.submitChanges({
				success: function (oData) {

					MessageToast.show("Mudanças realizadas.");

					this.getView().setBusy(false);

				}.bind(this),
				error: function (oData) {

					MessageToast.show("Aconteceu um erro.");

					console.error(oData);

					this.getView().setBusy(false);
				},
			});

		},

		onCancelar: function (oEvent) {

			var m = this.getView().getModel('invoice');

			if (!m.hasPendingChanges()){
				MessageToast.show("Sem mudanças para cancelar.");
				return;
			}

			m.resetChanges();
		}
	});
});
sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/ui/core/UIComponent"
], function (Controller, JSONModel, formatter, History, MessageToast, UIComponent) {
	"use strict";
	return Controller.extend("sgoldberg.sap.ui.demo.walkthrough.controller.Create", {
		formatter: formatter, 
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("create").attachPatternMatched(this._onCreateMatched, this);
		},
		_onCreateMatched: function (oEvent) {
			var m = this.getView().getModel("invoice");
			m.metadataLoaded().then(function(){
				var oContext = m.createEntry('/Invoices',
					{
						properties: {
							Quantity: 0,
							ExtendedPrice: 0,
						}
					});
				this.getView().bindElement({
					path: oContext.getPath(),
					model: "invoice",
				});
			}.bind(this))
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

		onGravar: function (oEvent) {
			var m = this.getView().getModel('invoice');

			this.getView().setBusy(true);

			m.submitChanges({
				success: function (oData) {

					this.getView().setBusy(false);

					MessageToast.show("Invoice criado com sucesso.");
					
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("detail", {
						invoicePath: encodeURIComponent(this.getView().getBindingContext("invoice").getPath())
					}, true);

				}.bind(this),
				error: function (oData) {

					MessageToast.show("Aconteceu um erro.");

					console.error(oData);

					this.getView().setBusy(false);
				},
			});

		},

		onCancelar: function (oEvent) {

			this.onNavBack();

		}
	});
});
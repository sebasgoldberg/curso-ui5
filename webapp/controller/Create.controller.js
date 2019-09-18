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
			var oViewModel = new JSONModel({
				copies: 0
			});
			this.getView().setModel(oViewModel, "view");
		},

		_onCreateMatched: function (oEvent) {
			this.aDeferreds = [];
			this.getView().getModel("view").setProperty("/copies", 0);
			var m = this.getView().getModel("invoice");
			m.metadataLoaded().then(function(){

				// Create a deferred object and initialize it executing the passed function.
				var oDeferred = jQuery.Deferred(function(deferred){

					var oContext = m.createEntry('/Invoices',{
						properties: {
							Quantity: 0,
							ExtendedPrice: 0,
						},
						success: function(){
							deferred.resolve();
						},
						error: function(){
							deferred.reject();
						}
					});

					this.getView().bindElement({
						path: oContext.getPath(),
						model: "invoice",
					});	

				}.bind(this));

				this.aDeferreds.push(oDeferred);

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

		createDeferredEntry: function(properties){
			
			var m = this.getView().getModel('invoice');

			// Create a deferred object and initialize it executing the passed function.
			var oDeferred = jQuery.Deferred(function(deferred){
				m.createEntry('/Invoices', {
					properties: properties,
					success: function(){
						deferred.resolve();
					},
					error: function(){
						deferred.reject();
					}
				});
			}.bind(this))

			this.aDeferreds.push(oDeferred);

			return oDeferred;
		},

		onGravar: function (oEvent) {
			var m = this.getView().getModel('invoice');

			this.getView().setBusy(true);

			var iCopies = this.getView().getModel("view").getProperty("/copies");
			var oNewInvoice = this.getView().getBindingContext("invoice").getObject();

			for (var i=0;i<iCopies; i++){
				this.createDeferredEntry({
					ShipperName: oNewInvoice.ShipperName,
					ProductName: oNewInvoice.ProductName + " (Copia "+(i+1)+")",
					Quantity: oNewInvoice.Quantity,
					ExtendedPrice: oNewInvoice.ExtendedPrice,
				});
			}

			m.submitChanges();

			// method when creates a main deferred object from the passed deferreds,
			// so, when all deferreds were resolved, the main deferred would be resolved.
			jQuery.when.apply(jQuery, this.aDeferreds)
				// Once resolved always would be executed.
				.always(function(){
					this.getView().setBusy(false);
				}.bind(this))
				// Once resolved with success (all deferred were successful) would be executed.
				.done(function(){
					MessageToast.show("Invoice criado com sucesso.");
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("detail", {
						invoicePath: encodeURIComponent(this.getView().getBindingContext("invoice").getPath())
					}, true);
				}.bind(this))
				// In case of fail (at least one deferred fails) would be executed.
				.fail(function(){
					MessageToast.show("Aconteceu um erro.");
				}.bind(this));
		},

		onCancelar: function (oEvent) {

			this.onNavBack();

		}
	});
});
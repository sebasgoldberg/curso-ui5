sap.ui.define([
	'sap/ui/core/XMLComposite',
], function (XMLComposite) {
	"use strict";
	var ProductRatingClass = XMLComposite.extend("sap.ui.demo.walkthrough.control.ProductRating", {

        metadata : {
			properties : {
				value: 	{type : "float", defaultValue : 0}
			},
			events : {
				change : {
					parameters : {
						value : {type : "int"}
					}
				}
			}
        },
        
        fragment: "sap.ui.demo.walkthrough.control.ProductRating",

    });

    ProductRatingClass.prototype._onRate = function (oEvent) {
        var oRessourceBundle = this.getModel("i18n").getResourceBundle();
        var fValue = oEvent.getParameter("value");
        this.setProperty("value", fValue, true);
        this.byId("label").setText(oRessourceBundle.getText("productRatingLabelIndicator", [fValue, oEvent.getSource().getMaxValue()]));
        this.byId("label").setDesign("Bold");
    };

    ProductRatingClass.prototype._onSubmit = function (oEvent) {
        var oResourceBundle = this.getModel("i18n").getResourceBundle();

        this.byId("rating").setEnabled(false);
        this.byId("label").setText(oResourceBundle.getText("productRatingLabelFinal"));
        this.byId("button").setEnabled(false);
        this.fireEvent("change", {
            value: this.getValue()
        });
    };

    ProductRatingClass.prototype.setValue = function (fValue) {
        this.setProperty("value", fValue, true);
        this.byId("rating").setValue(fValue);
    };

    ProductRatingClass.prototype.reset = function () {
        var oResourceBundle = this.getModel("i18n").getResourceBundle();

        this.setValue(0);
        this.byId("label").setDesign("Standard");
        this.byId("rating").setEnabled(true);
        this.byId("label").setText(oResourceBundle.getText("productRatingLabelInitial"));
        this.byId("button").setEnabled(true);
    };

    return ProductRatingClass;
});
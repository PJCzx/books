(function($) {
    updateBarcode = function ($element) {
        $element.JsBarcode("" + $element.data("barcode"), {
            displayValue: true,
            width:1,
            height:25,
        });
    };
    
    updateBarcodes = function() {
        console.log("updateBarcodes is done before dom update...");
        $(".barcode").each(function(){updateBarcode($(this));});
    };
})(jQuery);
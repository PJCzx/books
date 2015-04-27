(function () {
    var app = angular.module("store", ['uiGmapgoogle-maps']);
    
    app.controller("StoreController", function ($scope) {
        
        var storeController = this;
        this.products = {};

        
        dpd.products.get({}, function (products, err) {
            storeController.products = products;
            $scope.$apply();
        });
        
        dpd.on("productPost", function (product) {
            console.log("productPost : " + product);
            storeController.products.push(product);
            $scope.$apply();
        });
        
        dpd.on("productDel", function (product) {
            console.log("productDel : " + product);
            for (i = 0; i < storeController.products.length; i++) {
                if( storeController.products[i].id == product.id ) {
                    storeController.products.splice(i,1);
                    continue;
                }
            }
            $scope.$apply();
        });
        this.delete = function(id) {
            dpd.products.del(id, function (err) {
              if(err) console.log(err);
            });
        };
        
        
        this.submit = function() {
            var newProduct = $scope.form || {};
            
            dpd.products.post(newProduct, function(result, err) {
              if(err) return console.log(err);
              console.log(result, result.id);
            });

            $scope.form = {};
        };
        
    });
})();
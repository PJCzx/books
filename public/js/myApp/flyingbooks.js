(function () {
    var app = angular.module("flyingbooks", ['uiGmapgoogle-maps']);
    
    app.controller("BookController", function($http, $scope) {
        var bookController = this;
        this.books = [];
        this.canCreate = function () {
            return this.books !== [];
        };
        this.updateBarcodes = updateBarcodes;
        
        $scope.$watch('this.books', function(){
            console.log("Books changed");
            updateBarcodes();
        });
        
        this._create = function(volumeInfo, coords) {
            volumeInfo.coords = [coords];
            $http.post("/book", volumeInfo)
            .success(function (aBook) {
                bookController.books.push(aBook);
            })
            .error(function (err) {
                console.log(err);
            });
        }
        this.create = function(volumeInfo, coords) {
            volumeInfo.lat = coords.latitude;
            volumeInfo.lon = coords.longitude;
            $http.get("http://localhost:4730/api/book", { 
                params: {
                    title: volumeInfo.title,
                    lat: volumeInfo.lat,
                    lon: volumeInfo.lon
                }
            })
            .success(function(data, status, headers, config) {
                console.log("succes:", data);
                })
            .error(function(data, status, headers, config) {
                console.log("error:", data);
            });
        };
        this.map = {
            center: {
                latitude: 0,
                longitude: 0
            },
            zoom: 2,
            markers: [
                {
                    idKey: "1",
                    coords: [{
                        latitude: 45,
                        longitude: -73 
                    }]
                }
            ],
            eventsHandler: {
                'click': function (maps, eventName, arguments ) {
                    console.log("click on :", maps, eventName, arguments);
                },
                'bounds_changed': function (maps, eventName, arguments ) {
                    console.log("bounds_changed");
                    maps.getBounds().getNorthEast().lat();
                    maps.getBounds().getSouthWest().lng();
                }
            },
            markerEvents: {
                'dragend': function (marker, eventName, model, arguments ) {
                    $scope.bookLat = arguments[0].latLng.lat();
                    $scope.bookLng = arguments[0].latLng.lng();
                }
            }
        };
        this.apiUrl = 'https://www.googleapis.com/books/v1/volumes';

        this.lastCoordsOf = function(book) {
            return book.coords !== undefined ? book.coords[book.coords.length - 1] : {"latitude": 0, "longitude": 0};
        };
        $http.get("/book")
            .success(function(data, status, headers, config) {
            bookController.books = data;
        })
            .error(function(data, status, headers, config) {
            console.log("Error while fetching books.");
        });
        this.delete = function (bookId) {
            $http.delete("/book/" + bookId)
                .success(function() {
                var index = -1;
                for(var i = 0; i < bookController.books.length; i++) {
                    if(bookController.books[i].id === bookId) {
                        index = i;
                        continue;
                    }
                }
                if (index > -1) {
                    bookController.books.splice(index, 1);
                }
                

            })
            .error(function(err) {
                alert(err.message);
            });

        };
        this.select = function (book) {
            //console.log("Selected:", book);
            bookController.bookAPI = {};
            bookController.selectedBook = book;
            
        };
        this.getBooks = function(params) {
            //if(params.isbn.length !== 13) return;
            var r = "";
            
            if(params.any !== undefined){
                r+= params.any;
            }
            
            
            for(var param in params) {
                //console.log(param, params[param]);
                if (params[param] != "" && param !== "any")
                {
                    if(r !== "") r += "+";
                    r+=  param + ":" + params[param];
                }
            }
            console.log("Fetch request >" + r);
            
            if(r === "") return;

            $http({
                url: bookController.apiUrl, 
                method: "GET",
                params: {"q" : r}
             })
                .success(function(data, status, headers, config) {
                //console.log(data, status, headers, config);
                bookController.bookAPI = data;
            })
                .error(function(){});
        };
        
        this.test = function(obj) {
            alert( obj || "Test");
            console.log( obj || "Test");
        };
        
        this.fullTextSearch = function (text) {
            $scope.check = text;
            $http.get("http://localhost:4730/api/fulltext/books", {params: {text:text}})
                .success(function (data, status, headers, config) {
                    console.log(data, config);
                    $scope.results = data;
            }); 
        };
            
        this.geoDisatanceSearch = function () {
            $http.get("http://localhost:4730/api/books/geodistance", {
                params: {
                      distance: $scope.distance + "km",
                      lat: 41.12,
                      lon: -71.34
                  }})
                .success(function (data, status, headers, config) {
                    console.log(data, config);
                    $scope.results = data;
            });
            
        };
        
        
        
    });
    
    app.controller("UserController", function($scope, $http) {
        userController = this;
        this.me = {};
        this.isAuthenticated = false;
        
        this.logout = function() {
            $http.post("/users/logout", {})
                .success(function(){ 
                console.log("Logged out");
                userController.me = {};
                userController.isAuthenticated = false;
                })
                .error(function(){ console.log("error logout"); });
        };
        this.login = function(username, password) {
            $http.post("/users/login", {"username": username, "password": password})
                .success(function(data_a, status, headers, config){
                    userController.sessionId = data_a.id;
                    $http.get("/users/me")
                        .success(function(data_b) {
                        userController.me = data_b;
                        userController.isAuthenticated = true;
                    })
                        .error();
                })
                .error(function(data, status, headers, config) {
                    console.log("error in UserController.login");
            });
            
        };

        $http.get("/users/me")
            .success(function(obj) {
            userController.isAuthenticated = obj ? true : false;
            userController.me = obj || {};
        })
            .error(function() {
            console.log("error in gettin current user");
        });
    });
})();
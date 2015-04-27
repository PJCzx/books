(function () {
    var map;

    function initialize() {
      var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(48.850258199721495, 2.40875244140625)
      };

      map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);
        // Try HTML5 geolocation
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = new google.maps.LatLng(position.coords.latitude,
                                               position.coords.longitude);

              var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'Location found using HTML5.'
              });

              map.setCenter(pos);
            }, function() {
              handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }

        //on map click show coordinate
        var marker = undefined;
        google.maps.event.addListener(map, 'click', function(e) {
            console.log(e.latLng.lat(), e.latLng.lng());
            placeMarker(e.latLng, map);
          });
    }
    function placeMarker(position, map) {
      var marker = new google.maps.Marker({
        position: position,
        map: map
      });
      map.panTo(position);
    }

    function handleNoGeolocation(errorFlag) {
      if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
      } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
      }

      var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
      };

      var infowindow = new google.maps.InfoWindow(options);
      map.setCenter(options.position);
    }


    google.maps.event.addDomListener(window, 'load', initialize);
})();
/**
 * Created by 99171 on 2017/2/14.
 */
// 4square doc: https://developer.foursquare.com/docs/venues/search
// googlemap doc: https://developers.google.com/maps/documentation/javascript/tutorial
// googlemap api: https://maps.googleapis.com/maps/api/js?key=AIzaSyAW28WaWGvoyW_FMLBilShlwEfrb7grQzM

$(function() {
  var CLIENT_ID = 'KIZEC1UO2L1WZVGXEDMAXOIT1WJZZUGIRK1TZA32NPVSMHDY';
  var CLIENT_SECRET = 'PTTVSVXKZ3DKJSZCC3KZUTHO2TUBHC5O1H0313EMBIYASNGT';
  var FOUR_SQUARE_SERACH = 'https://api.foursquare.com/v2/venues/search?';
  var DEFAULT_QUERY = '武昌鱼';
  var QUERY_STRING = {
    ll: '30.5931,114.3054', // wuhan
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    v: Date.now(),
    limit: 5
  };

  var throttle = function(callback) {
    var timer;

    return function(arg) {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(function() {
        timer = null;
        callback(arg);
      }, 500);
    }
  };

  var App = {
    markers: [],
    init: function() {
      var url = FOUR_SQUARE_SERACH + $.param($.extend(QUERY_STRING, {
          query: DEFAULT_QUERY
        }));

      $.getJSON(url)
        .done(function(data) {
          var venues = data.response.venues;

          App.initList(venues);
          App.updateMap(venues);
        });
    },
    initList: function(venues) {
      var VenuesViewModel = function() {
        this.keyword = ko.observable('');
        this.venues = ko.observable(venues);
        this.showInfoOnMap = function(item) {

        };
      };

      var vm = new VenuesViewModel();

      // listen to user input change
      vm.keyword.subscribe(throttle(function(value) {
        var url = FOUR_SQUARE_SERACH + $.param( $.extend(QUERY_STRING, { query: value, limit: 10 }) );

        $.getJSON(url).done(function(data) {
          var venues = data.response.venues;
          vm.venues(venues);

          App.clearMarkers();
          App.updateMap(venues);
        })
      }));

      ko.applyBindings(vm);
    },
    clearMarkers: function() {
      this.markers.forEach(function(marker) {
        marker.setMap(null);
      });

      this.markers.length = 0;
    },
    clickMarkShowInfowindow: function(marker, infowindow) {
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
    },
    addMarker: function(veune) {
      var myLatLng = {
        lat: veune.location.lat,
        lng: veune.location.lng
      };

      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: veune.name,
        animation: google.maps.Animation.DROP
      });

      App.markers.push(marker);

      return marker;
    },
    addInfoWindow: function(veune) {
      var content = '<h3>' + veune.name + '</h3>';
      var infowindow = new google.maps.InfoWindow({
        content: content
      });

      return infowindow;
    },
    updateMap: function(venues) {
      venues.forEach(function(veune) {
        var marker = App.addMarker(veune);
        var infowindow = App.addInfoWindow(veune);

        App.clickMarkShowInfowindow(marker, infowindow);
      });
    }
  };

  App.init();
});
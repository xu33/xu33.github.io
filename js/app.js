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

  var url = FOUR_SQUARE_SERACH + $.param({
    ll: '30.5931,114.3054', // wuhan
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    v: Date.now(),
    search: '咖啡',
    limit: 5
  });

  $.getJSON(url)
    .done(function(data) {
      var venues = data.response.venues;
      var marker
      var myLatLng
      venues.forEach(veune => {
        myLatLng = {
          lat: veune.location.lat,
          lng: veune.location.lng
        };

        marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: veune.name
        });
      });
    });
});
/**
 * Created by 99171 on 2017/2/14.
 */

// 4square: https://developer.foursquare.com/docs/venues/search
// googlemap: https://maps.googleapis.com/maps/api/js?key=AIzaSyAW28WaWGvoyW_FMLBilShlwEfrb7grQzM
// https://api.foursquare.com/v2/venues/search?ll=40.7,-74&oauth_token=2ELZE04TLBF5RJDWWHY1TU24T5ICJKX11YJ5A2QBIMLPZFYU&v=20170214
$(function() {
  var CLIENT_ID = 'KIZEC1UO2L1WZVGXEDMAXOIT1WJZZUGIRK1TZA32NPVSMHDY';
  var CLIENT_SECRET = 'PTTVSVXKZ3DKJSZCC3KZUTHO2TUBHC5O1H0313EMBIYASNGT';
  var FOUR_SQUARE_SERACH = 'https://api.foursquare.com/v2/venues/search?';
  var url = FOUR_SQUARE_SERACH + $.param({
    ll: '30.5931,114.3054',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    v: Date.now(),
    search: '咖啡',
    limit: 5
  });

  console.log(url);

  /*
  * ?ll=30.5931,114.3054'
   + '&client_id=KIZEC1UO2L1WZVGXEDMAXOIT1WJZZUGIRK1TZA32NPVSMHDY'
   + '&client_secret=PTTVSVXKZ3DKJSZCC3KZUTHO2TUBHC5O1H0313EMBIYASNGT'
   + '&search=' + escape('热干面')
  *
  * */




  $.getJSON(url)
    .done(function(data) {
      console.log(data);
    });
});
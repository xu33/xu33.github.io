/**
 * Created by 99171 on 2017/2/14.
 */
// 4square doc: https://developer.foursquare.com/docs/venues/search
// googlemap doc: https://developers.google.com/maps/documentation/javascript/tutorial
// googlemap api: https://maps.googleapis.com/maps/api/js?key=AIzaSyAW28WaWGvoyW_FMLBilShlwEfrb7grQzM

$(function() {
  // 4square api's client_id
  var CLIENT_ID = 'KIZEC1UO2L1WZVGXEDMAXOIT1WJZZUGIRK1TZA32NPVSMHDY';
  // 4square api's client_secret
  var CLIENT_SECRET = 'PTTVSVXKZ3DKJSZCC3KZUTHO2TUBHC5O1H0313EMBIYASNGT';
  // 4square's search venues api
  var FOUR_SQUARE_SERACH = 'https://api.foursquare.com/v2/venues/search?';
  // 默认的关键字
  var DEFAULT_QUERY = '武昌鱼';
  // 默认的查询字符串参数
  var QUERY_STRING = {
    ll: '30.5931,114.3054', // wuhan
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    v: Date.now(),
    limit: 5
  };
  // 失败提示语
  var ERROR_MESSAGE = '4SQUARE服务出错了...，请稍后再试';

  // 去抖函数
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
    };
  };

  var loadVenues = function(url) {
    var dfd = $.Deferred();

    $.ajax({
      url: url,
      dataType: 'text'
    }).done(function(data) {
      try {
        data = JSON.parse(data);
      } catch(e) {
        alert(ERROR_MESSAGE);
      }

      if (data.meta.code !== 200) {
        alert(ERROR_MESSAGE);
      }

      dfd.resolve(data.response.venues);
    }).fail(function() {
      alert(ERROR_MESSAGE);
      dfd.reject();
    });

    return dfd;
  };

  var App = {
    markers: [],
    infoWindows: [],
    init: function() {
      var self = this;

      // 创建程序的ViewModel
      var VenuesViewModel = function() {
        this.keyword = ko.observable('');
        this.venues = ko.observable([]);

        // 点击列表项的事件监听函数
        this.showInfoOnMap = function(item) {
          var id = item.id;
          var infoWindow = App.infoWindows.find(o => o.id == id);
          var marker = App.markers.find(o => o.id == id);

          self.hideWindows();

          infoWindow.open(map, marker);
          map.setCenter(marker.getPosition());
        };
      };

      // 实例化ViewModel
      this.vm = new VenuesViewModel();

      // 监听关键词变化，重新拼装查询字符串，发送搜索请求
      this.vm.keyword.subscribe(throttle(function(value) {
        var url = FOUR_SQUARE_SERACH + $.param( $.extend(QUERY_STRING, { query: value, limit: 10 }) );
        self.request4SquareApi(url);
      }));

      ko.applyBindings(this.vm);

      // 拼装api地址
      var url = FOUR_SQUARE_SERACH + $.param($.extend(QUERY_STRING, {
          query: DEFAULT_QUERY
        }));

      // 加载最初的五个地点
      self.request4SquareApi(url);
    },
    request4SquareApi: function(url) {
      var self = this;
      loadVenues(url).then(function(venues) {
        if (venues.length > 0) {
          self.vm.venues(venues);
          App.clearMarkersAndWindows();
          App.updateMap(venues);
        }
      });
    },
    // 隐藏已经打开的infoWindow
    hideWindows: function() {
      this.infoWindows.forEach(function(info) {
        info.close();
      });
    },
    clearMarkersAndWindows: function() {
      this.markers.forEach(function(marker) {
        marker.setMap(null);
      });

      this.markers.length = 0;
      this.infoWindows.length = 0;
    },
    clickMarkShowInfoWindow: function(marker, infoWindow) {
      var self = this;
      marker.addListener('click', function() {
        self.hideWindows();

        infoWindow.open(map, marker);
        map.setCenter(marker.getPosition());
      });
    },
    // 新建一个marker实例，并保存到markers数组中
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

      marker.id = veune.id;

      App.markers.push(marker);

      return marker;
    },
    // 新建一个infoWindow实例，并保存到infoWindows数组中
    addInfoWindow: function(veune) {
      var content = '<h3>' + veune.name + '</h3>';
      var infowindow = new google.maps.InfoWindow({
        content: content
      });

      infowindow.id = veune.id;
      App.infoWindows.push(infowindow);

      return infowindow;
    },
    // 根据返回的venues，更新地图上的标记
    updateMap: function(venues) {
      var lastMarker

      venues.forEach(function(veune) {
        var marker = App.addMarker(veune);
        var infoWindow = App.addInfoWindow(veune);

        App.clickMarkShowInfoWindow(marker, infoWindow);

        lastMarker = marker
      });

      if (lastMarker) {
        map.setCenter(lastMarker.getPosition());
      }
    }
  };

  App.init();
});
var watchID = null;  

var map;
var index = 0;
var curr_marker = null;
var markers = [];
var paths = [];
var specialPaths = []
var adjacencyMatrix = [];
var distanceMatrix = [];
var markerList = $("#markerList");
var pathList = $("#pathList");
var startSelect = $("#startSelect");
var endSelect = $("#endSelect");

var infowindow;

var image_data = [];
var dispatcherSelect = $("#dispatcherSelect");
var dispatchersList = []
var imageList = []
var report_id = '';

$(document).ready(function(){  
    var optn = {  
            enableHighAccuracy: true,  
            timeout: Infinity,  
            maximumAge: 0     
        };  
    if( navigator.geolocation )  
     navigator.geolocation.watchPosition(initMap, fail, optn);  
    else  
     $("p").html("HTML5 Not Supported");  
    $("button").click(function(){  
      
    if(watchID)  
     navigator.geolocation.clearWatch(watchID);  
       
    watchID = null;  
    return false;  
});  
      
});  
  
function initMap(position)  
{  
    var googleLatLng = new google.maps.LatLng(position.coords.latitude,   
                        position.coords.longitude);  
     
      
    map = new google.maps.Map(document.getElementById('map'), {
          zoom: 14,
          center: googleLatLng, 
          styles: [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
]
        });  

   // addCurrMarker(map, googleLatLng, "Technotip.com", "SATISH B <b>About Me:</b>https://technotip.com/about/");

    map.data.loadGeoJson('static/polygon/gadm41_PHL_2.json');
    map.data.setStyle({
      //fillColor: "green",
      strokeWeight: 0,
    });
  
  
    
  
  
    pushInitMarker(map);
    addMarker(map, coords);

    directionsService = new google.maps.DirectionsService,
    directionsDisplay = new google.maps.DirectionsRenderer({
              map: map,
              suppressMarkers: true,
  
            })
}  
  
 
  
function fail(error)  
{  
    var errorType={  
      0:"Unknown Error",  
      1:"Permission denied by the user",  
      2:"Position of the user not available",  
      3:"Request timed out"  
    };  
      
    var errMsg = errorType[error.code];  
      
    if(error.code == 0 || error.code == 2){  
        errMsg = errMsg+" - "+error.message;  
    }  
      
    $("p").html(errMsg);  
} 

function pushInitMarker(map) {
  
	var marker_label = getUniqueLabel();

	var marker = new google.maps.Marker({
		position: {lat: 13.2366582, lng: 123.5321828}, 
		label: marker_label.toString(),
		map: map
		});
	markers.push({
		marker: marker,
		data: {
			position: marker['position'],
			label: marker_label
		}
	});
  image_data.push(" ")
  updateMarkerList();
	updateSelect();
  //addPath(marker);
  
  
}

//Label for marker
function getUniqueLabel() {
	return (index++);		
}

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
/** 
function getCoords(coords){
  for (var i = 0; i < coords.length; i++) {
    coords.push(coords);
    
  }
}
*/
// Add marker
function addMarker(map, coords) {
 //var dataCoords = document.getElementById("latlng").innerHTML;
 //var y = [[123.5362889618832, 13.23564733845483], [123.5365080648321, 13.235575924639809]];
 //const x = [];
 /**mapping1 = {
            '{': '',
            '}': '',
            '[': '',
            ']': '',

          }
 result = coords.replace(/[{}]/g, m1 => mapping1[m1]).replace(/[[]]/g, m1 => mapping1[m1]);*/

 //x.push(str(coords));
 
 var template = [
  '<?xml version="1.0"?>',
  '<svg width="26px" height="26px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">',
  '<circle cx="50" cy="50" fill="none" r="35" stroke="red" stroke-width="10">',
    '<animate attributeName="r" from="38" to="50" dur="1.5s" begin="0s" repeatCount="indefinite"/>',
    '<animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/>',
  '</circle>',
  '<circle stroke="#222" cx="50" cy="50" fill="{{ color }}" r="35"/>',
  '</svg>'
].join('\n');

var svg = template.replace('{{ color }}', 'red');




//var coord = ''
//alert('try')
//for (coord of coords) {
  for (var i = 0; i < coords.length; i++) {
    //alert(coord)
    if(coords !== null){
      play();
    }
    
    var marker_label = getUniqueLabel();
      const sanitizedCoords = coords[i].replace(/"/g, '');
      var loc = sanitizedCoords.split(",");
      var lat = parseFloat(loc[0])
      var lng = parseFloat(loc[1])
      var url = loc[2]
      var report_id = loc[3]
      var label = loc[4]
      var prob = Number(loc[5])
      var address = loc[6].replace(/\]/g, '').replace(/\[/g, '').replace(/["']/g, '')
      var date_time = loc[8]
      var saved_label = loc[9]
      var saved_prob = loc[10]
      

      //const sanitizedModelLabel = model_label[i].replace(/"/g, '');
      //const sanitizedProb = prob[i].replace(/"/g, '');



      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng) ,
        //animation: google.maps.Animation.DROP,
        label: marker_label.toString(),
        //icon: "https://maps.google.com/mapfiles/marker"+marker_label.toString()+".png",
        icon: { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), 
        scaledSize: new google.maps.Size(40, 40) },
	      optimized: false,
        map: map
        });
         

      //toggleBounce(marker);
      markers.push({
        marker: marker,
        data: {
          position: marker['position'],
          label: marker_label
        }
      });
      //var content = "<div style='float:left;'><img style='width:150px;height:auto;border:3px double white;' src='"+url+"'></div><div style='float:right; padding: 10px: '><b>"+report_id+"</b><br/>"+label+"<br/>label higher that 70 <br/>"+prob+"</div>"
      image_data.push({report_id, url, label, prob, address, date_time, saved_label, saved_prob})

      //var content =  url// 




      //alert(infoWindow)

      


    
      
   // }
  }

	

	//Update marker list
	updateMarkerList();
	updateSelect();
  addPath(marker);
	//Listener for path creation
	/**marker.addListener('click', function() {
		addPath(marker);
	});**/
  showInfoWindow();
  
}

function showInfoWindow(){
 
  for (var i = 0; i < markers.length; i++) {
    var x = markers[i]['marker']
    var a = image_data[i]
    var form2 = "<br/><br/><form action='/image_details' method='post', enctype='multipart/form-data'><button style='border: none;outline: none;background: none;cursor: pointer;color: #0000EE;padding: 0;text-decoration: underline;font-family: inherit;font-size: inherit;float:left;'>More details</button><input id='report_id_image' name='report_id_image' value='"+a.report_id+"' hidden></input><input id='label_image' name='label_image' value='"+a.saved_label+"' hidden></input><input id='prob_image' name='prob_image' value='"+a.saved_prob+"' hidden></input><input id='address_image' name='address_image' value='"+a.address+"' hidden></input><input id='date_time_image' name='date_time_image' value='"+a.date_time+"' hidden></input></form>"
    var content = "<form action='/dispatcher' method='post', enctype='multipart/form-data'><div style='float:left;'><img style='width:150px;height:auto;border:3px double white;' src='"+a.url+"'></div><div style='float:right; padding: 10px: '>Ref: <b>"+a.report_id+"</b><input style='width:100%', type='text', name ='report_id', id='report_id', value='"+a.report_id+"' hidden/><input name='saved_label_data' id='saved_label_data' value='"+a.saved_label+"' hidden/><br/><br/><i class='fas fa-map-marker-alt'></i> "+a.address+"<br/><i class='far fa-clock'></i> "+a.date_time+"<br/><br/>Classification: <mark style='background-color:#04aa6d;color:white;'>"+a.saved_label+"</mark><br/>Probability: <mark style='background-color:#04aa6d;color:white;'>"+a.saved_prob+"</mark><br/>Saved Class: "+a.saved_label+"<br/><br/></div></form><div> <br/> <br/> </div>" + form2
    //alert(JSON.stringify(c))
    //var content = '<div style="width:350px"><div style="width:130px;float:left"><img src="'+a.url+'"  width="130" /><h4>'+a.report_id+'</h4></div><div style="width:200px;float:left;padding-left:20px"><p style="font-size:150%;color:orange">200-500$/night</p><p style="font-size:80%">'+a.address+'</p><div class="star-rating-r"><a href="#"><img alt="" src="img/rating-b.png"></a><a href="#"><img alt="" src="img/rating-b.png"></a><a href="#"><img alt="" src="img/rating-b.png"></a><a href="#"><img alt="" src="img/rating-b.png"></a><a href="#"><img alt="" src="img/rating-a.png"></a></div><p><br/><div class="cat-icons"><span class="cat-icon-01 active"></span><span class="cat-icon-02"></span><span class="cat-icon-03"></span><span class="cat-icon-04"></span><span class="cat-icon-05"></span><span class="cat-icon-06"></span><div class="clear"></div></div></p><button class="srch-btn xbtn" style="margin-top:20px;float:right" id="">SELECT HOTEL</button></div></div>';
    

  

    infowindow = new google.maps.InfoWindow();
    /** 
	  b.addListener('click', function(c) {
      infowindow.setContent(c);
      infowindow.open(map, this);
      
   });*/
 
    
  google.maps.event.addListener(infowindow, 'domready', (function (){
      //showImageList();
    }))    

    google.maps.event.addListener(infowindow, 'domready', (function (){
      //pushImageList();
    }))    

    google.maps.event.addListener(infowindow, 'domready', (function (){
      //plotImage();
    }))

    
    google.maps.event.addListener(x, 'click', (function(x, content) {
      return function() { 
          infowindow.setContent(content);
          infowindow.open(map, x);
          
          
          
      }
    })(x, content));
   
	}
  
}
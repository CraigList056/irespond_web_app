// 
// MAP
//

// Initialize Map
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



function initMap() {
  
  
	var itb = {lat: 13.2409592, lng: 123.5368396};
  
    map = new google.maps.Map(document.getElementById('map'), {
          zoom: 14,
          center: itb,
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

  
  map.data.loadGeoJson('static/polygon/gadm41_PHL_2.json');
  map.data.setStyle({
    //fillColor: "green",
    strokeWeight: 0,
  });


  


  pushInitMarker(map);
  //
  //showInfoWindow(map);
  addMarker(map, coords);

  
  
  
  

/** 
  infowindow = new google.maps.InfoWindow();
        for (var j = 0; j < markers.length; j++) {
        markers.addListener('click', function() {
          infowindow.setContent(url);
          infowindow.open(map, this);
       });
      }

*/
  

  


  directionsService = new google.maps.DirectionsService,
  directionsDisplay = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true,

            
        })

  //const innerCoords = map.data.loadGeoJson('static/polygon-city-level.json');
  /**const outerCoords = map.data.loadGeoJson('static/gadm41_PHL_2.json');

  const polygonLigao = new google.maps.Polygon({
    paths: [outerCoords],
    strokeColor: 'red',
    strokeOpacity: 0.00001,
    strokeWeight: 0
  });

  polygonLigao.setMap(map);**/
/** 
  map.addListener('idle', function() {  
    document.getElementById('tilesloaded').innerHTML  = 'Tilesloaded';
    
    window.setTimeout(function () {
      
      document.getElementById('tilesloaded').innerHTML  = '';
      
    }, 2000);  
  });  

  
	map.addListener('click', function (event) {
    
		addMarker(event.latLng, map, coords)
	});

 
  map.addListener('mouseover', function() {
    selectDispatchers();
    window.alert("mouseover")
  });  

  google.maps.event.addListenerOnce(map, 'idle', function(){
    // do something only the first time the map is loaded
    selectDispatchers();
    window.alert("mouseover")
  });*/

  
}

function play() {
  var audio = new Audio('static/assets/audio/police-siren-one-loop-loop-able-104019.mp3');
  audio.play();
  //audio.loop = true;

  //var btnStop = document.getElementById("btnStop");

  //if (btnStop.clicked == true) {
   // audio.loop = false;
  //}
}



//
// MARKER & PATH
//

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
    var content = "<form action='/admin' method='post', enctype='multipart/form-data'><div style='float:left;'><img style='width:150px;height:auto;border:3px double white;' src='"+a.url+"'></div><div style='float:right; padding: 10px: '>Ref: <b>"+a.report_id+"</b><input style='width:100%', type='text', name ='report_id', id='report_id', value='"+a.report_id+"' hidden/><input name='saved_label_data' id='saved_label_data' value='"+a.saved_label+"' hidden/><br/><br/><i class='fas fa-map-marker-alt'></i> "+a.address+"<br/><i class='far fa-clock'></i> "+a.date_time+"<br/><br/>Classification: <mark style='background-color:#04aa6d;color:white;'>"+a.label+"</mark><br/>Probability: <mark style='background-color:#04aa6d;color:white;'>"+a.prob+"</mark><br/>Saved Class: "+a.saved_label+"<br/><br/>Dispatcher: <select id='dispatcherSelect' name='dispatcherSelect'></select><button>Dispatch</button></div></form><div> <br/> <br/> </div>" + form2
    //alert(JSON.stringify(c))
    //var content = '<div style="width:350px"><div style="width:130px;float:left"><img src="'+a.url+'"  width="130" /><h4>'+a.report_id+'</h4></div><div style="width:200px;float:left;padding-left:20px"><p style="font-size:150%;color:orange">200-500$/night</p><p style="font-size:80%">'+a.address+'</p><div class="star-rating-r"><a href="#"><img alt="" src="img/rating-b.png"></a><a href="#"><img alt="" src="img/rating-b.png"></a><a href="#"><img alt="" src="img/rating-b.png"></a><a href="#"><img alt="" src="img/rating-b.png"></a><a href="#"><img alt="" src="img/rating-a.png"></a></div><p><br/><div class="cat-icons"><span class="cat-icon-01 active"></span><span class="cat-icon-02"></span><span class="cat-icon-03"></span><span class="cat-icon-04"></span><span class="cat-icon-05"></span><span class="cat-icon-06"></span><div class="clear"></div></div></p><button class="srch-btn xbtn" style="margin-top:20px;float:right" id="">SELECT HOTEL</button></div></div>';
    

  

    infowindow = new google.maps.InfoWindow();
    /** 
	  b.addListener('click', function(c) {
      infowindow.setContent(c);
      infowindow.open(map, this);
      
   });*/
    google.maps.event.addListener(infowindow, 'domready', (function (){
      selectDispatchers();
      showBarangay();
    }))    

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
function selectDispatchers(){
   dispatcherSelect.empty();
    for (var j = 0; j < dispatchers.length; j++) {
      const a = dispatchers[j].replace(/&#39;/g, '').replace(/"/g, '').replace(/{name:/g, '').replace(/uid:/g, '').replace(/}/g, '').split(",");
      let optionList = document.getElementById('dispatcherSelect').options;
      optionList.add(new Option(a[0], a[1]))
      /** const a = dispatchers[j].split(",");
      var b = a[7].replace(/&#39;/g, '').split(":")
      var c = a[0].replace(/&#39;/g, '').replace(/"/g, '')
      //alert(b[1] +", "+c)

      $(dispatcherSelect).append($("<option></option>")
                      .attr("value", c)
                      .text(b[1]));*/
                     
    }
    
}


/** 
function showImageList(){
    //hideImageList();
    let y = document.getElementById('report_id').value;
    let z = document.getElementById('input_search');

    //document.getElementById('img-'+y).style = 'width:250px;height:auto;border:3px double white;display:block;'


    
    $("#image-list-container").find("img").each(function(){
      var $this = $(this),
          getID = $this.attr('id')
          
          if( getID = y) {
           // If image class has number equal or below 20 (eg. img-1, img-2....)
            
            // Update the image source accordengly
            document.getElementById('img-'+y).style = 'width:250px;height:auto;border:3px double white;display:block;'
          
          } 

      
    });
    //alert(y)
    //z.push(y)


}
function hideImageList(){

  $("#image-list-container").find("img").each(function(){
    var $this = $(this)
        $this.attr('style', 'width:250px;height:auto;border:3px double white;display:none;')
        
  });
  //alert(y)
  //z.push(y)


}

function pushImageList(image_list){
  
  imageList.push(image_list);
  //alert(imageList)

}

function plotImage(){
  //alert(image_list)

  const container = document.getElementById('image-list-container');
  for (var x = 0; x < imageList.length; x++){
    const a = imageList[x].replace(/"/g, '').split(",")
    var b = a[0];
    var c = a[1];
    
    const img = document.createElement('img');
    img.id = "img-"+b;
    img.src = c;
    img.style.cssText = 'width:250px;height:auto;border:3px double white;display:none;'
    container.appendChild(img);
    
      
  }
  imageList = [];
}*/

//Remove all marker
function removeMarkers() {
	for (var i = 0; i < markers.length; i++) {
	  markers[i]['marker'].setMap(null);
	}
	markers = [];
	index = 0;
}

//Add path
function addPath(marker) {
  var curr_marker = new google.maps.Marker({
    position: {lat: 13.2366582, lng: 123.5321828},
    map: map,
    label: '0',
    data: {
			position: {lat: 13.2366582, lng: 123.5321828},
			label: '0'
    }
  });  
  //alert("hi" + JSON.stringify(initMarker))
	/*if (curr_marker == null) {
		curr_marker = marker;
		toggleBounce(marker);
	}
	else if (curr_marker == marker) {
		curr_marker = null;
		disableAnimation();
	}
	else { 
		disableAnimation();*/

		if (!checkPath(curr_marker, marker)) {
			var path = new google.maps.Polyline({
	          path: [curr_marker['position'], marker['position']],
	          //strokeColor: '#FF0000',
	          strokeOpacity: 0
	          //strokeWeight: 2
	        });
	        path.setMap(map);

	        paths.push({
	        	path: path,
	        	data: {
	        		first: curr_marker['label'],
	        		second: marker['label']
	        	}
	        });

	        //Update path list
	        updatePathList();
	    }
	    else {
	    	alert("Path already selected!");
	    }

        //curr_marker = null;
	//}
}

//Check if path exist
function checkPath(first, second) {
	for (var i = 0; i < paths.length; i++) {
		if (((paths[i]['data']['first'] == first['label'] && paths[i]['data']['second'] == second['label'])) ||
			((paths[i]['data']['first'] == second['label'] && paths[i]['data']['second'] == first['label']))) {
				return true;
		}
	}
	return false;
}

//Remove all paths
function removePaths() {
	for (var i = 0; i < paths.length; i++) {
		paths[i]['path'].setMap(null);
	}
  paths = [];
  curr_marker = null;
}

function addSpecialPath(first, second) {
  var path = new google.maps.Polyline({
            path: [markers[first]['data']['position'], markers[second]['data']['position']],
            strokeColor: '#2196F3',
            strokeOpacity: 1.0,
            strokeWeight: 4
          });
          path.setMap(map);

  specialPaths.push({
    path: path
  });
}

function removeSpecialPaths() {
  for (var i = 0; i < specialPaths.length; i++) {
    specialPaths[i]['path'].setMap(null);
  }
  specialPaths = [];
}

//
// LISTENER
//

//Reset all
$('#resetButton').on('click', function() {
  removeMarkers();
  removePaths();
  removeSpecialPaths();
  removeMarkerList();
  removePathList();
  removeSelect();
  pushInitMarker();
  updateRoadRoute();
  //clearRoutes();
});

// Submit data
$('#submitButton').on('click', function() {
 

  if (document.getElementById('cb1').checked) {
    // cb1 is checked
    removeSpecialPaths();
    fitBounds();
    displayRoadRoute();
    

} else if (document.getElementById('cb2').checked) {
    // cb2 is checked
    removeSpecialPaths();
    updateRoadRoute();
    fitBounds();
    createMatrix();
    createJSON();
    

    $.ajax ({
      url: '/submit',
      data: createJSON(),
      type: 'POST',
      success: function(response) {
        displayOnMap(response);
        displayResult(response);
      },
      error: function(error) {
        alert("Error "+error);
      }
    });

}





});

//
// INCOMING HANDLER
//
function displayOnMap(result) {
  for (var i = 1; i < result.length; i++) {
    var path = paths.find(function(x) {
      
      return (x['data']['first'] == result[i] && x['data']['second'] == result[i-1]) || 
      (x['data']['first'] == result[i-1] && x['data']['second'] == result[i])
    });
    
    if (path != null) {
      addSpecialPath(result[i], result[i-1]);
    }
  }
}

function displayResult(result) {

  var text = "Shortest Path: ";
  var total_distance = 0.0;
  for (var i = 0; i < result.length; i++) {
    if (i != 0) {
      text = text.concat("- ");
      total_distance += distanceMatrix[result[i-1]][result[i]];
      total_distance_km = total_distance / 1000;
      time = total_distance / 72.2222222;
      d = Number(time);
      var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600 % 60);

      var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";

      travel_time = hDisplay + mDisplay + sDisplay
    }
    text = text.concat(result[i]+" ");
  }
  text = text.concat("| Distance: "+total_distance_km.toFixed(2).toString()+" km | "+travel_time);

  $('.toastBox').text(text).fadeIn(400);
  
}

$('.toastBox').on('click', function() {
  $('.toastBox').fadeOut(400);
});

//
// DISTANCE AND POST
//

//Calculate distance
function getDistance(latLng_1, latLng_2) {
  return google.maps.geometry.spherical.computeDistanceBetween(latLng_1,latLng_2);
}

//Create matrix for transport
function createMatrix() {
  distanceMatrix = [];
  adjacencyMatrix = [];
  //Distance Matrix and initialize Adjacency Matrix
  for (var i = 0; i < markers.length; i++) {
    var row = [];
    var row_init = [];
    for (var j = 0; j < markers.length; j++) {
      row.push(getDistance(markers[i]['data']['position'], markers[j]['data']['position']));
      row_init.push(0);
    }
    distanceMatrix.push(row);
    adjacencyMatrix.push(row_init);
  }

  //Adjacency matrix
  for (var i = 0; i < paths.length; i++) {
    adjacencyMatrix[parseInt(paths[i]['data']['first'])][parseInt(paths[i]['data']['second'])] = 1;
    adjacencyMatrix[parseInt(paths[i]['data']['second'])][parseInt(paths[i]['data']['first'])] = 1;
  }
}

function createJSON() {
  return JSON.stringify ({
    adjacency: adjacencyMatrix,
    distance: distanceMatrix,
    start: $(startSelect).val(),
    end: $(endSelect).val()
  });
}

//
// MISC
//

//Animation
function toggleBounce(marker) {
	marker.setAnimation(google.maps.Animation.BOUNCE);
}

function disableAnimation() {
	for (var i = 0; i < markers.length; i++) {
		markers[i]['marker'].setAnimation(null);
	}
}

//Select start and end points
function updateSelect() {
	startSelect.empty();
	endSelect.empty();
  
  $(startSelect).append($("<option></option>")
  .attr("value", '0')
  .text('0'));
	for (var i = 0; i < markers.length; i++) {
  
		$(endSelect).append($("<option></option>")
                    .attr("value", markers[i]['data']['label'])
                    .text("0 <--> " + markers[i]['data']['label'].toString()));
	}
}

function removeSelect() {
  startSelect.empty();
  endSelect.empty();
}

//Print path & marker (update & remove)
function updateMarkerList() {
	markerList.empty();

	for(var i = 0; i < markers.length; i++) {
		$( "<option>"+markers[i]['data']['label']+": ("+markers[i]['marker'].getPosition().lat().toFixed(5)+", "
			+markers[i]['marker'].getPosition().lng().toFixed(5)+")"+"</option>" ).appendTo(markerList);

	}
}

function removeMarkerList() {
  markerList.empty();
}

function updatePathList() {
	pathList.empty();
	for(var i = 0; i < paths.length; i++) {
		$( "<li>"+paths[i]['data']['first']+" <--> "+paths[i]['data']['second']+"</li>" ).appendTo(pathList);
	}
}

function removePathList() {
  pathList.empty();
}

//Zoom map based on the markers
function fitBounds(){
  var bounds = new google.maps.LatLngBounds();
  if (markers.length>0) { 
      for (var i = 0; i < markers.length; i++) {
         bounds.extend(markers[i]['marker'].getPosition());
        }    
        map.fitBounds(bounds);
    }
}

//Drive Route
function displayRoadRoute(){
  startPoint = markers[$(startSelect).val()]['marker'].getPosition();
  endPoint = markers[$(endSelect).val()]['marker'].getPosition();

  //alert(markers[$(endSelect).val()]['marker'].getPosition())
  


  
    directionsService.route({
        origin: startPoint,
        destination: endPoint,
        avoidTolls: true,
        avoidHighways: false,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        unitSystem: google.maps.UnitSystem.metric
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {

          var routes = response.routes;
          var colors = ['red', 'green', 'blue', 'orange', 'yellow', 'black'];
          var directionsDisplays = [];

      // Reset the start and end variables to the actual coordinates
      start = response.routes[0].legs[0].start_location;
      end = response.routes[0].legs[0].end_location;

			// Loop through each route
      for (var i = 0; i < routes.length; i++) {

        var directionsDisplay = new google.maps.DirectionsRenderer({
          map: map,
          directions: response,
          routeIndex: i,
          suppressMarkers: true,
          draggable: false,
          polylineOptions: {

            strokeColor: colors[i],
            strokeWeight: 4,
            strokeOpacity: .3
          }
        });

        // Push the current renderer to an array
        directionsDisplays.push(directionsDisplay);
       

        
        $('#submitButton').on('click', function() {
          for (var j = 0; j < directionsDisplays.length; j++) {

            directionsDisplays[j].setMap(null);
          }
        });



          } // End route loop
        }
      });
          /**
            directionsDisplay.setDirections(response)
            
            var summaryPanel = document.getElementById('directions-panel');
            summaryPanel.innerHTML = '';
            
            
             
            const legCoordinates = [];

            response.routes.forEach(route => {
              route.legs.forEach(leg => {
                const {start_location, end_location} = leg;

                legCoordinates.push({ start_location, end_location });
              });
            });
            alert("hi" + JSON.stringify(legCoordinates));            
           
            
            for (var x = 0; x < response.routes.length; x++) {
              
              directionsDisplay.setOptions({
                map: map,
                directions: response,
                routeIndex: x
              });
              
              summaryPanel.innerHTML += '<hr><br><b> Route ' + (x + 1) + ':<br>';
              var route = response.routes[x];
              for (var y = 0; y < route.legs.length; y++) {
                var routeSegment = y + 1;
      
                summaryPanel.innerHTML += route.legs[y].start_address + ' to ';
                summaryPanel.innerHTML += route.legs[y].end_address + '<br>';
                summaryPanel.innerHTML += route.legs[y].distance.text + '<br><br>';
      
                var steps = route.legs[y].steps;
                for (var z = 0; z < steps.length; z++) {
                  var nextSegment = steps[z].path;
                  summaryPanel.innerHTML += "<li>" + steps[z].instructions;
      
                  var dist_dur = "";
                  if (steps[z].distance && steps[z].distance.text) dist_dur += steps[z].distance.text;
                  if (steps[z].duration && steps[z].duration.text) dist_dur += "&nbsp;" + steps[z].duration.text;
                  if (dist_dur != "") {
                    summaryPanel.innerHTML += "(" + dist_dur + ")<br /></li>";
                  } else {
                    summaryPanel.innerHTML += "</li>";
                  }
      
                }
      
                summaryPanel.innerHTML += "<br>";
              }
            }
             
            var distance = 0;
            var duration = 0;
            var routes = response.routes[0];

            for (i = 0; i < routes.legs.length; i++) {
              distance += routes.legs[i].distance.value;
              duration += routes.legs[i].duration.value;
            } 
            d = Number(duration);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);

            var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
            var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
            var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";

            travel_time = hDisplay + mDisplay + sDisplay

            var text = "Shortest Path: " + $(startSelect).val() + " - " + $(endSelect).val() + " | Distance: " + (distance / 1000).toFixed(2) + " km | ETA: " + travel_time;

            $('.toastBox').text(text).fadeIn(400);
           

            
            
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });*/




}//calculateAndDisplayRoute(directionsService, directionsDisplay, startPoint, endPoint);




function updateRoadRoute(){
  for (var i = 0; i < markers.length; i++ ) {
    directionsDisplay.set('directions', null);
    
  }
}


/*
function myFunc(data) {
  var table = document.createElement("table");
  row = table.insertRow(-1);
  var cell = row.insertCell(-1);
  cell.innerHTML = 'Item';
  for (var i = 0; i < data.length; i++)
  {
      
      var cell = row.insertCell(-1);
      cell.innerHTML = data[i];
  }
  var dvTable = document.getElementById("dvTable");
      dvTable.innerHTML = "";
      dvTable.appendChild(table);
}*/

  
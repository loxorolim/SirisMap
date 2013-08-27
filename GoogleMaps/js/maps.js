/// <reference path="/js/jquery-1.10.2.min.js" />

var elevator;
var map;
var allMarkers = [];
var routers = [];
var infowindow = new google.maps.InfoWindow();
var opMode = "Insertion";
var markerPair = [];
var markerConnections = [];
var ID = 0;
var lines = [];
var request;
var markerCluster;
function initialize() {

    var mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(-28.643387, 153.612224),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER
        }

    }

    var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
    // Create an ElevationService
    elevator = new google.maps.ElevationService();

    markerCluster = new MarkerClusterer(map);
    markerCluster.setGridSize(25);
    loadNodesFromXml();





    
    google.maps.event.addListener(map, 'click',
          function (event) {
              placeMarker(event);
          }
      );





    
    $("#btnInsertion").click(function () {

        opMode = "Insertion";
		$("#btnInsertion").attr("class","orange");
		$("#btnRemoval").attr("class","gray");
		$("#btnConnection").attr("class","gray");
		$("#btnDisplayXML").attr("class","gray");		
		if(markerPair.length > 0)
			toggleBounce(markerPair[0]);
		markerPair = [];
		infowindow.setMap(null);
    });

    $("#btnRemoval").click(function () {

        opMode = "Removal";
		$("#btnInsertion").attr("class","gray");
		$("#btnRemoval").attr("class","orange");
		$("#btnConnection").attr("class","gray");
		$("#btnDisplayXML").attr("class","gray");	
		if(markerPair.length > 0)
			toggleBounce(markerPair[0]);
		markerPair = [];
		infowindow.setMap(null);
    });
	$("#btnConnection").click(function () {

        opMode = "Connection";
		$("#btnInsertion").attr("class","gray");
		$("#btnRemoval").attr("class","gray");
		$("#btnConnection").attr("class","orange");
		$("#btnDisplayXML").attr("class","gray");	
		if(markerPair.length > 0)
			toggleBounce(markerPair[0]);
		markerPair = [];
		infowindow.setMap(null);

    });
    $("#btnDisplayXML").click(function () {
		opMode = "DisplayXML";
        	showNodesXml();
		$("#btnInsertion").attr("class","gray");
		$("#btnRemoval").attr("class","gray");
		$("#btnConnection").attr("class","gray");
		$("#btnDisplayXML").attr("class","orange");	
		if(markerPair.length > 0)
			toggleBounce(markerPair[0]);
		markerPair = [];
		infowindow.setMap(null);
    });
$("#btnUploadXML").click(function () {
		$("#upFile").trigger('click');
    });
$("#btnUploadXML").mouseover(function () {
		$("#btnUploadXML").attr("class","orange");
});
$("#btnUploadXML").mouseout(function () {
		$("#btnUploadXML").attr("class","gray");
});




    function loadNodesFromXml()
{
$(document).ready(function() {
        $.ajax({
            type: "GET",
            url: "test.xml",
            dataType: "xml",
            success: function(xml) {
                $(xml).find('marker').each(function() {
                    var latitude = $(this).find('Latitude').text();
                    var longitude = $(this).find('Longitude').text();
                    loadMarker(latitude,longitude);      
                });
            }
        });
    });
}	
    function showNodesXml()
    {
        var nodesXml = "&lt?xml version=\"1.0\" encoding=\"utf-8\"?&gt" +"<br>&ltmarkers&gt";
	for(i = 0;i< allMarkers.length ;i++)
       	{
		nodesXml+="<br>&nbsp&ltmarker&gt" 
		+ "<br>&nbsp&nbsp&ltLatitude&gt"+allMarkers[i].position.lat()+"&lt\/Latitude&gt"
		+ "<br>&nbsp&nbsp&ltLongitude&gt"+allMarkers[i].position.lng()+"&lt\/Longitude&gt"
		+ "<br>&nbsp&lt\/marker&gt";

	}
	nodesXml += "<br>&lt\/markers&gt";
	$("#topRight").html(nodesXml);
	  
    }

    function getElevation(event) {

        var locations = [];

        // Retrieve the clicked location and push it on the array
        var clickedLocation = event.latLng;
        locations.push(clickedLocation);

        // Create a LocationElevationRequest object using the array's one value
        var positionalRequest = {
            'locations': locations
        }

        // Initiate the location request


    }
    function placeMarker(locationEvent) {

        if (opMode == "Insertion") {

            var marker = new google.maps.Marker({
                position: locationEvent.latLng,
                map: map,
                draggable: true,
		neighbours: [],
		ID: ID,
		teleTech: "Rede Teste",
		reach: 30
            });
			ID++;

	    
            var locations = [];
            var clickedLocation = locationEvent.latLng;
            locations.push(clickedLocation);

            // Create a LocationElevationRequest object using the array's one value
            var positionalRequest = {
                'locations': locations
            }

            elevator.getElevationForLocations(positionalRequest, function (results, status) {

                if (status == google.maps.ElevationStatus.OK) {
		    connectNodesByDistance(marker);
                    // Retrieve the first result
                    if (results[0]) {

                        // Open an info window indicating the elevation at the clicked position
                        marker.elevation = results[0].elevation;

                        prepareMarkerEvents(marker)

                    } else {
                        return -1;
                    }
                } else {
                    return -1;
                }
            });




        }
    }

    function loadMarker(latitude,longitude) {

        var latLng = new google.maps.LatLng(latitude, longitude);
        if (opMode == "Insertion") {
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                draggable: true,
icon: 'redSquare.png',

				neighbours: [],
				ID: ID
            });
			ID++;

            var locations = [];
            var markerLocation = latLng;
            locations.push(markerLocation);
            // Create a LocationElevationRequest object using the array's one value
            var positionalRequest = {
                'locations': locations
            }

            elevator.getElevationForLocations(positionalRequest, function (results, status) {

                if (status == google.maps.ElevationStatus.OK) {

                    // Retrieve the first result
                    if (results[0]) {

                        // Open an info window indicating the elevation at the clicked position
                        marker.elevation = results[0].elevation;
			allMarkers.push(marker);
                        prepareMarkerEvents(marker);

                    } else {
                        return -1;
                    }
                } else {
                    return -1;
                }
            });
        }
    }
    function connectNodesByDistance(marker)
{
	for(var i = 0; i< allMarkers.length ; i++)
	{

		var dis = distance(marker.position.lat(),marker.position.lng(),allMarkers[i].position.lat(),allMarkers[i].position.lng(),"K");
		dis = dis*1000;
		if(dis <= marker.reach)
		{			
			selectRouterToDraw(marker),
			selectRouterToDraw(allMarkers[i]);
		}
	}
	
}
function distance(lat1, lon1, lat2, lon2, unit) {
	    var radlat1 = Math.PI * lat1/180
	    var radlat2 = Math.PI * lat2/180
	    var radlon1 = Math.PI * lon1/180
	    var radlon2 = Math.PI * lon2/180
	    var theta = lon1-lon2
	    var radtheta = Math.PI * theta/180
	    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	    dist = Math.acos(dist)
	    dist = dist * 180/Math.PI
	    dist = dist * 60 * 1.1515
	    if (unit=="K") { dist = dist * 1.609344 }
	    if (unit=="N") { dist = dist * 0.8684 }
	    return dist
	}

    function prepareMarkerEvents(marker)
{
                        
			markerCluster.addMarker(marker);
                        google.maps.event.addListener(marker, 'click', function (event) {
                            removeMarker(marker);
                        });
                        google.maps.event.addListener(marker, 'click', function (event) {
                           	 displayInfoWindow(marker);
                        });
			google.maps.event.addListener(marker, 'click', function (event) {
				if(opMode == "Connection")
				{
		                    selectRouterToDraw(marker);
				}
                        });
                        google.maps.event.addListener(marker, 'drag', function (event) {
			    infowindow.setMap(null);
                            reconnectMovedMarker(marker,event.latLng)
							
                        });
 			google.maps.event.addListener(marker, 'dragend', function (event) {
                            reconnectMovedMarker(marker,event.latLng)
		            marker.setPosition(event.latLng);
var locations = [];
            var markerLocation = marker.getPosition();
            locations.push(markerLocation);
            // Create a LocationElevationRequest object using the array's one value
            var positionalRequest = {
                'locations': locations
            }

            elevator.getElevationForLocations(positionalRequest, function (results, status) {

                if (status == google.maps.ElevationStatus.OK) {

                    // Retrieve the first result
                    if (results[0]) {
			marker.elevation = results[0].elevation;
 } else {
                        return -1;
                    }
                } else {
                    return -1;
                }
            });
							
                        });
}
	function selectRouterToDraw(marker){
	
		
			if(markerPair.length == 0)
			{
				markerPair.push(marker);
				toggleBounce(markerPair[0]);
			}
			else if(markerPair.length == 1 && checkIfConnectionIsPossible(markerPair[0], marker))
			{
				markerPair.push(marker);
				markerPair[0].neighbours.push(markerPair[1]);
				markerPair[1].neighbours.push(markerPair[0]);	
				markerConnections.push(markerPair);			
				connectRouters();
				toggleBounce(markerPair[0]);
				markerPair = [];
			}
			else
			{
				toggleBounce(markerPair[0]);
				markerPair = [];
			}
				
					
		
	}
	function checkIfConnectionIsPossible(marker1, marker2)
	{
		if(marker1.ID == marker2.ID)
			return false
		else
		{
			for(i = 0; i< markerConnections.length; i++)
			{
				if((markerConnections[i][0].ID == marker1.ID && markerConnections[i][1].ID == marker2.ID) || (markerConnections[i][1].ID == marker1.ID && markerConnections[i][0].ID == marker2.ID))
					return false
			}
		}
		return true;
	}
	function connectRouters(){
		for (i=0; i<lines.length; i++) 
		{                           
			lines[i].setVisible(false);
		}
		for(var i = 0; i < markerConnections.length ; i++){
			var markerPositions = [markerConnections[i][0].getPosition(),markerConnections[i][1].getPosition()];
			var routerPath = new google.maps.Polyline({
			path: markerPositions,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
			});
			lines.push(routerPath);
			//routerPath.setMap(map);
		}
		for (i=0; i<lines.length; i++) 
		{                           
			lines[i].setMap(map); //or line[i].setVisible(false);
		}
		
	}
	function reconnectMovedMarker(marker,newPosition){
		for(var i = 0; i< markerConnections.length ; i++){
			for(var j = 0; j < 2; j++){
				if(markerConnections[i][j].ID == marker.ID)
				{
					markerConnections[i][j].setPosition(newPosition);
				}
			}
		}
		connectRouters();
		
	}
    function refreshLocation(marker, location) {
        mar.setPosition()
    }
    function removeMarker(marker) {
        if (opMode == "Removal") {
	    infowindow.setMap(null);
            for (var i = 0; i < allMarkers.length; i++) {
                if (allMarkers[i].ID == marker.ID) {
                    markerCluster.removeMarker(allMarkers[i]);
		    allMarkers[i].setMap(null);
                    allMarkers.splice(i, 1);
		    
                }
            }
			for(var i = 0; i< markerConnections.length ; i++){
					if(markerConnections[i][0].ID == marker.ID || markerConnections[i][1].ID == marker.ID)
					{
						markerConnections.splice(i,1);
						i--;
					}
				
			}
			connectRouters();
        }
	

    }
	function toggleBounce(marker) {

	  if (marker.getAnimation() != null) {
		marker.setAnimation(null);
	  } else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	  }
	}
    function displayInfoWindow(marker) {
		if(opMode == "Insertion")
{
			var neighboursIDs = "";
			for(var i = 0; i < marker.neighbours.length ;i++)
			{
				neighboursIDs += marker.neighbours[i].ID + ", ";
			}
			infowindow.setContent('ID: ' + marker.ID + '<br>Latitude: ' + 
			marker.position.lat() + '<br>Longitude: ' + marker.position.lng() 
			+ '<br>Elevation: ' + marker.elevation + '<br>Neighbours IDs: ' +neighboursIDs)
			infowindow.open(map, marker);
}
		
    }
	
   


    //drawingManager.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);


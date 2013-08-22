/// <reference path="/js/jquery-1.10.2.min.js" />

var elevator;
var map;
var allMarkers = [];
var infowindow = new google.maps.InfoWindow();
var denali = new google.maps.LatLng(63.3333333, -150.5);
var chicago = new google.maps.LatLng(41.850033, -87.6500523);
var opMode = "Insertion";
var markerPair = [];
var markerConnections = [];
var ID = 0;
var lines = [];
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
    // Add a listener for the click event and call getElevation on that location
    google.maps.event.addListener(map, 'click', getElevation);
    google.maps.event.addListener(map, 'click',
          function (event) {
              placeMarker(event);
          }
      );
    //  google.maps.event.addListener(marker, 'click',function(event) {
    //			displayInfoWindow(marker,event.latLng);
    //		}
    //	);

    // Chama o botãozinho inserir  
    var ControlDiv = document.getElementById("controls");
    //var InsertionControl = new InsertionControl(InsertionControlDiv, map);
    ControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(ControlDiv);


    
    $("#btnInsertion").click(function () {

        opMode = "Insertion";
		$("#btnInsertion").attr("class","orange");
		$("#btnRemoval").attr("class","gray");
		$("#btnConnection").attr("class","gray");	
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
		if(markerPair.length > 0)
			toggleBounce(markerPair[0]);
		markerPair = [];
		infowindow.setMap(null);

    });




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
				ID: ID
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

                    // Retrieve the first result
                    if (results[0]) {

                        // Open an info window indicating the elevation at the clicked position
                        marker.elevation = results[0].elevation;

                        allMarkers.push(marker);
                        google.maps.event.addListener(marker, 'click', function (event) {
                            removeMarker(marker);
                        });
                        google.maps.event.addListener(marker, 'click', function (event) {
                            displayInfoWindow(marker);
                        });
						google.maps.event.addListener(marker, 'click', function (event) {
                            selectRouterToDraw(marker);
                        });
                        google.maps.event.addListener(marker, 'drag', function (event) {
                            reconnectMovedMarker(marker,event.latLng)
							marker.setPosition(event.latLng);
                            displayInfoWindow(marker, event.latLng);
							
                        });

                    } else {
                        return -1;
                    }
                } else {
                    return -1;
                }
            });




        }
    }
	function selectRouterToDraw(marker){
		if(opMode == "Connection")
		{		
		
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
            for (var i = 0; i < allMarkers.length; i++) {
                if (allMarkers[i].ID == marker.ID) {
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


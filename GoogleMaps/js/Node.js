function placeMeter(latitude, longitude)
{
    var latLng = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker(
	{
	    type: "Meter",
	    position: latLng,
	    map: map,
	    draggable: true,
	    offIcon: meterOffIconImage,
	    icon: meterOffIconImage,
	    neighbours: [],
	    ID: ID,
	    X: 0,
        Y: 0,
	    connected: false,
	    
	    meshHop: 0
	});
    ID++;
    var locations = [];
   // var markerLocation = latLng;
    locations.push(latLng);
    // Create a LocationElevationRequest object using the array's one value
    var positionalRequest =
	{
	    'locations': locations
	}
    elevator.getElevationForLocations(positionalRequest, function (results, status)
    {
        if (status == google.maps.ElevationStatus.OK)
        {
            // Retrieve the first result
            

            if (results[0])
            {
                // Open an info window indicating the elevation at the clicked position
                marker.elevation = results[0].elevation;
                allMarkers.push(marker);
                disconnectedMeters.push(marker);
                connectNodesByDistance(marker);
                meters.push(marker);
                prepareMarkerEvents(marker);
                if (meshEnabled)
                    executeRFMesh();

            }
            else 
                return -1;           
        }
        else 
            return -1;
        
    });
}
function placeDAP(latitude, longitude, technology)
{
   
    var latLng = new google.maps.LatLng(latitude, longitude);
    var marker = new MarkerWithLabel(
	{
	    type: "DAP",
	    position: latLng,
	    map: map,
	    draggable: true,
	    ID: ID,
	    offIcon: dapOffIconImage,
	    onIcon: dapOnIconImage,
	    icon: dapOnIconImage,
	    teleTech: technology,
	    reachCircles: [],
	    neighbours: [],
	    efficiency: 0,
	    connected: false,
	    labelContent: "0",
	    labelAnchor: new google.maps.Point(22,25),
	    labelClass: "labels", // the CSS class for the label
	    labelStyle: { opacity: 0.75 }
	});
    ID++;
    var locations = [];
    var markerLocation = latLng;
    locations.push(markerLocation);
    // Create a LocationElevationRequest object using the array's one value
    var positionalRequest =
	{
	    'locations': locations
	}
    elevator.getElevationForLocations(positionalRequest, function (results, status) {
        if (status == google.maps.ElevationStatus.OK)
        {
            connectNodesByDistance(marker);
            // Retrieve the first result
            if (results[0]) {
                // Open an info window indicating the elevation at the clicked position

                calculateEfficiency(marker);
                drawCircle(marker);
                marker.elevation = results[0].elevation;
                allMarkers.push(marker);
                daps.push(marker);
                prepareMarkerEvents(marker);
                if (meshEnabled)
                    executeRFMesh();
            }
            else
            {
                return -1;
            }
        }
        else
        {
            return -1;
        }
    });
}
function prepareMarkerEvents(marker)
{
    if(enableMarkerClusterer)
        markerCluster.addMarker(marker);
    markerCluster.redraw();
    google.maps.event.addListener(marker, 'click', function (event)
    {
        if (opMode == "Removal")
        {
            removeMarker(marker);
            if (meshEnabled) 
                executeRFMesh()           
        }
        else
            displayInfoWindow(marker);

    });
    google.maps.event.addListener(marker, 'dragstart', function (event)
    {
        infowindow.setMap(null);
        removeMesh();
    });
    google.maps.event.addListener(marker, 'drag', function (event)
    {

        //reconnectMovedMarker(marker, event.latLng)
        removeMarkerConnections(marker);
        connectNodesByDistance(marker);
        if (marker.type == "DAP")
        {
            calculateEfficiency(marker);
            removeMarkerCircles(marker);
        }
           
        


    });
   
    google.maps.event.addListener(marker, 'dragend', function (event)
    {

        // reconnectMovedMarker(marker,event.latLng)
        if (meshEnabled)
            connectViaMesh();
        if (marker.type != "Meter")
            drawCircle(marker);
        marker.setPosition(event.latLng);
        var locations = [];
        var markerLocation = marker.getPosition();
        locations.push(markerLocation);
        // Create a LocationElevationRequest object using the array's one value
        var positionalRequest =
		{
		    'locations': locations
		}
        elevator.getElevationForLocations(positionalRequest, function (results, status)
        {
            if (status == google.maps.ElevationStatus.OK)
            {
                // Retrieve the first result
                if (results[0])
                {
                    marker.elevation = results[0].elevation;
                }
                else
                {
                    return -1;
                }
            }
            else
            {
                return -1;
            }
        });
    });
}
function getElevation(event)
{
    var locations = [];
    // Retrieve the clicked location and push it on the array
    var clickedLocation = event.latLng;
    locations.push(clickedLocation);
    // Create a LocationElevationRequest object using the array's one value
    var positionalRequest =
	{
	    'locations': locations
	}
    // Initiate the location request
}
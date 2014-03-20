

function initialize() {
    var MY_MAPTYPE_ID = 'custom_style';
    var mapOptions =
	{
	    zoom: 3,
	    minZoom: 3,
        maxZoom: 18,
	    center: new google.maps.LatLng(-28.643387, 0.612224),
	    // mapTypeId: google.maps.MapTypeId.ROADMAP,
	  
	    mapTypeControl: true,
	    panControl: false,
	    zoomControl: true,    
	    //mapTypeControlOptions: {
	    //    mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
	    //},
	    //mapTypeId: MY_MAPTYPE_ID,
	    
	    zoomControlOptions:
		{
		    position: google.maps.ControlPosition.TOP_RIGHT

		},
	    //mapTypeControlOptions:
		//{
		//    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
		//    position: google.maps.ControlPosition.TOP_RIGHT

		//},

	}

    //var featureOpts = [
    //{
    //    stylers: [
    //   { "lightness": -70 },
    //   { "saturation": -67 }
    //    ]
    //},
    
    //];
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
   
    //var styledMapOptions = {
    //    name: 'Custom Style'
    //};

    //var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

    //map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
    
    // Create an ElevationService
    elevator = new google.maps.ElevationService();
    if (enableMarkerClusterer) {
        markerCluster = new MarkerClusterer(map);
        markerCluster.setGridSize(10);
    }
    

    loadCarDriveFromXml();
    loadNodesFromXml();
    
    drawHeatMap();
    insertListener = google.maps.event.addListener(map, 'click', function (event) {
        //if (opMode == "Insertion") {
        //    placeDAP(event.latLng.lat(), event.latLng.lng(), currentTech);

        //}
    });
    
    setButtons();
    createTableFromOptions();
}
google.maps.event.addDomListener(window, 'load', initialize);

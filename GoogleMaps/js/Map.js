

function initialize() {
    var mapOptions =
	{
	    zoom: 3,
	    minZoom: 2,
	    center: new google.maps.LatLng(-28.643387, 0.612224),
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    mapTypeControl: true,
	    panControl: false,
	    zoomControl: true,
	    zoomControlOptions:
		{
		    position: google.maps.ControlPosition.TOP_RIGHT

		},
	    mapTypeControlOptions:
		{
		    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
		    position: google.maps.ControlPosition.TOP_RIGHT

		}
	}
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    // Create an ElevationService
    elevator = new google.maps.ElevationService();
    markerCluster = new MarkerClusterer(map);
    markerCluster.setGridSize(10);
    loadNodesFromXml();

    insertListener = google.maps.event.addListener(map, 'click', function (event) {
        //if (opMode == "Insertion") {
        //    placeDAP(event.latLng.lat(), event.latLng.lng(), currentTech);

        //}
    });
    
   // $(document).mousemove(function (e) {
   //     $("#image").css({ left: e.pageX-10, top: e.pageY-10 });
   // });
    
    //google.maps.event.addListener(map, 'mousemove', function (event) {
        
    //    if (opMode == "Insertion")
    //    {
    //        mouseInsertionIcon.setMap(null);
       
    //    var latLng = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
        
    //    var marker = new google.maps.Marker(
    //    {
    //        position: latLng,
    //        map: map,
    //        icon: meterOffIconImage,
    //        clickable: false,
    //        anchor: new google.maps.Point(9.5, 9.5)


    //    });
        
    //    if (currentIns == "DAP")
    //        marker.setIcon(dapOnIconImage);
    //    else if (currentIns == "Meter")
    //        marker.setIcon(meterOffIconImage);
    //    else
    //        marker.setIcon(null);

    //    mouseInsertionIcon = marker;
    //    }



    //});

    setButtons();
    //table = loadTable();
    //getValuesFromTable("ZigBee","Metropolitan","dbm0",15);
    createTableFromOptions();
    //alert(shadowingPropagation(70));
}
google.maps.event.addDomListener(window, 'load', initialize);

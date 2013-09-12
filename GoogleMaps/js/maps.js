/// <reference path="/js/jquery-1.10.2.min.js" />
var elevator;
var map;
var allMarkers = [];
var meters = [];
var daps = [];
var routers = [];
var infowindow = new google.maps.InfoWindow();
var opMode = "Insertion";
var radioMode = "Line";
var markerPair = [];
var markerConnections = [];
var ID = 0;
var lines = [];
var circles = [];
var request;
var markerCluster;

function initialize()
{
	var mapOptions =
	{
		zoom : 3,
		minZoom : 2,
		center : new google.maps.LatLng(-28.643387, 153.612224),
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		mapTypeControl : true,
		mapTypeControlOptions :
		{
			style : google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position : google.maps.ControlPosition.BOTTOM_CENTER
		}
	}
	var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
	// Create an ElevationService
	elevator = new google.maps.ElevationService();
	markerCluster = new MarkerClusterer(map);
	markerCluster.setGridSize(10);
	loadNodesFromXml();
	
	var insertListener = google.maps.event.addListener(map, 'click', function(event)
	{
		if(opMode == "Insertion")
			placeDAP(event.latLng.lat(),event.latLng.lng(),"TecTeste",50);
	});
	
	
	
	
		var radioSize = 155;
		$("#Insertion").click(function() {
			opMode = "Insertion";		
			infowindow.setMap(null);
		});
		$("#Removal").click(function() {
			opMode = "Removal";
			infowindow.setMap(null);
		});
		$("#DisplayXML").click(function() {
			opMode = "DisplayXML";
			showNodesXml();
			infowindow.setMap(null);
		});
	   $('#insertionBackground').buttonset().find('label').width(radioSize);
	   $( "#radio" ).buttonset().find('label').width(radioSize);
	   $( "#radioBackground" ).buttonset().find('label').width(radioSize);
	   $( "#accordion" ).accordion({
		
			heightStyle: "content",
			icons: false
    });
	
		$("#dapRadio").click(function() {
			insertListener.remove();
			insertListener = google.maps.event.addListener(map, 'click', function(event)
			{
				if(opMode == "Insertion")
					placeDAP(event.latLng.lat(),event.latLng.lng(),"TecTeste",50);
			});
		});
		$("#meterRadio").click(function() {
			insertListener.remove();
			google.maps.event.removeListener(insertListener);
			insertListener = google.maps.event.addListener(map, 'click', function(event)
			{
				if(opMode == "Insertion")
					placeMeter(event.latLng.lat(),event.latLng.lng());
			});
		});

	
	$("#lineRadio").click(function()
	{
		radioMode = "Line";
		setLinesVisible();
		setCirclesInvisible();
	});
	$("#radiusRadio").click(function()
	{
		radioMode = "Radius";
		setLinesInvisible();
		setCirclesVisible();
	});
	



	
	

	
	function setLinesInvisible()
	{
		for ( i = 0; i < lines.length; i++)
		{
			lines[i].setVisible(false);
		}
	}
	function setCirclesInvisible()
	{
		for ( i = 0; i < allMarkers.length; i++)
		{
			if (allMarkers[i].reachCircles != null)
			{
				allMarkers[i].reachCircles[2].setVisible(false);
				allMarkers[i].reachCircles[1].setVisible(false);
				allMarkers[i].reachCircles[0].setVisible(false);
			}
		}
	}
	function setLinesVisible()
	{
		for ( i = 0; i < lines.length; i++)
		{
			lines[i].setVisible(true);
		}
	}
	function setCirclesVisible()
	{
		for ( i = 0; i < allMarkers.length; i++)
		{
			if (allMarkers[i].reachCircles != null)
			{
				allMarkers[i].reachCircles[2].setVisible(true);
				allMarkers[i].reachCircles[1].setVisible(true);
				allMarkers[i].reachCircles[0].setVisible(true);
			}
		}
	}
	function loadNodesFromXml()
	{
		$(document).ready(function()
		{
			$.ajax(
			{
				type : "GET",
				url : "test2.xml",
				dataType : "xml",
				success : function(xml)
				{
					$(xml).find('meter').each(function()
					{
						var latitude = $(this).find('Latitude').text();
						var longitude = $(this).find('Longitude').text();
						placeMeter(latitude, longitude);
					})
					$(xml).find('DAP').each(function()
					{
						var latitude = $(this).find('Latitude').text();
						var longitude = $(this).find('Longitude').text();
						var technology = $(this).find('Technology').text();
						var reach = parseInt($(this).find('Reach').text(),10);
						
						// loadMarker(latitude,longitude);
						placeDAP(latitude, longitude, technology, reach);
					});
				}
			});
		});
	}
	function showNodesXml()
	{
		var init = "&lt?xml version=\"1.0\" encoding=\"utf-8\"?&gt" + "<br>&ltNodes&gt";
		var meters;
		var daps;
		var fin;
		for ( i = 0; i < allMarkers.length; i++)
		{	
			if(allMarkers[i].type == "meter")
			{
				meters += "<br>&nbsp&ltmeter&gt" 
				+ "<br>&nbsp&nbsp&ltLatitude&gt" + allMarkers[i].position.lat() + "&lt\/Latitude&gt"
				+ "<br>&nbsp&nbsp&ltLongitude&gt" + allMarkers[i].position.lng() + "&lt\/Longitude&gt" 
				+ "<br>&nbsp&lt\/meter&gt";
			}
		
			else 
			if(allMarkers[i].type == "DAP")
			{
				daps += "<br>&nbsp&ltDAP&gt" 
				+ "<br>&nbsp&nbsp&ltLatitude&gt" + allMarkers[i].position.lat() + "&lt\/Latitude&gt" 
				+ "<br>&nbsp&nbsp&ltLongitude&gt" + allMarkers[i].position.lng() + "&lt\/Longitude&gt" 
				+ "<br>&nbsp&nbsp&ltTechnology&gt" + allMarkers[i].teleTech + "&lt\/Technology&gt" 
				+ "<br>&nbsp&nbsp&ltReach&gt" + allMarkers[i].reach + "&lt\/Reach&gt" 
				+ "<br>&nbsp&lt\/DAP&gt";
			}
		}
		fin += "<br>&lt\/Nodes&gt";
		$("#xmltext").html(init+meters+daps+fin);
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
			'locations' : locations
		}
		// Initiate the location request
	}

	
	function connectNodesByDistance(marker)
	{

			for (var i = 0; i < allMarkers.length; i++)
			{
				var dis = distance(marker.position.lat(), marker.position.lng(), allMarkers[i].position.lat(), allMarkers[i].position.lng(), "K");
				dis = dis * 1000;
				if(marker.type != "meter")
				{
					if (dis <= marker.reach)
					{
						selectRouterToDraw(marker,allMarkers[i]);
					}
				}
				else
				{
					if (dis <= allMarkers[i].reach)
					{
						selectRouterToDraw(allMarkers[i],marker);
					}
				}
			}
			if(marker.neighbours.length == 0 && marker.type != "meter" )
			{
				marker.setIcon(marker.offIcon);
			}
			if(marker.type == "meter")
				marker.setIcon(getMeterColor(marker));
			
		

	}
	function distance(lat1, lon1, lat2, lon2, unit)
	{
		var radlat1 = Math.PI * lat1 / 180
		var radlat2 = Math.PI * lat2 / 180
		var radlon1 = Math.PI * lon1 / 180
		var radlon2 = Math.PI * lon2 / 180
		var theta = lon1 - lon2
		var radtheta = Math.PI * theta / 180
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		dist = Math.acos(dist)
		dist = dist * 180 / Math.PI
		dist = dist * 60 * 1.1515
		if (unit == "K")
		{
			dist = dist * 1.609344
		}
		if (unit == "N")
		{
			dist = dist * 0.8684
		}
		return dist
	}
	
	function selectRouterToDraw(marker,marker2)
	{
		if (checkIfConnectionIsPossible(marker, marker2))
		{
			marker.neighbours.push(marker2);
			marker2.neighbours.push(marker);			
			// Troca o ícone do marker2 para LIGADO já que acabou de acontecer uma ligação
			if(marker2.type != "meter")
				marker2.setIcon(marker2.onIcon);
			else
				marker2.setIcon(getMeterColor(marker2));
			//
			var markers = [marker,marker2];
			markerConnections.push(markers);
			drawLine(marker, marker2);
		}
	}
	function checkIfConnectionIsPossible(marker1, marker2)
	{
		if (marker1.ID == marker2.ID)
			return false
		else
		{
			for ( i = 0; i < markerConnections.length; i++)
			{
				if ((markerConnections[i][0].ID == marker1.ID && markerConnections[i][1].ID == marker2.ID) || (markerConnections[i][1].ID == marker1.ID && markerConnections[i][0].ID == marker2.ID))
					return false
			}
		}
		return true;
	}
	function drawLine(marker1, marker2)
	{
		var markerPositions = [marker1.getPosition(), marker2.getPosition()];
		var color;
		var dis = distance(marker1.position.lat(), marker1.position.lng(), marker2.position.lat(), marker2.position.lng(), "K");
		dis = dis * 1000;
		if (dis < marker1.reach / 3)
		{
			color = "#00FF00";
//			if (marker2.type == "meter")
//				marker2.setIcon('greenSquare.png');
		}
		else
		if (dis < marker1.reach * (2 / 3))
		{
			color = "#FFFF00"
//			if (marker2.type == "meter")
//				marker2.setIcon('yellowSquare.png')
		}
		else
		{
			color = "#FF0000"
//			if (marker2.type == "meter")
//				marker2.setIcon('redSquare.png')
		}
		
		var routerPath = new google.maps.Polyline(
		{
			path : markerPositions,
			strokeColor : color,
			strokeOpacity : 1.0,
			strokeWeight : 2
		});
		lines.push(routerPath);
		lines[lines.length - 1].setMap(map);
		
		if (radioMode == "Radius")
		{
			lines[lines.length - 1].setVisible(false);
		}
	}
	function drawCircle(marker)
	{
		var greenCircle;
		var yellowCircle;
		var redCircle;
		redCircle = new google.maps.Circle(
		{
			center : marker.getPosition(),
			radius : marker.reach,
			strokeColor : "#FF0000",
			strokeOpacity : 0.8,
			strokeWeight : 0,
			fillColor : "#FF0000",
			fillOpacity : 0.35,
			map : map
		});
		yellowCircle = new google.maps.Circle(
		{
			center : marker.getPosition(),
			radius : marker.reach * (2 / 3),
			strokeColor : "#FFFF00",
			strokeOpacity : 0.8,
			strokeWeight : 0,
			fillColor : "#FFFF00",
			fillOpacity : 0.35,
			map : map
		});
		greenCircle = new google.maps.Circle(
		{
			center : marker.getPosition(),
			radius : marker.reach / 3,
			strokeColor : "#00FF00",
			strokeOpacity : 0.8,
			strokeWeight : 0,
			fillColor : "#00FF00",
			fillOpacity : 0.35,
			map : map
		});
		marker.reachCircles = [greenCircle, yellowCircle, redCircle];
		if (radioMode != "Radius")
		{
			greenCircle.setVisible(false);
			yellowCircle.setVisible(false);
			redCircle.setVisible(false);
		}
	}
	function reconnectMovedMarker(marker, newPosition)
	{
		for (var i = 0; i < markerConnections.length; i++)
		{
			for (var j = 0; j < 2; j++)
			{
				if (markerConnections[i][j].ID == marker.ID)
				{
					markerConnections[i][j].setPosition(newPosition);
				}
			}
		}
		//	connectRouters();
	}
	function refreshLocation(marker, location)
	{
		mar.setPosition()
	}
	function removeMarkerConnections(marker)
	{
		for (var i = 0; i < markerConnections.length; i++)
		{
			if (markerConnections[i][0].ID == marker.ID || markerConnections[i][1].ID == marker.ID)
			{
				//remove da lista de vizinhos
				lines[i].setVisible(false);
				lines.splice(i, 1);
//				markerConnections[i][0].neighbours.splice(markerConnections[i][1]);
//				markerConnections[i][1].neighbours.splice(markerConnections[i][0]);
				markerConnections[i][0].neighbours.splice(getMarkerPositionFromNeighbour(markerConnections[i][0],markerConnections[i][1]),1);
				markerConnections[i][1].neighbours.splice(getMarkerPositionFromNeighbour(markerConnections[i][1],markerConnections[i][0]),1);
				
//				if (markerConnections[i][1].type == "meter")
//					markerConnections[i][1].setIcon(markerConnections[i][1].originalIcon);
				if(markerConnections[i][1].neighbours.length == 0 && markerConnections[i][1].type != "meter")
				{
					markerConnections[i][1].setIcon(markerConnections[i][1].offIcon);
					
				}
				if(markerConnections[i][1].type == "meter")
				{
						markerConnections[i][1].setIcon(getMeterColor(markerConnections[i][1]));
				}
				
				markerConnections.splice(i, 1);
				i--;
			}
		}
		
		
		//connectRouters();
	}
	function getMarkerPositionFromNeighbour(marker,marker2)
	{
		for(i = 0; i<marker.neighbours.length;i++)
		{
			if(marker2.ID == marker.neighbours[i])
				return i;
		}
		return -1;
	}
	function removeMarker(marker)
	{

			infowindow.setMap(null);
			for (var i = 0; i < allMarkers.length; i++)
			{
				if (allMarkers[i].ID == marker.ID)
				{
					markerCluster.removeMarker(allMarkers[i]);
					allMarkers[i].setMap(null);
					allMarkers.splice(i, 1);
					
				}
			}
			for (var i = 0; i < markerConnections.length; i++)
			{
				if (markerConnections[i][0].ID == marker.ID || markerConnections[i][1].ID == marker.ID)
				{
					//remove da lista de vizinhos
					lines[i].setVisible(false);
					lines.splice(i, 1);
					markerConnections[i][0].neighbours.splice(markerConnections[i][1]);
					markerConnections[i][1].neighbours.splice(markerConnections[i][0]);
					markerConnections.splice(i, 1);
					i--;
				}
			}
			marker.reachCircles[2].setVisible(false);
			marker.reachCircles[1].setVisible(false);
			marker.reachCircles[0].setVisible(false);


	}
	function toggleBounce(marker)
	{
		if (marker.getAnimation() != null)
		{
			marker.setAnimation(null);
		}
		else
		{
			marker.setAnimation(google.maps.Animation.BOUNCE);
		}
	}
	function displayInfoWindow(marker)
	{
		if (opMode == "Insertion")
		{
			var neighboursIDs = "";
			for (var i = 0; i < marker.neighbours.length; i++)
			{
				neighboursIDs += marker.neighbours[i].ID + ", ";
			}
			var content = 'ID: ' + marker.ID + '<br>Latitude: ' + marker.position.lat() + '<br>Longitude: ' + marker.position.lng() + '<br>Elevation: ' + marker.elevation + '<br>Neighbours IDs: ' + neighboursIDs;
			if (marker.teleTech != null && marker.reach != null)
				content += '<br>Technology: ' + marker.teleTech + '<br>Reach: ' + marker.reach + ' meters';
			infowindow.setContent(content);
			infowindow.open(map, marker);
		}
	}
	function getMeterColor(meter)
	{
		//ESTA FUNÇÃO NÃO ESTÁ OTIMIZADA!!!!!!!!!!!!!!!!!!!
		var color = -1
		for(i = 0; i<meter.neighbours.length;i++)
		{
			var dis = distance(meter.position.lat(), meter.position.lng(), meter.neighbours[i].position.lat(), meter.neighbours[i].position.lng(), "K");
			dis = dis * 1000;
			if (dis < meter.neighbours[i].reach / 3)
			{
				if(color > 1 || color == -1)
					color = 1;
			}
			else			
			if (dis < meter.neighbours[i].reach * (2 / 3))
			{
				if(color > 2 || color == -1)				
					color = 2;
				
			}
			else
				if(color == -1)
					color = 3;
			
		}
		if(color == 1)
			return "greenSquare.png";
		else
		if(color == 2)
			return "yellowSquare.png";
		
		else
		if(color == 3)
			return "redSquare.png";
		else
			return "blackSquare.png";

		
	}
	function placeMeter(latitude,longitude)
	{
		var latLng = new google.maps.LatLng(latitude, longitude);
		var marker = new google.maps.Marker(
		{
			type : "meter",
			position : latLng,
			map : map,
			draggable : true,
			offIcon: 'blackSquare.png',
			icon : 'blackSquare.png',
			
			neighbours : [],
			ID : ID
		});
		ID++;
		var locations = [];
		var markerLocation = latLng;
		locations.push(markerLocation);
		// Create a LocationElevationRequest object using the array's one value
		var positionalRequest =
		{
			'locations' : locations
		}
		elevator.getElevationForLocations(positionalRequest, function(results, status)
		{
			if (status == google.maps.ElevationStatus.OK)
			{
				// Retrieve the first result
				connectNodesByDistance(marker);
				
				if (results[0])
				{
					// Open an info window indicating the elevation at the clicked position
					marker.elevation = results[0].elevation;
					allMarkers.push(marker);
					meters.push(marker);
					prepareMarkerEvents(marker);
					
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
	function placeDAP(latitude, longitude, technology, reach)
	{
		var latLng = new google.maps.LatLng(latitude, longitude);
		var marker = new google.maps.Marker(
		{
			type : "DAP",
			position : latLng,
			map : map,
			draggable : true,
			ID : ID,
			offIcon: 'daprouteroff.png',
			onIcon: 'daprouter.png',
			icon : 'daprouter.png',
			teleTech : technology,
			reach : reach,
			reachCircles : [],
			neighbours : []
		});
		ID++;
		var locations = [];
		var markerLocation = latLng;
		locations.push(markerLocation);
		// Create a LocationElevationRequest object using the array's one value
		var positionalRequest =
		{
			'locations' : locations
		}
		elevator.getElevationForLocations(positionalRequest, function(results, status)
		{
			if (status == google.maps.ElevationStatus.OK)
			{
				connectNodesByDistance(marker);
				// Retrieve the first result
				if (results[0])
				{
					// Open an info window indicating the elevation at the clicked position
					drawCircle(marker);
					marker.elevation = results[0].elevation;
					allMarkers.push(marker);
					daps.push(marker);
					prepareMarkerEvents(marker);
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
		markerCluster.addMarker(marker);
		google.maps.event.addListener(marker, 'click', function(event)
		{
			if (opMode == "Removal")		
				removeMarker(marker);
			displayInfoWindow(marker);

		});
		google.maps.event.addListener(marker, 'drag', function(event)
		{
			infowindow.setMap(null);
			reconnectMovedMarker(marker, event.latLng)
			removeMarkerConnections(marker);
			connectNodesByDistance(marker);
			
			if (marker.type == "DAP")
			{
				marker.reachCircles[0].setVisible(false);
				marker.reachCircles[1].setVisible(false);
				marker.reachCircles[2].setVisible(false);
			}
			if(marker.type != "meter")
			{
				if(marker.neighbours.length == 0)
					marker.setIcon(marker.offIcon);
				else
				{
					marker.setIcon(marker.onIcon);
					
				}
			}

			
		});
		google.maps.event.addListener(marker, 'dragend', function(event)
		{
			// reconnectMovedMarker(marker,event.latLng)
			drawCircle(marker);
			marker.setPosition(event.latLng);
			var locations = [];
			var markerLocation = marker.getPosition();
			locations.push(markerLocation);
			// Create a LocationElevationRequest object using the array's one value
			var positionalRequest =
			{
				'locations' : locations
			}
			elevator.getElevationForLocations(positionalRequest, function(results, status)
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
	
	

	//drawingManager.setMap(map);
}
google.maps.event.addDomListener(window, 'load', initialize);

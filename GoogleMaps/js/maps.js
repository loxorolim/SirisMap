/// <reference path="/js/jquery-1.10.2.min.js" />
var elevator;
var map;
var allMarkers = [];
var disconnectedMeters = [];
var oneHopMeters = [];
var meters = [];
var daps = [];
var routers = [];
var infowindow = new google.maps.InfoWindow();
var opMode = "Insertion";
var radioMode = "Line";
var dbm = "dbm0";
var meshEnabled = false;
var markerPair = [];
var markerConnections = [];
var ID = 0;
var lines = [];
var dashedLines = [];
var circles = [];
var request;
var markerCluster;
var insertListener;
var map;
var scenario = "Metropolitan";
var currentTech = "w80211";
var currentIns = "DAP";
var table = [];

function initialize()
{
	var mapOptions =
	{
		zoom : 3,
		minZoom : 2,
		center : new google.maps.LatLng(-28.643387, 0.612224),
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		mapTypeControl : true,
		panControl: false,
		zoomControl: true,
		zoomControlOptions: 
		{
			position : google.maps.ControlPosition.TOP_RIGHT
			
		},
		mapTypeControlOptions :
		{
			style : google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position : google.maps.ControlPosition.TOP_RIGHT

		}
	}
	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
	// Create an ElevationService
	elevator = new google.maps.ElevationService();
	markerCluster = new MarkerClusterer(map);
	markerCluster.setGridSize(10);
	loadNodesFromXml();
	
	insertListener = google.maps.event.addListener(map, 'click', function(event)
	{
		if(opMode == "Insertion")
		{
			placeDAP(event.latLng.lat(),event.latLng.lng(),currentTech);
		
		}
	});
	setButtons();
	//table = loadTable();
	//getValuesFromTable("ZigBee","Metropolitan","dbm0",15);
	createTableFromOptions();
	//alert(shadowingPropagation(70));




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
				//dis = dis*1000;
				var values = getValuesFromTable(dis);

				if (values != -1)
				{
					if(marker.type != "Meter")
					{					
							connectMarkers(marker,allMarkers[i],values.color);
					}
					else
					{
							if(allMarkers[i].type != "Meter")
								connectMarkers(allMarkers[i],marker,values.color);
						
					}
				}
			}
			if(marker.type != "Meter" )
			{
				if(marker.neighbours.length == 0)
				{
					marker.setIcon(marker.offIcon);
				}
				else
				{
					marker.setIcon(marker.onIcon);
				}
					
			}
			else
			{
				marker.setIcon(getMeterColor(marker));
			}
		
		
	

}
function distance(lat1, lon1, lat2, lon2, unit)
{
/*	var radlat1 = Math.PI * lat1 / 180
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
	*/
	var latLngA = new google.maps.LatLng(lat1, lon1);
	var latLngB = new google.maps.LatLng(lat2, lon2);
	var dist = google.maps.geometry.spherical.computeDistanceBetween (latLngA, latLngB);
	return dist
}
function findAndRemove(list, obj)
{
	for(var i = 0; i < list.length;i++)
	{
		if(list[i] == obj)
		{
			list.splice(i,1);
		}
	}
}
function connectMarkers(marker,marker2, color)
{
	if (checkIfConnectionIsPossible(marker, marker2))
	{
		marker.neighbours.push(marker2);
		marker2.neighbours.push(marker);			
		// Troca o ícone do marker2 para LIGADO já que acabou de acontecer uma ligação
		marker2.connected = true;
		marker.connected = true;
		if(marker2.type == "Meter")	
		{		
			marker2.setIcon(getMeterColor(marker2));
			findAndRemove(disconnectedMeters,marker2);
			
		}
		else
			marker2.setIcon(marker2.onIcon);
		marker.setIcon(marker.onIcon);
		//
		var markers = [marker,marker2];
		markerConnections.push(markers);
		drawLine(marker, marker2,color);
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
/*function drawLine(marker1, marker2)
{
	var markerPositions = [marker1.getPosition(), marker2.getPosition()];
	var color;
	var dis = distance(marker1.position.lat(), marker1.position.lng(), marker2.position.lat(), marker2.position.lng(), "K");
	dis = dis * 1000;
	//var reach = fetchReach(marker1.teleTech,scenario,dbm)
	var reach = marker1.reach;
	if (dis < reach / 3)
	{
		color = "#00FF00";
	}
	else
	if (dis < reach * (2 / 3))
	{
		color = "#FFFF00"
	}
	else
	{
		color = "#FF0000"
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
*/
function drawLine(marker1, marker2, colorname)
{
	var markerPositions = [marker1.getPosition(), marker2.getPosition()];
	var color;
	//var reach = fetchReach(marker1.teleTech,scenario,dbm)
	var reach = marker1.reach;
	if (colorname == "GREEN")
	{
		color = "#00FF00";
	}
	else
	if (colorname == "YELLOW")
	{
		color = "#FFFF00"
	}
	else
	{
		color = "#FF0000"
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
function drawDashedLine(marker1, marker2, colorname)
{
	 var lineSymbol = {
		path: 'M 0,-1 0,1',
		strokeOpacity: 1,
		scale: 4
	  };
	var markerPositions = [marker1.getPosition(), marker2.getPosition()];
	var color;
	//var reach = fetchReach(marker1.teleTech,scenario,dbm)
	var reach = marker1.reach;
	if (colorname == "GREEN")
	{
		color = "#00FF00";
	}
	else
	if (colorname == "YELLOW")
	{
		color = "#FFFF00"
	}
	else
	{
		color = "#FF0000"
	}
	
	var routerPath = new google.maps.Polyline(
	{
		path : markerPositions,
		strokeColor : color,
		strokeOpacity : 0,
		icons: [{
      icon: lineSymbol,
      offset: '0',
      repeat: '20px'
    }],
		strokeWeight : 2
	});
	dashedLines.push(routerPath);
	dashedLines[dashedLines.length - 1].setMap(map);
	routerPath.setMap(map);
	//if (radioMode == "Radius")
	//{
	//	dashedLines[dashedLines.length - 1].setVisible(false);
	//}

}
function getCircleColorPositions()
{
	var medPos1;
	var medPos2;
	var endPos = table[table.length-1].distance;
	for(var i = 0; i < table.length-1 ;i++)
	{
		if(table[i].color == "GREEN" && table[i+1].color == "YELLOW")
		{
			//medPos1 = (table[i].distance + table[i+1].distance)/2; 
			medPos1 = table[i].distance ; 
		}
		if(table[i].color == "YELLOW" && table[i+1].color == "RED")
		{
			//medPos2 = (table[i].distance + table[i+1].distance)/2;
			medPos2 = table[i].distance;
		}
	}
	var positions =
	{
		ini : 0,
		med1 : medPos1,
		med2 : medPos2,
		end : endPos
	}
	return positions;
}
function drawCircle(marker)
{
	var positions = getCircleColorPositions();
	
	var greenCircle;
	var yellowCircle;
	var redCircle;
	redCircle = new google.maps.Circle(
	{
		center : marker.getPosition(),
		radius : positions.end,
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
		radius : positions.med2,
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
		radius : positions.med1,
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
			markerConnections[i][0].neighbours.splice(getMarkerPositionFromNeighbour(markerConnections[i][0],markerConnections[i][1]),1);
			markerConnections[i][1].neighbours.splice(getMarkerPositionFromNeighbour(markerConnections[i][1],markerConnections[i][0]),1);
			
			if(markerConnections[i][0].neighbours.length == 0)
				markerConnections[i][0].connected = false;
			if(markerConnections[i][1].neighbours.length == 0)
				markerConnections[i][1].connected = false;
			
			if(markerConnections[i][1].neighbours.length == 0 && markerConnections[i][1].type != "Meter")
			{
				markerConnections[i][1].setIcon(markerConnections[i][1].offIcon);
				
			}
			if(markerConnections[i][0].neighbours.length == 0 && markerConnections[i][0].type != "Meter")
			{
				markerConnections[i][0].setIcon(markerConnections[i][0].offIcon);
				
			}
			if(markerConnections[i][1].type == "Meter")
			{
					markerConnections[i][1].setIcon(getMeterColor(markerConnections[i][1]));
					disconnectedMeters.push(markerConnections[i][1]);
			}
			if(markerConnections[i][0].type == "Meter")
			{
					markerConnections[i][0].setIcon(getMeterColor(markerConnections[i][0]));
					disconnectedMeters.push(markerConnections[i][0]);

			}
			
			
			markerConnections.splice(i, 1);
			i--;
		}
	}
	
}
function getMarkerPositionFromNeighbour(marker,marker2)
{
	for(i = 0; i<marker.neighbours.length;i++)
	{
		if(marker2.ID == marker.neighbours[i].ID)
			return i;
	}
	return -1;
}
function removeMarker(marker)
{
		removeMarkerConnections(marker);
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
				markerConnections[i][0].neighbours.splice(getMarkerPositionFromNeighbour(markerConnections[i][0],markerConnections[i][1]),1);
				markerConnections[i][1].neighbours.splice(getMarkerPositionFromNeighbour(markerConnections[i][1],markerConnections[i][0]),1);
				markerConnections.splice(i, 1);
				i--;
			}
		}
		marker.reachCircles[2].setVisible(false);
		marker.reachCircles[1].setVisible(false);
		marker.reachCircles[0].setVisible(false);


}

function displayInfoWindow(marker)
{

		var neighboursIDs = "";
		for (var i = 0; i < marker.neighbours.length; i++)
		{
			neighboursIDs += marker.neighbours[i].ID + ", ";
		}
		var content = 'ID: ' + marker.ID + '<br>Latitude: ' + marker.position.lat() + '<br>Longitude: ' + marker.position.lng() + '<br>Elevation: ' + marker.elevation + '<br>Neighbours IDs: ' + neighboursIDs + '<br>Connected: '+marker.connected;
		if(marker.type == "Meter")
			content += '<br>Hop: '+marker.meshHop;
		if (marker.teleTech != null )
			content += '<br>Technology: ' + marker.teleTech + '<br>Reach: ' + marker.reach + ' meters';
		infowindow.setContent(content);
		infowindow.open(map, marker);
	
}
function getMeterColor(meter)
{
	//ESTA FUNÇÃO NÃO ESTÁ OTIMIZADA!!!!!!!!!!!!!!!!!!!
	var color = -1
	for(i = 0; i<meter.neighbours.length;i++)
	{
		var dis = distance(meter.position.lat(), meter.position.lng(), meter.neighbours[i].position.lat(), meter.neighbours[i].position.lng(), "K");
		dis = dis;
		var positions = getCircleColorPositions();
		if (dis < positions.med1)
		{
			if(color > 1 || color == -1)
				color = 1; 
		}
		else			
		if (dis <positions.med2)
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
		type : "Meter",
		position : latLng,
		map : map,
		draggable : true,
		offIcon: 'blackSquare.png',
		icon : 'blackSquare.png',
		neighbours : [],
		ID : ID,
		connected: false,
		meshHop : 0
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
				disconnectedMeters.push(marker);
				meters.push(marker);
				prepareMarkerEvents(marker);
				if(meshEnabled)
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
function placeDAP(latitude, longitude, technology)
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
		reachCircles : [],
		neighbours : [],
		connected : false
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
				if(meshEnabled)
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
	markerCluster.addMarker(marker);
	google.maps.event.addListener(marker, 'click', function(event)
	{
		if (opMode == "Removal")		
		{
			removeMarker(marker);
			if(meshEnabled)
			{
				executeRFMesh()
			}
		}
		else
			displayInfoWindow(marker);

	});
	google.maps.event.addListener(marker, 'dragstart', function(event)
	{
		infowindow.setMap(null);
		removeMesh();
	});
	google.maps.event.addListener(marker, 'drag', function(event)
	{
		
		//reconnectMovedMarker(marker, event.latLng)
		removeMarkerConnections(marker);
		connectNodesByDistance(marker);
		
		

	
		if(marker.type != "Meter")
		{
			marker.reachCircles[0].setVisible(false);
			marker.reachCircles[1].setVisible(false);
			marker.reachCircles[2].setVisible(false);
			
			if(marker.neighbours.length == 0)
				marker.setIcon(marker.offIcon);
			else
				marker.setIcon(marker.onIcon);
		}

		
	});
	google.maps.event.addListener(marker, 'dragend', function(event)
	{
		
		// reconnectMovedMarker(marker,event.latLng)
		if(meshEnabled)
			connectViaMesh();
		if(marker.type != "Meter")
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

//GETTERS AND SETTERS-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function getValuesFromTable(dist)
{
	//var rounddist = Math.round(dist);
	if(dist > table[table.length - 1])
	{
			return -1;
	}

	for(var i = 0;i<table.length-1 ; i++)
	{	
		if(table[i].distance <= dist && dist < table[i+1].distance)
		{
			return table[i+1];
		}
	}
	return -1;
	
	/*for(var i = 0; i < table.length ; i ++)
	{
		if(table[i].name == tech)
		{
			for( var j = 0 ; j < table[i].children.length ; j ++)
			{
				if(table[i].children[j].name == scenario)
				{
					for( var k = 0 ; k < table[i].children[j].children.length ; k ++)
					{
						if(table[i].children[j].children[k].name == power)
						{
							for( var l = 0 ; l < table[i].children[j].children[k].children.length ; l ++)
							{
								var split = table[i].children[j].children[k].children[l].name.split("-");
								var val1 = parseFloat(split[0],10);
								var val2 = parseFloat(split[1],10);
								
								if(val1 <= dist && dist < val2)
								{
									var ret = [];
									ret.push(table[i].children[j].children[k].children[l].children[0])
									ret.push(table[i].children[j].children[k].children[l].children[1])
									return ret;


								}
							}
						}
					}
				}
			}
		}
	}
	*/
}

function createTableFromOptions()
{
	if(currentTech == "w80211")
	{
		var wifitable = [];
		//de 0 a 100 metros
		for(var i = 0; i <= 100 ; i+= 5)
		{
			var dist = i;
			var sp = shadowingPropagation(i);
			var c ;
			if(sp >= 0.98)
				c = "GREEN";
			else if (0.95<=sp && sp < 0.98)
				c = "YELLOW";
				else
					c = "RED";
				
			
			if(sp >= 0.9)
			{
				var value = 
				{
					distance : dist,
					efficiency : sp,
					color : c
					
				}
				wifitable.push(value);
			}
			else
			{
				break;
			}
		}
		table = wifitable;
	}
	if(currentTech == "ZigBee")
	{
	
	}
}
function calculateValue()
{

}
function freespace(Pt,Gt,Gr,lambda,L,d)
{
	var M = lambda / (4 * Math.PI * d);
	return (Pt * Gt * Gr * (M * M)) / L;
}
function shadowingPropagation(distance)
{
	var Pt = 0.28183815;       // transmit power
	var Gt = 1.0;              // transmit antenna gain
	var Gr = 1.0;              // receive antenna
	var freq = 914.0e6;        // frequency
	var sysLoss = 1.0;         // system loss	
	var pathlossExp = 2.0;     // path loss exponent
	var std_db = 2.8;          // shadowing deviation
	var dist0 = 1.0;           // reference distance
	var lambda = 3.0e8/freq;   // lambda 
	var rxThresh_=3.3e-8;      // rx threshold
	
	var Pr0 = freespace(Pt,Gt,Gr,lambda,sysLoss,dist0);
	
	var avg_db = -10.0 * pathlossExp * (Math.log(distance/dist0)/Math.log(10));
	var temp=10*(Math.log(rxThresh_/Pr0)/Math.log(10))-avg_db;
	

	return 1 - normalcdf(0,std_db,temp);
	
	
}
function normalcdf(mean, sigma, to) 
{
    var z = (to-mean)/Math.sqrt(2*sigma*sigma);
    var t = 1/(1+0.3275911*Math.abs(z));
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var erf = 1-(((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-z*z);
    var sign = 1;
    if(z < 0)
    {
        sign = -1;
    }
    return (1/2)*(1+sign*erf);
}



function setOpMode(mode)
{
	opMode = mode;
}
function getOpMode()
{
	return opMode;
}
function setRadioMode(mode)
{
	radioMode = mode;
}
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

function setInsertionOptions(type)
{
	currentIns = type;
	insertListener.remove();
	google.maps.event.removeListener(insertListener);
	insertListener = google.maps.event.addListener(map, 'click', function(event)
	{
		if(getOpMode() == "Insertion")
		{
			if(type == "DAP")
			{
				placeDAP(event.latLng.lat(),event.latLng.lng(),currentTech);
			}
			if(type == "Meter")
				placeMeter(event.latLng.lat(),event.latLng.lng());
			
		
		}
		
	});
}
function fetchReach(tech,scenario,dbm)
{
	return loadReachFromTable(tech,scenario, dbm)

	
}
function executeRFMesh()
{
	removeMesh();
	connectViaMesh();
}
function setRFMesh()
{
	meshEnabled = !meshEnabled;
	if(meshEnabled)
		executeRFMesh();
	else
		removeMesh();
}
function removeMesh()
{
	disconnectedMeters = [];
	for(var i = 0; i < dashedLines.length; i++)
	{
		dashedLines[i].setMap(null);
	}
	for(var i = 0; i < allMarkers.length;i++)
	{
		if(allMarkers[i].type == "Meter")		
			allMarkers[i].meshHop = 0;
		if(!allMarkers[i].connected )
			disconnectedMeters.push(allMarkers[i]);
	}
	dashedLines =[];
}
function connectViaMesh()
{

	//ALTERAR PARA 3 'FOR' UM DENTRO DO OUTRO!!!
	//PARA CADA METER DESCONECTADO
	var disMeters = disconnectedMeters.slice();
	var hopMeters = [];
	for(var i = 0; i < disMeters.length ; i++)
	{
		//PEGA O METER MAIS PRÓXIMO QUE ESTÁ CONECTADO A UM DAP E FAZ UMA LIGAÇÃO MESH SE POSSÍVEL
		var meterToConnect;
		var finalDis = -1;
		for(var j = 0; j < allMarkers.length ; j++)
		{
			if(allMarkers[j].type == "Meter" && allMarkers[j].connected == true)
			{
				if(finalDis == -1)
				{	
					finalDis = distance(disMeters[i].position.lat(), disMeters[i].position.lng(), allMarkers[j].position.lat(), allMarkers[j].position.lng(), "K");
					meterToConnect = allMarkers[j]	;
				}
				else
				{
					var dist = distance(disMeters[i].position.lat(), disMeters[i].position.lng(), allMarkers[j].position.lat(), allMarkers[j].position.lng(), "K");
					if(dist < finalDis)
					{
						finalDis = dist;
						meterToConnect = allMarkers[j];
					}
					
				}					
			}			
		}
		var values = getValuesFromTable(finalDis);
		if(values != -1)
		{
			drawDashedLine(disMeters[i], meterToConnect, values.color)
			findAndRemove(disconnectedMeters,disMeters[i]);
			disMeters[i].meshHop = 1;
			hopMeters.push(disMeters[i]);
		}	
	}
	//SEGUNDA PASSADA, PARA OS NÓS QUE NÃO SE CONECTARAM AOS OUTROS COM APENAS 1 SALTO
	disMeters = disconnectedMeters.slice();
	var newHopMeters = [];
	for(var i = 0; i < disMeters.length; i++)
	{
		var meterToConnect;
		var finalDis = -1;
		for(j = 0; j < hopMeters.length; j++)
		{
			if(hopMeters[j].meshHop == 1)
			{
				if(finalDis == -1)
				{	
					finalDis = distance(disMeters[i].position.lat(), disMeters[i].position.lng(), hopMeters[j].position.lat(), hopMeters[j].position.lng(), "K");
					meterToConnect = hopMeters[j]	;
				}
				else
				{
					var dist = distance(disMeters[i].position.lat(), disMeters[i].position.lng(), hopMeters[j].position.lat(), hopMeters[j].position.lng(), "K");
					if(dist < finalDis)
					{
						finalDis = dist;
						meterToConnect = hopMeters[j];
					}
					
				}					
			}		
		}
		var values = getValuesFromTable(finalDis);
		if(values != -1)
		{
			drawDashedLine(disMeters[i], meterToConnect, values.color)
			findAndRemove(disconnectedMeters,disMeters[i]);
			disMeters[i].meshHop = 2;
			newHopMeters.push(disMeters[i]);	
		}		
	}
	hopMeters = newHopMeters;
	disMeters = disconnectedMeters.slice();
	//var newHopMeters = [];
	for(var i = 0; i < disMeters.length; i++)
	{
		var meterToConnect;
		var finalDis = -1;
		for(j = 0; j < hopMeters.length; j++)
		{
			if(hopMeters[j].meshHop == 2)
			{
				if(finalDis == -1)
				{	
					finalDis = distance(disMeters[i].position.lat(), disMeters[i].position.lng(), hopMeters[j].position.lat(), hopMeters[j].position.lng(), "K");
					meterToConnect = hopMeters[j]	;
				}
				else
				{
					var dist = distance(disMeters[i].position.lat(), disMeters[i].position.lng(), hopMeters[j].position.lat(), hopMeters[j].position.lng(), "K");
					if(dist < finalDis)
					{
						finalDis = dist;
						meterToConnect = hopMeters[j];
					}
					
				}					
			}		
		}
		var values = getValuesFromTable(finalDis);
		if(values != -1)
		{
			drawDashedLine(disMeters[i], meterToConnect, values.color)
			findAndRemove(disconnectedMeters,disMeters[i]);
			disMeters[i].meshHop = 3;
			//newHopMeters.push(disMeters[i]);	
		}		
	}
}

function setInfoWindowNull()
{
	infowindow.setMap(null);
}
function getAllMarkers()
{
	return allMarkers;
}
function setDapsToTechnology()
{
	for(i = 0 ; i< daps.length;i++)
	{
		/*if(mode == "ZigBee")
		{
			daps[i].teleTech = "ZigBee";

		}
		if(mode == "80211")
		{
			daps[i].teleTech = "80211";
		}*/
		daps[i].teleTech = currentTech;
		daps[i].reach = fetchReach(currentTech,scenario,dbm);
	}	
	drawRefresh();
}
function removeMarkerCircles(marker)
{
	marker.reachCircles[0].setVisible(false);
	marker.reachCircles[1].setVisible(false);
	marker.reachCircles[2].setVisible(false);
}
function setScenario(sce)
{
	scenario = sce;
	setDapsToTechnology();
}


function drawRefresh()
{
	infowindow.setMap(null);
	for(j = 0; j< allMarkers.length; j++)
	{

		removeMarkerConnections(allMarkers[j]);
		connectNodesByDistance(allMarkers[j]);
		if(allMarkers[j].type != "Meter")
			removeMarkerCircles(allMarkers[j]);
		drawCircle(allMarkers[j]);
	}
}
function getCurrentTech()
{
	return currentTech;
}
function setCurrentTech(tech)
{
	currentTech = tech;
}
function setdbm(d)
{
	dbm = d;
	setDapsToTechnology();

}
function getConfigurations()
{
	if(opMode == "Removal")
		var mode = "Mode: "+ opMode;
	else
		var mode = "Mode: " + currentIns +" "+ opMode;
	if(currentTech == "w80211")
		var tech = "<br>Technology: " + 802.11;
	else
		var tech = "<br>Technology: " + currentTech;
	var power;
	switch(dbm)
	{
		case "dbm0":
		{
			power = "0 dbm";
			break;
		}
		case "dbm6":
		{
			power = "6 dbm";
			break;
		}
		case "dbm12":
		{
			power = "12 dbm";
			break;
		}
		case "dbm18":
		{
			power = "18 dbm";
			break;
		}
		case "dbm24":
		{
			power = "24 dbm";
			break;
		}
		case "dbm30":
		{
			power = "30 dbm";
			break;
		}
		default:
		break;
	}
	var power = "<br>Power: " + power ;
	var sce = "<br>Scenario: " + scenario;
	
	return mode + tech + power + sce;		
}
google.maps.event.addDomListener(window, 'load', initialize);

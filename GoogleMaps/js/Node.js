//function placeMeter(latitude, longitude)
//{
//    var latLng = new google.maps.LatLng(latitude, longitude);
//    var marker = new google.maps.Marker(
//	{
//	    type: "Meter",
//	    position: latLng,
//	    map: map,
//	    draggable: true,
//	    offIcon: meterOffIconImage,
//	    icon: meterOffIconImage
//	    neighbours: [],
//	    ID: ID,
//	    X: 0,
//        Y: 0,
//	    connected: false,
	    
//	    meshHop: 0
//	});
//    ID++;
//   // var locations = [];
//   //// var markerLocation = latLng;
//   // locations.push(latLng);
//   // // Create a LocationElevationRequest object using the array's one value
//   // var positionalRequest =
//   // {
//   //     'locations': locations
//   // }
//   // elevator.getElevationForLocations(positionalRequest, function (results, status)
//   // {
//   //     if (status == google.maps.ElevationStatus.OK)
//   //     {
//   //         // Retrieve the first result
            

//   //         if (results[0])
//   //         {
//   //             // Open an info window indicating the elevation at the clicked position
//   //             marker.elevation = results[0].elevation;
//   //             allMarkers.push(marker);
//   //             disconnectedMeters.push(marker);
//   //             connectNodesByDistance(marker);
//   //             meters.push(marker);
//   //             prepareMarkerEvents(marker);
//   //             if (meshEnabled)
//   //                 executeRFMesh();

//   //         }
//   //         else 
//   //             return -1;           
//   //     }
//   //     else 
//   //         return -1;
        
//   // });
//    allMarkers.push(marker);
//    disconnectedMeters.push(marker);
//    connectNodesByDistance(marker);
//    meters.push(marker);
//    prepareMarkerEvents(marker);
//    if (meshEnabled)
//        executeRFMesh();
//}


function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};
function connectViaMesh() {
    resetMesh();
    var connectedMeters = meters.filter(function (item) {
        return (item.connected == true);
    });
    var aux = [];
    for (var i = 0; i < meshMaxJumps; i++) {
        for (var j = 0; j < connectedMeters.length; j++) {
            connectedMeters[j].connectViaMesh();
            aux = aux.concat(connectedMeters[j].meshNeighbours);
        }
        connectedMeters = aux;
        aux = [];
    }
}
function resetMesh() {

    for (var i = 0; i < meters.length; i++) {
        meters[i].disconnectMesh();
    }
}


function createPole() {
    var marker = new google.maps.Marker({
            type: "Pole",
            position: null,
            map: map,
            draggable: true,
            icon: poleIcon,
            zIndex: -1,
            ID: null,
            place : function (latitude,longitude) {
                var latLng = new google.maps.LatLng(latitude, longitude);
                this.position = latLng;
                poles.push(this);
                markerCluster.addMarker(this, true);
                this.ID = generateUUID();
            },
            remove: function () {
                var pole = this;
                poles = poles.filter(function (item) {
                    return (item.ID != pole.ID);
                });                
                this.setMap(null);
                markerCluster.removeMarker(this, true);
            }

    });
    google.maps.event.addListener(marker, 'click', function (event) {
        if (opMode == "Removal")
            marker.remove();
    });
    google.maps.event.addListener(marker, 'dragend', function (event) {
        marker.setPosition(event.latLng);
    });
    return marker;
}
function createMeter() {
    var marker = new google.maps.Marker({
        ID: null,
        type: "Meter",
        position: null,
        map: map,
        connected: false,
        draggable: true,
        meshConnectionLines: [],
        icon: meterOffIconImage,
        neighbours: [],
        meshNeighbours: [],
        place: function (latitude, longitude) {
            
            var latLng = new google.maps.LatLng(latitude, longitude);
            this.position = latLng;
            meters.push(this);
            markerCluster.addMarker(this, true);
            this.ID = generateUUID();
            this.removeConnections(this.getPosition());
            this.connectByDistance(this.getPosition());
            if (meshEnabled)
                connectViaMesh();
        },
        remove: function () {
            var meter = this;
            meters = meters.filter(function (item) {
                return (item.ID != meter.ID);
            });
            this.setMap(null);
            for (var i = 0; i < this.neighbours.length; i++) {
                this.neighbours[i].disconnectTarget(this);
            }
            markerCluster.removeMarker(this, true);
        },
        changeIcon: function (newIcon) {
            this.setIcon(newIcon);
        },
        changeMeterColor: function () {
            //CHAMAR DEPOIS DE ATUALIZAR A POSICAO
            var color;
            var dist = -1;
            for (i = 0; i < this.neighbours.length; i++) {
                var auxDist = google.maps.geometry.spherical.computeDistanceBetween(this.getPosition(), this.neighbours[i].getPosition());
                if (dist == -1 || auxDist < dist)
                    dist = auxDist;

            }
            var values = getValuesFromTable(dist);
            if (values != -1 && dist != -1) {
                if (values.color == GREEN)
                    this.changeIcon(meterBestIconImage);
                if (values.color == YELLOW)
                    this.changeIcon(meterBetterIconImage);
                if (values.color == BLUE)
                    this.changeIcon(meterGoodIconImage);
                this.connected = true;
            }
            else {
                this.changeIcon(meterOffIconImage);
                this.connected = false;
            }
        
        },
        connect: function (target) {
            for (var i = 0; i < this.neighbours.length; i++) {
                if (this.neighbours[i].ID == target.ID) {
                    this.neighbours.splice(i, 1);
                    break;
                }
            }
            this.neighbours.push(target);
            
            this.changeMeterColor();

            //target.neighbours.push(this);
        },
        disconnectTarget: function (target) {
            for (var i = 0; i < this.neighbours.length; i++) {
                if (this.neighbours[i].ID == target.ID) {
                    this.neighbours.splice(i, 1);
                    break;
                }
            }
            this.changeMeterColor();
        },
        meshConnect: function (target, source, color) {
            if (source) {
                var lineSymbol = {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 1,
                    scale: 3
                };
                var meterPositions = [this.getPosition(), target.getPosition()];
                var routerPath = new google.maps.Polyline(
                {
                    path: meterPositions,
                    strokeColor: color,
                    strokeOpacity: 0,
                    icons: [{
                        icon: lineSymbol,
                        offset: '0',
                        repeat: '15px'
                    }],
                    clickable: false,
                    strokeWeight: 1
                });
                this.meshConnectionLines.push(routerPath);
                routerPath.setMap(map);
            }
            else {
                this.changeIcon(meterMeshIconImage);
            }
            this.meshNeighbours.push(target);
            this.connected = true;
        },
        disconnectMesh: function () {
            this.meshNeighbours = [];
            for (var i = 0; i < this.meshConnectionLines.length; i++) {
                this.meshConnectionLines[i].setMap(null);
            }
            this.meshConnectionLines = [];
            if (this.neighbours.length == 0) {
                this.connected = false;
                this.changeIcon(meterOffIconImage);
            }
               
        },
        connectViaMesh: function () {
            for (var i = 0; i < meters.length; i++) {
                if (!meters[i].connected) {
                    var dist = google.maps.geometry.spherical.computeDistanceBetween(this.getPosition(), meters[i].getPosition());
                    var values = getValuesFromTable(dist);
                    if (values != -1) {
                        this.meshConnect(meters[i], true, values.color);
                        meters[i].meshConnect(this, false);
                    }
                }
            }
        },
        connectByDistance: function (newDistance) {
            for (var i = 0; i < daps.length; i++) {
                var dist = google.maps.geometry.spherical.computeDistanceBetween(newDistance, daps[i].position);
                var values = getValuesFromTable(dist);
                if (values != -1) {
                    this.connect(daps[i],values.color);
                    daps[i].connect(this,values.color);
                }
            }                 
        },
        removeConnections: function (newDistance) {
            for (var i = 0; i < this.neighbours.length; i++) {
             //   var dist = google.maps.geometry.spherical.computeDistanceBetween(newDistance, this.neighbours[i].position);
             //   var values = getValuesFromTable(dist);
             //   if (values == -1) {
                    this.neighbours[i].disconnectTarget(this);
             //   }
            }
            this.neighbours = [];
            this.changeMeterColor();
        },
        displayInfoWindow: function () {
            var content = 'ID: ' + this.ID +
                '<br>Latitude: ' + this.position.lat() +
                '<br>Longitude: ' + this.position.lng() +
                '<br>Quantidade de vizinhos: ' + this.neighbours.length;
                
            infowindow.setContent(content);
            infowindow.open(map, this);

        }

    });
    google.maps.event.addListener(marker, 'click', function (event) {
        if (opMode == "Removal") {
            marker.remove();
            if (meshEnabled)
                executeRFMesh()
        }
        else
            marker.displayInfoWindow();

    });
    google.maps.event.addListener(marker, 'dragstart', function (event) {
        marker.removeConnections(event.latLng);
        resetMesh();
        infowindow.setMap(null);
       // removeMesh();
    });
    google.maps.event.addListener(marker, 'drag', function (event) {
        

    });

    google.maps.event.addListener(marker, 'dragend', function (event) {
        marker.removeConnections(event.latLng);
        marker.connectByDistance(event.latLng);
        marker.setPosition(event.latLng);
        if (meshEnabled)
            connectViaMesh();
    });
    return marker;
}
function createDAP() {
    var marker = new google.maps.Marker({
        ID: null,
        type: "DAP",
        position: null,
        map: map,
        draggable: true,
        icon: dapOnIconImage,
        neighbours: [],
        connectionLines: [],
        place: function (latitude, longitude) {
            var latLng = new google.maps.LatLng(latitude, longitude);
            this.position = latLng;
            daps.push(this);
            markerCluster.addMarker(this, true);
            this.ID = generateUUID();
            this.removeConnections(this.getPosition());
            this.connectByDistance(this.getPosition());
            if (meshEnabled)
                connectViaMesh();

        },
        remove: function () {
            var dap = this;
            daps = daps.filter(function (item) {
                return (item.ID != dap.ID);
            });
            this.setMap(null);
            markerCluster.removeMarker(this, true);
            for (var i = 0; i < this.connectionLines.length; i++) {
                this.connectionLines[i].setMap(null);
            }
            for (var i = 0; i < this.neighbours.length; i++) {
                this.neighbours[i].disconnectTarget(this);
            }
            this.connectionLines = [];
        },
        changeIcon: function (newIcon) {
            this.icon = newIcon;
        },

        connect: function (target, color) {
            for (var i = 0; i < this.neighbours.length; i++) {
                if (this.neighbours[i].ID == target.ID) {
                    this.neighbours.splice(i, 1);
                    break;
                }
            }
            for (var i = 0; i < this.connectionLines.length; i++) {
                if (this.connectionLines[i].targetID == target.ID) {
                    this.connectionLines[i].setMap(null);
                    this.connectionLines.splice(i, 1);
                    break;
                }
            }
            this.neighbours.push(target);
            var markerPositions = [this.getPosition(),target.getPosition()];
            var routerPath = new google.maps.Polyline(
	        {
	            targetID: target.ID,
	            path: markerPositions,
	            strokeColor: color,
	            strokeOpacity: 1.0,
	            strokeWeight: 2,
	            clickable: false
	        });
            this.connectionLines.push(routerPath);
            routerPath.setMap(map);
 
        },
        disconnectTarget: function (target) {
            for (var i = 0; i < this.neighbours.length; i++) {
                if (this.neighbours[i].ID == target.ID) {
                    this.neighbours.splice(i, 1);
                    break;
                }
            }
            for (var i = 0; i < this.connectionLines.length; i++) {
             
                if (this.connectionLines[i].targetID == target.ID) {
                    this.connectionLines[i].setMap(null);
                    this.connectionLines.splice(i, 1);
                    break;
                }
            }
        },
        connectByDistance: function (newDistance) {
            //POR ENQUANTO DAPS NAO SE CONECTAM ENTRE SI
            var allMarkers = meters.concat(daps);
            for (var i = 0; i < allMarkers.length; i++) {
                var dist = google.maps.geometry.spherical.computeDistanceBetween(newDistance, allMarkers[i].position);
                var values = getValuesFromTable(dist);
                if (values != -1 && this.ID != allMarkers[i].ID) {
                    this.connect(allMarkers[i], values.color);
                    if(allMarkers[i].type == "DAP")
                        allMarkers[i].connect(this, values.color);
                    else
                        allMarkers[i].connect(this);
                }
            }
        },
        removeConnections: function (newDistance) {
            for (var i = 0; i < this.neighbours.length; i++) {
              //  var dist = google.maps.geometry.spherical.computeDistanceBetween(newDistance, this.neighbours[i].position);
               // var values = getValuesFromTable(dist);
                //if (values == -1) {
                    this.neighbours[i].disconnectTarget(this);
                //}
            }
                      
            for (var i = 0; i < this.connectionLines.length; i++) {

                this.connectionLines[i].setMap(null);
            }
            this.connectionLines = [];
            this.neighbours = [];
        },
        calculateEfficiency: function () {

        },
        displayInfoWindow: function () {
            var content = 'ID: ' + this.ID +
                '<br>Latitude: ' + this.position.lat() +
                '<br>Longitude: ' + this.position.lng() +
                '<br>Quantidade de vizinhos: ' + this.neighbours.length;

            infowindow.setContent(content);
            infowindow.open(map, this);
        }

    });
    google.maps.event.addListener(marker, 'click', function (event) {
        if (opMode == "Removal") {
            marker.remove();
            if (meshEnabled)
                connectViaMesh()
        }
        else
           marker.displayInfoWindow();

    });
    google.maps.event.addListener(marker, 'dragstart', function (event) {
        infowindow.setMap(null);
        marker.removeConnections(event.latLng);
        resetMesh();
  //      removeMesh();
    });
    google.maps.event.addListener(marker, 'drag', function (event) {
        
       // marker.removeConnections(event.latLng);
       // marker.connectByDistance(event.latLng);
      //  connectViaMesh();

    });

    google.maps.event.addListener(marker, 'dragend', function (event) {
        marker.setPosition(event.latLng);
        marker.removeConnections(event.latLng);
        marker.connectByDistance(event.latLng);
        if (meshEnabled)
            connectViaMesh();

       
    });
    return marker;
}
function placePole(latitude, longitude) {
    
    var marker = new google.maps.Marker(
	{
	    type: "Pole",
	    position: latLng,
	    map: map,
	    draggable: true,
	    icon: poleIcon,
        zIndex: -1
	});

    preparePoleEvents(marker);
    poles.push(marker);
}
function placeMeter(latitude, longitude) {
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
    //var locations = [];
    //// var markerLocation = latLng;
    //locations.push(latLng);
    //// Create a LocationElevationRequest object using the array's one value
    //var positionalRequest =
	//{
	//    'locations': locations
	//}
    //elevator.getElevationForLocations(positionalRequest, function (results, status) {
    //    if (status == google.maps.ElevationStatus.OK) {
    //        // Retrieve the first result


    //        if (results[0]) {
    //            // Open an info window indicating the elevation at the clicked position
    //            marker.elevation = results[0].elevation;
    //            allMarkers.push(marker);
    //            disconnectedMeters.push(marker);
    //            connectNodesByDistance(marker);
    //            meters.push(marker);
    //            prepareMarkerEvents(marker);
    //            if (meshEnabled)
    //                executeRFMesh();

    //        }
    //        else
    //            return -1;
    //    }
    //    else
    //        return -1;

    //});

    allMarkers.push(marker);
    disconnectedMeters.push(marker);
    connectNodesByDistance(marker);
    meters.push(marker);
    prepareMarkerEvents(marker);
    if (meshEnabled)
        executeRFMesh();
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
    //var locations = [];
    //var markerLocation = latLng;
    //locations.push(markerLocation);
    //// Create a LocationElevationRequest object using the array's one value
    //var positionalRequest =
	//{
	//    'locations': locations
	//}
    //elevator.getElevationForLocations(positionalRequest, function (results, status) {
    //    if (status == google.maps.ElevationStatus.OK)
    //    {
    //        connectNodesByDistance(marker);
    //        // Retrieve the first result
    //        if (results[0]) {
    //            // Open an info window indicating the elevation at the clicked position

    //            calculateEfficiency(marker);
    //            drawCircle(marker);
    //            marker.elevation = results[0].elevation;
    //            allMarkers.push(marker);
    //            daps.push(marker);
    //            prepareMarkerEvents(marker);
    //            if (meshEnabled)
    //                executeRFMesh();
    //        }
    //        else
    //        {
    //            return -1;
    //        }
    //    }
    //    else
    //    {
    //        return -1;
    //    }
    //});
    connectNodesByDistance(marker);
    calculateEfficiency(marker);
    drawCircle(marker);
  //  marker.elevation = results[0].elevation;
    allMarkers.push(marker);
    daps.push(marker);
    prepareMarkerEvents(marker);
    if (meshEnabled)
        executeRFMesh();
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
    //    var locations = [];
    //    var markerLocation = marker.getPosition();
    //    locations.push(markerLocation);
    //    // Create a LocationElevationRequest object using the array's one value
    //    var positionalRequest =
	//	{
	//	    'locations': locations
	//	}
    //    elevator.getElevationForLocations(positionalRequest, function (results, status)
    //    {
    //        if (status == google.maps.ElevationStatus.OK)
    //        {
    //            // Retrieve the first result
    //            if (results[0])
    //            {
    //                marker.elevation = results[0].elevation;
    //            }
    //            else
    //            {
    //                return -1;
    //            }
    //        }
    //        else
    //        {
    //            return -1;
    //        }
    //    });
    });
}
function preparePoleEvents(marker) {
    google.maps.event.addListener(marker, 'click', function (event) {
        if (opMode == "Removal") 
            removePole(marker);
    });
    google.maps.event.addListener(marker, 'dragend', function (event) {
 
        marker.setPosition(event.latLng);
        //var locations = [];
        //var markerLocation = marker.getPosition();
        //locations.push(markerLocation);
        //// Create a LocationElevationRequest object using the array's one value
        //var positionalRequest =
		//{
		//    'locations': locations
		//}
        //elevator.getElevationForLocations(positionalRequest, function (results, status) {
        //    if (status == google.maps.ElevationStatus.OK) {
        //        // Retrieve the first result
        //        if (results[0]) {
        //            marker.elevation = results[0].elevation;
        //        }
        //        else {
        //            return -1;
        //        }
        //    }
        //    else {
        //        return -1;
        //    }
        //});
    });

}
//function getElevation(event)
//{
//    var locations = [];
//    // Retrieve the clicked location and push it on the array
//    var clickedLocation = event.latLng;
//    locations.push(clickedLocation);
//    // Create a LocationElevationRequest object using the array's one value
//    var positionalRequest =
//	{
//	    'locations': locations
//	}
//    // Initiate the location request
//}
/// <reference path="/js/jquery-1.10.2.min.js" />


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


var circles = [];
var request;

var insertListener;
var scenario = "Metropolitan";
var currentTech = "w80211";
var currentIns = "DAP";
var table = [];






function connectNodesByDistance(marker) {

    for (var i = 0; i < allMarkers.length; i++) {
        var dis = distance(marker.position.lat(), marker.position.lng(), allMarkers[i].position.lat(), allMarkers[i].position.lng(), "K");
        //dis = dis*1000;
        var values = getValuesFromTable(dis);

        if (values != -1) {
            if (marker.type != "Meter") {
                connectMarkers(marker, allMarkers[i], values.color);
            }
            else {
                if (allMarkers[i].type != "Meter")
                    connectMarkers(allMarkers[i], marker, values.color);

            }
        }
    }
    if (marker.type != "Meter") {
        if (marker.neighbours.length == 0) {
            marker.setIcon(marker.offIcon);
        }
        else {
            marker.setIcon(marker.onIcon);
        }

    }
    else {
        marker.setIcon(getMeterColor(marker));
    }




}
function distance(lat1, lon1, lat2, lon2, unit) {
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
    var dist = google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
    return dist
}
function findAndRemove(list, obj) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] == obj) {
            list.splice(i, 1);
        }
    }
}
function connectMarkers(marker, marker2, color) {
    if (checkIfConnectionIsPossible(marker, marker2)) {
        marker.neighbours.push(marker2);
        marker2.neighbours.push(marker);
        // Troca o ícone do marker2 para LIGADO já que acabou de acontecer uma ligação
        marker2.connected = true;
        marker.connected = true;
        if (marker2.type == "Meter") {
            marker2.setIcon(getMeterColor(marker2));
            findAndRemove(disconnectedMeters, marker2);

        }
        else
            marker2.setIcon(marker2.onIcon);
        marker.setIcon(marker.onIcon);
        //
        var markers = [marker, marker2];
        markerConnections.push(markers);
        drawLine(marker, marker2, color);
    }
}
function checkIfConnectionIsPossible(marker1, marker2) {
    if (marker1.ID == marker2.ID)
        return false
    else {
        for (i = 0; i < markerConnections.length; i++) {
            if ((markerConnections[i][0].ID == marker1.ID && markerConnections[i][1].ID == marker2.ID) || (markerConnections[i][1].ID == marker1.ID && markerConnections[i][0].ID == marker2.ID))
                return false
        }
    }
    return true;
}


function reconnectMovedMarker(marker, newPosition) {
    for (var i = 0; i < markerConnections.length; i++) {
        for (var j = 0; j < 2; j++) {
            if (markerConnections[i][j].ID == marker.ID) {
                markerConnections[i][j].setPosition(newPosition);
            }
        }
    }

}
function refreshLocation(marker, location) {
    mar.setPosition()
}
function removeMarkerConnections(marker) {


    for (var i = 0; i < markerConnections.length; i++) {
        if (markerConnections[i][0].ID == marker.ID || markerConnections[i][1].ID == marker.ID) {
            //remove da lista de vizinhos
            lines[i].setVisible(false);
            lines.splice(i, 1);
            markerConnections[i][0].neighbours.splice(getMarkerPositionFromNeighbour(markerConnections[i][0], markerConnections[i][1]), 1);
            markerConnections[i][1].neighbours.splice(getMarkerPositionFromNeighbour(markerConnections[i][1], markerConnections[i][0]), 1);

            if (markerConnections[i][0].neighbours.length == 0)
                markerConnections[i][0].connected = false;
            if (markerConnections[i][1].neighbours.length == 0)
                markerConnections[i][1].connected = false;

            if (markerConnections[i][1].neighbours.length == 0 && markerConnections[i][1].type != "Meter") {
                markerConnections[i][1].setIcon(markerConnections[i][1].offIcon);

            }
            if (markerConnections[i][0].neighbours.length == 0 && markerConnections[i][0].type != "Meter") {
                markerConnections[i][0].setIcon(markerConnections[i][0].offIcon);

            }
            if (markerConnections[i][1].type == "Meter") {
                markerConnections[i][1].setIcon(getMeterColor(markerConnections[i][1]));
                disconnectedMeters.push(markerConnections[i][1]);
            }
            if (markerConnections[i][0].type == "Meter") {
                markerConnections[i][0].setIcon(getMeterColor(markerConnections[i][0]));
                disconnectedMeters.push(markerConnections[i][0]);

            }


            markerConnections.splice(i, 1);
            i--;
        }
    }

}
function getMarkerPositionFromNeighbour(marker, marker2) {
    for (i = 0; i < marker.neighbours.length; i++) {
        if (marker2.ID == marker.neighbours[i].ID)
            return i;
    }
    return -1;
}
function removeMarker(marker) {
    removeMarkerConnections(marker);
    infowindow.setMap(null);
    for (var i = 0; i < allMarkers.length; i++) {
        if (allMarkers[i].ID == marker.ID) {
            markerCluster.removeMarker(allMarkers[i]);
            allMarkers[i].setMap(null);
            allMarkers.splice(i, 1);

        }
    }
    for (var i = 0; i < markerConnections.length; i++) {
        if (markerConnections[i][0].ID == marker.ID || markerConnections[i][1].ID == marker.ID) {
            //remove da lista de vizinhos
            lines[i].setVisible(false);
            lines.splice(i, 1);
            markerConnections[i][0].neighbours.splice(getMarkerPositionFromNeighbour(markerConnections[i][0], markerConnections[i][1]), 1);
            markerConnections[i][1].neighbours.splice(getMarkerPositionFromNeighbour(markerConnections[i][1], markerConnections[i][0]), 1);
            markerConnections.splice(i, 1);
            i--;
        }
    }
    removeMarkerCircles(marker);
}


function displayInfoWindow(marker) {

    var neighboursIDs = "";
    for (var i = 0; i < marker.neighbours.length; i++) {
        neighboursIDs += marker.neighbours[i].ID + ", ";
    }
    var content = 'ID: ' + marker.ID + '<br>Latitude: ' + marker.position.lat() + '<br>Longitude: ' + marker.position.lng() + '<br>Elevation: ' + marker.elevation + '<br>Neighbours IDs: ' + neighboursIDs + '<br>Connected: ' + marker.connected;
    if (marker.type == "Meter")
        content += '<br>Hop: ' + marker.meshHop;
    if (marker.teleTech != null)
        content += '<br>Technology: ' + marker.teleTech + '<br>Reach: ' + marker.reach + ' meters';
    infowindow.setContent(content);
    infowindow.open(map, marker);

}
function getMeterColor(meter) {
    //ESTA FUNÇÃO NÃO ESTÁ OTIMIZADA!!!!!!!!!!!!!!!!!!!
    var color = -1
    for (i = 0; i < meter.neighbours.length; i++) {
        var dis = distance(meter.position.lat(), meter.position.lng(), meter.neighbours[i].position.lat(), meter.neighbours[i].position.lng(), "K");
        dis = dis;
        var positions = getCircleColorPositions();
        if (dis < positions.med1) {
            if (color > 1 || color == -1)
                color = 1;
        }
        else
            if (dis < positions.med2) {
                if (color > 2 || color == -1)
                    color = 2;

            }
            else
                if (color == -1)
                    color = 3;

    }
    if (color == 1)
        return "greenSquare.png";
    else
        if (color == 2)
            return "yellowSquare.png";

        else
            if (color == 3)
                return "redSquare.png";
            else
                return "blackSquare.png";


}



//GETTERS AND SETTERS-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function getValuesFromTable(dist) {
    //var rounddist = Math.round(dist);
    if (dist > table[table.length - 1]) {
        return -1;
    }

    for (var i = 0; i < table.length - 1 ; i++) {
        if (table[i].distance <= dist && dist < table[i + 1].distance) {
            return table[i + 1];
        }
    }
    return -1;
}

function createTableFromOptions() {
    if (currentTech == "w80211") {
        var wifitable = [];
        //de 0 a 100 metros
        for (var i = 0; i <= 100 ; i += 5) {
            var dist = i;
            var sp = shadowingPropagation(i);
            var c;
            if (sp >= 0.98)
                c = "GREEN";
            else if (0.95 <= sp && sp < 0.98)
                c = "YELLOW";
            else
                c = "RED";


            if (sp >= 0.9) {
                var value =
				{
				    distance: dist,
				    efficiency: sp,
				    color: c

				}
                wifitable.push(value);
            }
            else {
                break;
            }
        }
        table = wifitable;
    }
    if (currentTech == "ZigBee") {

    }
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


function setInsertionOptions(type) {
    currentIns = type;
    insertListener.remove();
    google.maps.event.removeListener(insertListener);
    insertListener = google.maps.event.addListener(map, 'click', function (event) {
        if (getOpMode() == "Insertion") {
            if (type == "DAP") {
                placeDAP(event.latLng.lat(), event.latLng.lng(), currentTech);
            }
            if (type == "Meter")
                placeMeter(event.latLng.lat(), event.latLng.lng());


        }

    });
}
function fetchReach(tech, scenario, dbm) {
    return loadReachFromTable(tech, scenario, dbm)


}
function executeRFMesh() {
    removeMesh();
    connectViaMesh();
}
function setRFMesh() {
    meshEnabled = !meshEnabled;
    if (meshEnabled)
        executeRFMesh();
    else
        removeMesh();
}
function removeMesh() {
    disconnectedMeters = [];
    for (var i = 0; i < dashedLines.length; i++) {
        dashedLines[i].setMap(null);
    }
    for (var i = 0; i < allMarkers.length; i++) {
        if (allMarkers[i].type == "Meter")
            allMarkers[i].meshHop = 0;
        if (!allMarkers[i].connected)
            disconnectedMeters.push(allMarkers[i]);
    }
    dashedLines = [];
}
function connectViaMesh() {

    //ALTERAR PARA 3 'FOR' UM DENTRO DO OUTRO!!!
    //PARA CADA METER DESCONECTADO
    var disMeters = disconnectedMeters.slice();
    var hopMeters = [];
    for (var i = 0; i < disMeters.length ; i++) {
        //PEGA O METER MAIS PRÓXIMO QUE ESTÁ CONECTADO A UM DAP E FAZ UMA LIGAÇÃO MESH SE POSSÍVEL
        var meterToConnect;
        var finalDis = -1;
        for (var j = 0; j < allMarkers.length ; j++) {
            if (allMarkers[j].type == "Meter" && allMarkers[j].connected == true) {
                if (finalDis == -1) {
                    finalDis = distance(disMeters[i].position.lat(), disMeters[i].position.lng(), allMarkers[j].position.lat(), allMarkers[j].position.lng(), "K");
                    meterToConnect = allMarkers[j];
                }
                else {
                    var dist = distance(disMeters[i].position.lat(), disMeters[i].position.lng(), allMarkers[j].position.lat(), allMarkers[j].position.lng(), "K");
                    if (dist < finalDis) {
                        finalDis = dist;
                        meterToConnect = allMarkers[j];
                    }

                }
            }
        }
        var values = getValuesFromTable(finalDis);
        if (values != -1) {
            drawDashedLine(disMeters[i], meterToConnect, values.color)
            findAndRemove(disconnectedMeters, disMeters[i]);
            disMeters[i].meshHop = 1;
            hopMeters.push(disMeters[i]);
        }
    }
    //SEGUNDA PASSADA, PARA OS NÓS QUE NÃO SE CONECTARAM AOS OUTROS COM APENAS 1 SALTO
    disMeters = disconnectedMeters.slice();
    var newHopMeters = [];
    for (var i = 0; i < disMeters.length; i++) {
        var meterToConnect;
        var finalDis = -1;
        for (j = 0; j < hopMeters.length; j++) {
            if (hopMeters[j].meshHop == 1) {
                if (finalDis == -1) {
                    finalDis = distance(disMeters[i].position.lat(), disMeters[i].position.lng(), hopMeters[j].position.lat(), hopMeters[j].position.lng(), "K");
                    meterToConnect = hopMeters[j];
                }
                else {
                    var dist = distance(disMeters[i].position.lat(), disMeters[i].position.lng(), hopMeters[j].position.lat(), hopMeters[j].position.lng(), "K");
                    if (dist < finalDis) {
                        finalDis = dist;
                        meterToConnect = hopMeters[j];
                    }

                }
            }
        }
        var values = getValuesFromTable(finalDis);
        if (values != -1) {
            drawDashedLine(disMeters[i], meterToConnect, values.color)
            findAndRemove(disconnectedMeters, disMeters[i]);
            disMeters[i].meshHop = 2;
            newHopMeters.push(disMeters[i]);
        }
    }
    hopMeters = newHopMeters;
    disMeters = disconnectedMeters.slice();
    //var newHopMeters = [];
    for (var i = 0; i < disMeters.length; i++) {
        var meterToConnect;
        var finalDis = -1;
        for (j = 0; j < hopMeters.length; j++) {
            if (hopMeters[j].meshHop == 2) {
                if (finalDis == -1)
                {
                    finalDis = distance(disMeters[i].position.lat(), disMeters[i].position.lng(), hopMeters[j].position.lat(), hopMeters[j].position.lng(), "K");
                    meterToConnect = hopMeters[j];
                }
                else
                {
                    var dist = distance(disMeters[i].position.lat(), disMeters[i].position.lng(), hopMeters[j].position.lat(), hopMeters[j].position.lng(), "K");
                    if (dist < finalDis)
                    {
                        finalDis = dist;
                        meterToConnect = hopMeters[j];
                    }

                }
            }
        }
        var values = getValuesFromTable(finalDis);
        if (values != -1) {
            drawDashedLine(disMeters[i], meterToConnect, values.color)
            findAndRemove(disconnectedMeters, disMeters[i]);
            disMeters[i].meshHop = 3;
            //newHopMeters.push(disMeters[i]);	
        }
    }
}

function setInfoWindowNull() {
    infowindow.setMap(null);
}
function getAllMarkers() {
    return allMarkers;
}
function setDapsToTechnology() {
    for (i = 0 ; i < daps.length; i++) {
        /*if(mode == "ZigBee")
		{
			daps[i].teleTech = "ZigBee";

		}
		if(mode == "80211")
		{
			daps[i].teleTech = "80211";
		}*/
        daps[i].teleTech = currentTech;
        daps[i].reach = fetchReach(currentTech, scenario, dbm);
    }
    drawRefresh();
}

function setScenario(sce) {
    scenario = sce;
    setDapsToTechnology();
}


function getCurrentTech() {
    return currentTech;
}
function setCurrentTech(tech) {
    currentTech = tech;
}
function setdbm(d) {
    dbm = d;
    setDapsToTechnology();

}
function getConfigurations() {
    if (opMode == "Removal")
        var mode = "Mode: " + opMode;
    else
        var mode = "Mode: " + currentIns + " " + opMode;
    if (currentTech == "w80211")
        var tech = "<br>Technology: " + 802.11;
    else
        var tech = "<br>Technology: " + currentTech;
    var power;
    switch (dbm) {
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
    var power = "<br>Power: " + power;
    var sce = "<br>Scenario: " + scenario;

    return mode + tech + power + sce;
}

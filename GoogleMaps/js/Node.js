
var DAPLIMIT = 20;
var METERLIMIT = 5;

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};
function teste() {
    for (var i = 0; i < daps.length; i++)
        daps[i].connectByDistanceMesh();
    
}
function connectViaMeshTeste() {
    resetMesh();
    //for (var i = 0; i < meters.length; i++) {
    //    if (!meters[i].connected)
    //        meters[i].connectViaMesh();
    //}
    var connectedMeters = meters.filter(function (item) {
        return (item.connected == true);
    });

    for (var i = 0; i < 1; i++) {
        for (var j = 0 ; j < meters.length; j++) {
            if(!meters[j].connected)
                meters[j].connectViaMesh(connectedMeters);
        }
        connectedMeters = meters.filter(function (item) {
            return (item.connected == true && connectedMeters.indexOf(item) < 0);
        });

    }


}
function connectViaMesh() {
    resetMesh();
    for (var i = 0; i < daps.length; i++) {
        
        daps[i].connectByDistanceMesh();
    }
       
    //var connectedMeters = meters.filter(function (item) {
    //    return (item.connected == true);
    //});
    //var aux = [];
    //for (var i = 0; i < meshMaxJumps; i++) {
    //    for (var j = 0 ; j < meters.length; j++) {
    //        if (!meters[j].connected)
    //            meters[j].meshConnect2(connectedMeters);
    //    }
    //    connectedMeters = meters.filter(function (item) {
    //        return (item.connected == true && connectedMeters.indexOf(item) < 0);
    //    });
    //}

    //NOVA MESH
    //1) SELECIONAR OS MEDIDORES CONECTADOS POSSÍVEIS (DAP NÃO ESTÁ CHEIO, MEDIDORES CONECTADOS NÃO ESTAO CHEIOS)
    //2) ORDENAR OS MEDIDORES CONECTADOS POR ORDEM DE VANTAGEM (DAPS MENOS CARREGADOS, MEDIDORES MENOS CARREGADOS)
    //3) CONECTAR AO MELHOR CANDIDATO
    //4) CASO
}

function resetMesh() {

    for (var i = 0; i < daps.length; i++) {
        daps[i].removeMeshConnections();
    }
}


function createPole() {
    var marker = new google.maps.Marker({
            type: "Pole",
            position: null,
            map: map,
            draggable: true,
            icon: poleIcon,
            zIndex: 0,
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
        zIndex: 2,
        connected: false,
        draggable: true,
        load: 0,

//        meshConnectionLines: [],
        icon: meterOffIconImage,
//        dapsConnected: [],
        neighbours: [],
        meshNeighbours: [],
        place: function (latitude, longitude) {
            
            var latLng = new google.maps.LatLng(latitude, longitude);
            this.position = latLng;
            meters.push(this);
            markerCluster.addMarker(this, true);
            this.ID = generateUUID();
            resetMesh();
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
            //for (var i = 0; i < this.dapsConnected.length; i++) {
            //    if (this.dapsConnected[i].ID == target.ID) {
            //        this.dapsConnected.splice(i, 1);
            //        break;
            //    }
            //}
            this.neighbours.push(target);
            //this.dapsConnected.push(target);
            this.connected = true;
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
            //for (var i = 0; i < this.dapsConnected.length; i++) {
            //    if (this.dapsConnected[i].ID == target.ID) {
            //        this.dapsConnected.splice(i, 1);
            //        break;
            //    }
            //}
            this.changeMeterColor();
        },

        connectByDistance: function (newDistance) {
            for (var i = 0; i < daps.length; i++) {
                var dist = google.maps.geometry.spherical.computeDistanceBetween(newDistance, daps[i].position);
                var values = getValuesFromTable(dist);
                if (values != -1 ) {

                    // this.connect(daps[i], values.color);
                        daps[i].removeConnections(daps[i].getPosition());
                        daps[i].connectByDistance(daps[i].getPosition());

                           
                }
            }                 
        },
        removeConnections: function (newDistance) {
            for (var i = 0; i < this.neighbours.length; i++) {
                    this.neighbours[i].disconnectTarget(this);
            }
            this.neighbours = [];
            this.changeMeterColor();

        },
        displayInfoWindow: function () {
            var content = 'ID: ' + this.ID +
                '<br>Latitude: ' + this.position.lat() +
                '<br>Longitude: ' + this.position.lng() +
                '<br>Quantidade de vizinhos: ' + this.neighbours.length +
                '<br>Carga: ' + this.load +
                '<br>Conectado?: ' + this.connected;
                
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
        if (meshEnabled)
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
    var marker = new MarkerWithLabel({
        ID: null,
        type: "DAP",
        position: null,
        map: map,
        zIndex: 1,
        draggable: true,
        icon: dapOnIconImage,
        coveredMeters: 0,
        neighbours: [],
        connectionLines: [],
        meshMeters: [],
        labelContent: "0",
        labelAnchor: new google.maps.Point(22,25),
        labelClass: "labels", // the CSS class for the label
        labelStyle: { opacity: 0.75 },
        place: function (latitude, longitude) {
            var latLng = new google.maps.LatLng(latitude, longitude);
            this.position = latLng;
            daps.push(this);
            markerCluster.addMarker(this, true);
            this.ID = generateUUID();
            resetMesh();
            this.removeConnections(this.getPosition());
            this.connectByDistance(this.getPosition());
            if (meshEnabled)
                connectViaMesh();
            calculateEfficiency(marker);

        },
        remove: function () {
            var dap = this;
            daps = daps.filter(function (item) {
                return (item.ID != dap.ID);
            });
            this.setMap(null);
            markerCluster.removeMarker(this, true);
            //for (var i = 0; i < this.connectionLines.length; i++) {
            //    this.connectionLines[i].setMap(null);
            //}
            //for (var i = 0; i < this.neighbours.length; i++) {
            //    this.neighbours[i].disconnectTarget(this);
            //}
            this.removeConnections();
            this.removeMeshConnections();
       //     this.connectionLines = [];
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
            if (target.type == "Meter")
                this.coveredMeters--;
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
        connectByDistance: function () {
   
            //var toCover = [];
            //var allMarkers = meters.concat(daps);
            //for (var i = 0; i < allMarkers.length; i++) {
            //    var dist = google.maps.geometry.spherical.computeDistanceBetween(newDistance, allMarkers[i].position);
            //    var values = getValuesFromTable(dist);
            //    if (values != -1 && this.ID != allMarkers[i].ID) {
            //        var toAdd = {
            //            marker: allMarkers[i],
            //            distance: dist,
            //            value: values
            //        };
            //        toCover.push(toAdd);
            //    }
            //}

            //toCover = toCover.sort(function (a, b) { return a.distance - b.distance });
            var toCover = this.normalCoverage();
            for (var i = 0; i < toCover.length; i++) {
               // var dist = google.maps.geometry.spherical.computeDistanceBetween(newDistance, allMarkers[i].position);
               // var values = getValuesFromTable(dist);
                //  if (values != -1 && this.ID != allMarkers[i].ID) {
                
                    
                    if (toCover[i].marker.type == "DAP") {
                        this.connect(toCover[i].marker, toCover[i].value.color);
                        toCover[i].marker.connect(this, toCover[i].value.color);
                    }
                    else {
                        if (this.coveredMeters < DAPLIMIT) {
                            this.connect(toCover[i].marker, toCover[i].value.color);
                            toCover[i].marker.connect(this);
                            this.coveredMeters++;                    
                        }                        
                    }
              //  }
            }
        },
        meshConnect: function (mesh,target, color) {
            //     if (source) {
            var lineSymbol = {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 3
            };
            var meterPositions = [mesh.getPosition(), target.getPosition()];
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
            var meshToAdd  = {
                mesh: mesh,
                target: target,
                meshLine: routerPath
            }
            
                this.meshMeters.push(meshToAdd);
            
               
           
            routerPath.setMap(map);
            this.propagateMeshLoad(target);
            //this.meshConnectionLines.push(routerPath);
            
            //    }
            //  else {
            target.changeIcon(meterMeshIconImage);
            //   }
            //this.meshNeighbours.push(target);
            this.coveredMeters++;
            try {
           // mesh.meshNeighbours.push(this);
            }
            catch (err) {
                var wow = "doge";
            }
            target.connected = true;
        },
        propagateMeshLoad: function (meter) {
            var m = meter;
            var parent = this.meshMeters.filter(function (item) {
                return item.target.ID == m.ID;
            });
            while (parent.length != 0) {              
                parent[0].mesh.load++;
                m = parent[0].mesh;
                var parent = this.meshMeters.filter(function (item) {
                    return item.target.ID == m.ID;
                });
            }
            

        },
        meterIsOverloaded: function (meter) {
            if (meter.load >= METERLIMIT)
                return true;
            else {          
                var m = meter;
                var parent = this.meshMeters.filter(function (item) {
                    return item.target.ID == m.ID;
                });
                while (parent.length != 0) {
                    //parent[0].mesh.load++;
                    if (parent[0].mesh.load >= METERLIMIT)
                        return true;
                    m = parent[0].mesh;
                    var parent = this.meshMeters.filter(function (item) {
                        return item.target.ID == m.ID;
                    });
                }
                return false;
            }
            return false;
        },
        normalCoverage: function(){
            var toCover = [];
            var allMarkers = meters.concat(daps);
            for (var i = 0; i < allMarkers.length; i++) {
                var dist = google.maps.geometry.spherical.computeDistanceBetween(this.getPosition(), allMarkers[i].position);
                var values = getValuesFromTable(dist);
                if (values != -1 && this.ID != allMarkers[i].ID) {
                    var toAdd = {
                        marker: allMarkers[i],
                        distance: dist,
                        value: values
                    };
                    toCover.push(toAdd);
                }
            }

            toCover = toCover.sort(function (a, b) { return a.distance - b.distance });
            var ret = [];
            var coveredMeters = 0;
            for (var i = 0; i < toCover.length; i++) {
                if (toCover[i].marker.type == "DAP") {
                      ret.push(toCover[i]);
              //      this.connect(toCover[i].marker, toCover[i].value.color);
              //      toCover[i].marker.connect(this, values.color);
                }
                else {
                    if (coveredMeters < DAPLIMIT) {
                     //   this.connect(toCover[i].marker, toCover[i].value.color);
                        //   toCover[i].marker.connect(this);
                        ret.push(toCover[i]);
                        coveredMeters++;
                    }
                }
            }
            return ret;
        },
        meshCoverage: function(){
            var aux = this.neighbours;
            var ret = [];

            for (var k = 0; k < meshMaxJumps; k++) {

                var disconnectedMeters = meters.filter(function (item) {
                    return (item.connected != true);
                });
                var mesh = [];
                for (var i = 0; i < aux.length; i++) {
                    for (var j = 0; j < disconnectedMeters.length; j++) {
                        var dist = google.maps.geometry.spherical.computeDistanceBetween(aux[i].getPosition(), disconnectedMeters[j].getPosition());
                        var distToDap = google.maps.geometry.spherical.computeDistanceBetween(this.getPosition(), disconnectedMeters[j].position);
                        var values = getValuesFromTable(dist);
                        if (values != -1) {
                            var toAdd = {
                                marker: disconnectedMeters[j],
                                mesh: aux[i],
                                distance: dist,
                                distanceToDap: distToDap,
                                value: values
                            };
                            var found = false;
                            for (var z = 0; z < mesh.length; z++)
                                if (mesh[z].marker == toAdd.marker) {
                                    found = true;
                                    if (mesh[z].distance > toAdd.distance)
                                        mesh[z] = toAdd;
                                }
                            if (!found)
                                mesh.push(toAdd);
                        }
                    }
                }
                mesh.sort(function (a, b) { return a.distanceToDap - b.distanceToDap });
                aux = [];
                for (var i = 0; i < mesh.length && this.coveredMeters < DAPLIMIT; i++) {
                    //this.coveredMeters++;
                    if (!this.meterIsOverloaded(mesh[i].mesh)) {
                        ret.push(mesh[i]);
                        //this.meshConnect(mesh[i].mesh, mesh[i].marker, mesh[i].value.color)
                        //mesh[i].marker.meshConnect(mesh[i].mesh, mesh[i].value.color);
                        aux.push(mesh[i].marker);
                    }


                }
            }
            return ret;
        },
        calculateCoverage: function() {
            if(meshEnabled){

            }
            else{

            }
        },
        connectByDistanceMesh: function () {

            var aux = this.neighbours;
            

            for (var k = 0; k < meshMaxJumps; k++) {

                var disconnectedMeters = meters.filter(function (item) {
                    return (item.connected != true);
                });
                var mesh = [];
                for (var i = 0; i < aux.length; i++) {                    
                        for (var j = 0; j < disconnectedMeters.length; j++) {
                            var dist = google.maps.geometry.spherical.computeDistanceBetween(aux[i].getPosition(), disconnectedMeters[j].getPosition());
                            var distToDap = google.maps.geometry.spherical.computeDistanceBetween(this.getPosition(), disconnectedMeters[j].position);
                            var values = getValuesFromTable(dist);
                            if (values != -1) {
                                var toAdd = {
                                    marker: disconnectedMeters[j],
                                    mesh: aux[i],
                                    distance: dist,
                                    distanceToDap: distToDap,
                                    value: values
                                };
                                var found = false;
                                for (var z = 0; z < mesh.length; z++)
                                    if (mesh[z].marker == toAdd.marker) {
                                        found = true;
                                        if (mesh[z].distance > toAdd.distance)
                                            mesh[z] = toAdd;
                                    }
                                if (!found)
                                    mesh.push(toAdd);
                            }
                        }                                       
                }
                mesh.sort(function (a, b) { return a.distanceToDap - b.distanceToDap });
                aux = [];
                for (var i = 0; i < mesh.length && this.coveredMeters < DAPLIMIT; i++) {
                    //this.coveredMeters++;
                    if (!this.meterIsOverloaded(mesh[i].mesh)) {
                        this.meshConnect(mesh[i].mesh, mesh[i].marker, mesh[i].value.color)
                        //mesh[i].marker.meshConnect(mesh[i].mesh, mesh[i].value.color);
                        aux.push(mesh[i].marker);
                    }
                        
                    
                }
            }           
        },
        removeMeshConnections: function () {
            this.coveredMeters -= this.meshMeters.length;
            for (var i = 0; i < this.meshMeters.length; i++) {
                this.meshMeters[i].meshLine.setMap(null);
                this.meshMeters[i].mesh.meshNeighbours = [];
                this.meshMeters[i].mesh.load = 0;
                this.meshMeters[i].target.changeIcon(meterOffIconImage);
                this.meshMeters[i].target.connected = false;
                
            }
            this.meshMeters = [];
            
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
            this.coveredMeters = 0;
        },
        calculateEfficiency: function () {

        },
        refresh: function () {
            if (meshEnabled)
                resetMesh();
            this.removeConnections(this.getPosition());
            this.connectByDistance(this.getPosition());
            if (meshEnabled)
                this.connectByDistanceMesh();
        },
        displayInfoWindow: function () {
            var content = 'ID: ' + this.ID +
                '<br>Latitude: ' + this.position.lat() +
                '<br>Longitude: ' + this.position.lng() +
                '<br>Medidores cobertos: ' + this.neighbours.length +
                '<br>Medidores em mesh: ' + this.meshMeters.length;

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
        if(meshEnabled)
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
        marker.connectByDistance();
        calculateEfficiency(marker);
        if (meshEnabled)
            connectViaMesh();

       
    });
    return marker;
}


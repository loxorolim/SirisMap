
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

    //NOVA MESH
    //1) SELECIONAR OS MEDIDORES CONECTADOS POSSÍVEIS (DAP NÃO ESTÁ CHEIO, MEDIDORES CONECTADOS NÃO ESTAO CHEIOS)
    //2) ORDENAR OS MEDIDORES CONECTADOS POR ORDEM DE VANTAGEM (DAPS MENOS CARREGADOS, MEDIDORES MENOS CARREGADOS)
    //3) CONECTAR AO MELHOR CANDIDATO
    //4) CASO
}
function connectViaMesh() {
    resetMesh();
    teste();
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
        meshConnectionLines: [],
        icon: meterOffIconImage,
        dapsConnected: [],
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
            for (var i = 0; i < this.meshConnectionLines.length; i++) {
                this.meshConnectionLines[i].setMap(null);
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
            for (var i = 0; i < this.dapsConnected.length; i++) {
                if (this.dapsConnected[i].ID == target.ID) {
                    this.dapsConnected.splice(i, 1);
                    break;
                }
            }
            this.neighbours.push(target);
            this.dapsConnected.push(target);
            
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
            for (var i = 0; i < this.dapsConnected.length; i++) {
                if (this.dapsConnected[i].ID == target.ID) {
                    this.dapsConnected.splice(i, 1);
                    break;
                }
            }
            this.changeMeterColor();
        },

        meshConnect: function (target, color) {
       //     if (source) {
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
        //    }
          //  else {
                this.changeIcon(meterMeshIconImage);
         //   }
                //this.meshNeighbours.push(target);
                target.meshNeighbours.push(this);
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
        meshConnect2: function (connectedMeters) {
            var closest = -1;
            var minDist = -1;
            var color = null;
            //var connectedMeters = meters.filter(function (item) {
            //    return (item.connected == true);
            //});
            for (var i = 0; i < connectedMeters.length; i++) {
                // if (connectedMeters[i].connected) {
                var dist = google.maps.geometry.spherical.computeDistanceBetween(this.getPosition(), connectedMeters[i].getPosition());
                var distToDap = google.maps.geometry.spherical.computeDistanceBetween(this.getPosition(), connectedMeters[i].dapsConnected[0].getPosition());
                var values = getValuesFromTable(dist);
                if ((values != -1) && (distToDap < minDist || minDist == -1) && (connectedMeters[i].dapsConnected[0].coveredMeters < DAPLIMIT)) {
                    minDist = distToDap;
                    closest = i;
                    color = values.color;
                    //this.meshConnect(meters[i], true, values.color);
                    //meters[i].meshConnect(this, false);
                }
                //  }
            }
            if (closest != -1) {
                this.meshConnect(connectedMeters[closest], color);
            }
        },
        connectViaMesh: function (connectedMeters) {
            var candidatesToConnect = [];

            for (var i = 0; i < connectedMeters.length; i++) { // PEGA OS MEDIDORES QUE ESTÃO CONECTADOS E EM DISTANCIA VÁLIDA
                if (connectedMeters[i].dapsConnected[0].coveredMeters < DAPLIMIT && connectedMeters[i].meshNeighbours.length < METERLIMIT) { //POR ENQUANTO NÃO LEVA EM CONSIDERAÇÃO SE UM MEDIDOR ESTÁ CONECTADO A DOIS DAPS
                    var dist = google.maps.geometry.spherical.computeDistanceBetween(this.getPosition(), connectedMeters[i].position);
                    var values = getValuesFromTable(dist);
                    if (values != -1 ) {
                        var toAdd = {
                            marker: connectedMeters[i],
                            distance: dist,
                            value: values,
                            dapLoad: connectedMeters[i].dapsConnected[0].coveredMeters,
                            meterLoad: connectedMeters[i].meshNeighbours.length
                        };
                        candidatesToConnect.push(toAdd);
                    }
                }       
            }
            if (candidatesToConnect.length > 0) {
                var best = candidatesToConnect[0];
                for (var i = 1; i < candidatesToConnect.length; i++) {// BUSCA O MELHOR CANDIDATO
                    if (candidatesToConnect[i].dapLoad < best.dapLoad) 
                        best = candidatesToConnect[i];                 
                    else if (candidatesToConnect[i].dapLoad == best.dapLoad) 
                        if(candidatesToConnect[i].meterLoad < best.meterLoad)
                            best = candidatesToConnect[i]
                        else if (candidatesToConnect[i].meterLoad == best.meterLoad) 
                            if (candidatesToConnect[i].distance < best.distance)
                                best = candidatesToConnect[i];                    
                }
                this.dapsConnected.push(best.marker.dapsConnected[0]);
                this.meshConnect(best.marker, best.value.color);
                //var aux = [];
                //var leastLoad = candidatesToConnect[0].dapLoad;
                //for (var i = 0; i < candidatesToConnect.length; i++) {
                //    if (candidatesToConnect[i].dapLoad == leastLoad) 
                //        aux.push(candidatesToConnect[i])
                //    if (candidatesToConnect[i].dapLoad < leastLoad) {
                //        leastLoad = candidatesToConnect[i].dapLoad;
                //        aux = [];
                //        aux.push(candidatesToConnect[i]);
                //    }
                //}
               
            }

            //for (var i = 0; i < meters.length; i++) {
            //    if (!meters[i].connected) {
            //        var dist = google.maps.geometry.spherical.computeDistanceBetween(this.getPosition(), meters[i].getPosition());
            //        var values = getValuesFromTable(dist);
            //        if (values != -1) {
            //            this.meshConnect(meters[i], true, values.color);
            //            meters[i].meshConnect(this, false);
            //        }
            //    }
            //}
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
                '<br>Quantidade de vizinhos: ' + this.neighbours.length +
                '<br>Carga: ' + this.meshNeighbours.length;
                
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
        connectByDistance: function (newDistance) {
   
            var toCover = [];
            var allMarkers = meters.concat(daps);
            for (var i = 0; i < allMarkers.length; i++) {
                var dist = google.maps.geometry.spherical.computeDistanceBetween(newDistance, allMarkers[i].position);
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
            
            for (var i = 0; i < toCover.length; i++) {
               // var dist = google.maps.geometry.spherical.computeDistanceBetween(newDistance, allMarkers[i].position);
               // var values = getValuesFromTable(dist);
                //  if (values != -1 && this.ID != allMarkers[i].ID) {
                
                    
                    if (toCover[i].marker.type == "DAP") {
                        this.connect(toCover[i].marker, toCover[i].value.color);
                        toCover[i].marker.connect(this, values.color);
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
        connectByDistanceMesh: function () {
            var aux = this.neighbours;
            var disconnectedMeters = meters.filter(function (item) {
                return (item.connected != true);
            });

            for (var k = 0; k < meshMaxJumps; k++) {


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
                            if(!found)
                                mesh.push(toAdd);
                        }
                    }
                }
                mesh.sort(function (a, b) { return a.distanceToDap - b.distanceToDap });
                aux = [];
                for (var i = 0; i < mesh.length && this.coveredMeters < DAPLIMIT; i++) {
                    this.coveredMeters++;
                    mesh[i].marker.meshConnect(mesh[i].mesh, mesh[i].value.color);
                    aux.push(mesh[i].marker);
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
            this.coveredMeters = 0;
        },
        calculateEfficiency: function () {

        },
        refresh: function() {
            this.removeConnections(this.getPosition());
            this.connectByDistance(this.getPosition());
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
        marker.connectByDistance(event.latLng);
        calculateEfficiency(marker);
        if (meshEnabled)
            connectViaMesh();

       
    });
    return marker;
}


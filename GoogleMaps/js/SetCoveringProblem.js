var DAPLimit = 20; // Cada DAP só pode atender 20 medidores
var MeterLimit = 5; // Cada Medidor só aguentar até 5 medidores em MESh


function createScpMatrixes() {
    var points = metersToPoints(meters);
    var electricPoles = [];
    for (var i = 0 ; i < poles.length ; i++) {
        electricPoles.push(latLngToPoint(poles[i].position));
    }
    var r = getDapMaximumReach();
    var cM = [];
    var sM = [];
    for (var i = 0; i < points.length; i++) {
        var newArray = [];
        sM.push(newArray);
    }
    for (var i = 0 ; i < electricPoles.length ; i++) {
        var pointsCovered = [];
        for (var j = 0; j < points.length; j++)
            if (covers(electricPoles[i], points[j], r)){
                pointsCovered.push(j);
                sM[j].push(i);

            }
        cM.push(pointsCovered);
    }
    var scpMatrixes = ({
        scpMatrix: sM,
        coverageMatrix: cM 
    });
    return scpMatrixes;
}
function createCoverageMatrix(points) {
    
    var electricPoles = [];
    for (var i = 0 ; i < poles.length ; i++) {
        electricPoles.push(latLngToPoint(poles[i].position));
    }
    var r = getDapMaximumReach();
    var cM = [];
    for (var i = 0 ; i < electricPoles.length ; i++) {
        var pointsCovered = [];
        for (var j = 0; j < points.length; j++)
            if (covers(electricPoles[i], points[j], r)) {
                pointsCovered.push(j);
            }
        cM.push(pointsCovered);
    }

    return cM;
}
function createMeshScpMatrixes() {
 //   var Matrixes = createScpMatrixes();
    //   var scpMatrix = Matrixes.scpMatrix;
    var points = metersToPoints(meters);
    var sM = [];
    var cM = createCoverageMatrix(points);
    var neighbourMatrix = createMeterNeighbourhoodMatrix();

    for (var i = 0; i < points.length; i++) {
        var newArray = [];
        sM.push(newArray);
    }

  //  var added = [];
    //  var s = coverageMatrix[pos].length; //OS MEDIDORES QUE O DAP EM POS SATISFAZ
    for (var k = 0; k < cM.length; k++) {
        var added = [];
        var neighbours = cM[k];
        for (var i = 0; i < meshMaxJumps + 1; i++) {
            var newNeighbourhood = [];
            for (var j = 0 ; j < neighbours.length; j++) {
                added.push(neighbours[j]);
                newNeighbourhood = newNeighbourhood.concat(neighbourMatrix[neighbours[j]]);
            }
            neighbours = newNeighbourhood.filter(function (elem, pos) {
                return newNeighbourhood.indexOf(elem) == pos;
            });
        }
        added = added.filter(function (elem, pos) {
            return added.indexOf(elem) == pos; mes
        });
        cM[k] = cM[k].concat(added);
        cM[k] = cM[k].filter(function (elem, pos) {
            return cM[k].indexOf(elem) == pos;
        });
        for (var l = 0; l < cM[k].length; l++) {
            sM[cM[k][l]].push(k);
        }
    }
    var scpMatrixes = ({
        scpMatrix: sM,
        coverageMatrix: cM
    });
    return scpMatrixes;





}
//function createMeshCoverageMatrix() {
//    var points = metersToPoints(meters);
//    var electricPoles = [];
//    var neighbourMatrix = createMeterNeighbourhoodMatrix();
//    for (var i = 0 ; i < poles.length ; i++) {
//        electricPoles.push(latLngToPoint(poles[i].position));
//    }
//    var r = getDapMaximumReach();
//    var cM = [];

//    for (var i = 0; i < electricPoles.length; i++) {
//        var pointsCovered = [];

//    }
//}
//function meshCovers(c,pt,r,pos,neighbourMatrix) {

//    if (covers(c, pt, r))
//        return true;
//    // var meshMaxJumps = 3;
////    var added = [];
//    //  var s = coverageMatrix[pos].length; //OS MEDIDORES QUE O DAP EM POS SATISFAZ
//    var neighbours = neighbourMatrix[pos];
//    for (var i = 0; i < meshMaxJumps; i++) {
//        var newNeighbourhood = [];
//        for (var j = 0 ; j < neighbours.length; j++) {
//            if (covers(c, neighbours[j]))
//                return true;
//            else
// //              added.push(neighbours[j]);
//                  newNeighbourhood = newNeighbourhood.concat(neighbourMatrix[neighbours[j]]);
//        }
//        neighbours = newNeighbourhood.filter(function (elem, pos) {
//            return newNeighbourhood.indexOf(elem) == pos;
//        });


//    }
//    return false;
//    //added = added.filter(function (elem, pos) {
//    //    return added.indexOf(elem) == pos; mes
//    //});


////        var latlng = pointToLatLng(pt, meters);
////        var latlng2 = pointToLatLng(c, meters);
////        return (google.maps.geometry.spherical.computeDistanceBetween(latlng, latlng2) <= r)
    
//}
////function connectViaMesh() {
////    resetMesh();
////    var connectedMeters = meters.filter(function (item) {
////        return (item.connected == true);
////    });
////    var aux = [];
////    for (var i = 0; i < meshMaxJumps; i++) {
////        for (var j = 0; j < connectedMeters.length; j++) {
////            connectedMeters[j].connectViaMesh();
////            aux = aux.concat(connectedMeters[j].meshNeighbours);
////        }
////        connectedMeters = aux;
////        aux = [];
////    }
////}
function createMeterNeighbourhoodMatrix() {
    var points = metersToPoints(meters);
    var r = getDapMaximumReach();
    var M = [];

    for (var i = 0 ; i < points.length ; i++) {
        var pointsCovered = [];
        for (var j = 0; j < points.length; j++)
            if (i != j && covers(points[i], points[j], r)) {
                pointsCovered.push(j);

            }
        M.push(pointsCovered);
    }

    return M;
}
//function msh(coverageMatrix, neighbourMatrix, pos) {
//    // var meshMaxJumps = 3;
//    var added = [];
//    //  var s = coverageMatrix[pos].length; //OS MEDIDORES QUE O DAP EM POS SATISFAZ
//    var neighbours = coverageMatrix[pos];
//    for (var i = 0; i < meshMaxJumps + 1; i++) {
//        var newNeighbourhood = [];
//        for (var j = 0 ; j < neighbours.length; j++) {
//            added.push(neighbours[j]);
//            newNeighbourhood = newNeighbourhood.concat(neighbourMatrix[neighbours[j]]);
//        }
//        neighbours = newNeighbourhood.filter(function (elem, pos) {
//            return newNeighbourhood.indexOf(elem) == pos;
//        });


//    }
//    added = added.filter(function (elem, pos) {
//        return added.indexOf(elem) == pos; mes
//    });

//    return added;
//}
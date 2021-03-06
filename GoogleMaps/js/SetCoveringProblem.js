﻿

function sendSCPToServer() {
    var data = printScpMatrixTeste();
    // var data = data.toString();
    _ajax_request("http://localhost:3000/autoplan", data, 'POST');
}

function _ajax_request(url, data, method) {


    $.ajax({
        url: url,
        type: method,
        data: {
            'data': data

        },
        dataType: 'text',
        success: function (data) {
            var split = data.split(" ");

            for (var i = 0 ; i < split.length - 1; i++) {
                var toAdd = parseInt(split[i].slice(1));
                var latLng = poles[toAdd - 1].position;
                var newDap = createDAP();
                newDap.place(latLng.lat(), latLng.lng());

            }
        }
    });
}
function printScpMatrixTeste() {
    Matrixes = createMeshScpMatrixes();
    var scpMatrix = Matrixes.scpMatrix;
    var coverageMatrix = Matrixes.coverageMatrix;
    var Z = scpMatrix.length;
    var Y = coverageMatrix.length;
    //TEM Q MUDAR ESSE NEGÓCIO AQUI!
    var ret = "set Z;\n set Y;\n param A{r in Z, m in Y}, binary;\n var Route{m in Y}, binary;\n minimize cost: sum{m in Y} Route[m];\n subject to covers{r in Z}: sum{m in Y} A[r,m]*Route[m]>=1;\n solve; \n printf {m in Y:  Route[m] == 1} \"%s \", m > \"Results.txt\";\n data;\n";
    ret += "set Z:= ";
    for (var i = 0; i < Z; i++)
        ret += "Z" + (i + 1) + " ";
    ret += ";\n"
    ret += "set Y:= ";
    for (var i = 0; i < Y; i++)
        ret += "Y" + (i + 1) + " ";
    ret += ";\n";

    ret += "param A : ";

    for (var i = 0; i < Y; i++)
        ret += "Y" + (i + 1) + " ";
    ret += ":= \n";
    for (var i = 0; i < Z; i++) {
        ret += "Z" + (i + 1) + " ";
        for (var j = 0; j < Y; j++) {
            var um = false;
            for (var k = 0; k < scpMatrix[i].length; k++)
                if (j == scpMatrix[i][k])
                    um = true;
            if (um)
                ret += "1 ";
            else
                ret += "0 ";

        }

    }
    ret += "\n";
    ret += ";";
    ret += "end;";

    return ret;


    // for(var i = 0; i < )
}
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
            if (covers(electricPoles[i], points[j], r)) {
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
function createMeshScpMatrixes2() {
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


//function createScpMatrixes() {
//    var cM = [];
//    var sM = [];
//    for (var i = 0; i < meters.length; i++) {
//        var aux = [];
//        sM.push(aux);
//    }
//    var dapsToRemove = [];
//    for (var j = 0; j < poles.length; j++) {
//        var dap = createDAP();
//       // dapsToRemove.push(dap);
//        dap.place(poles[j].getPosition().lat(), poles[j].getPosition().lng());
//       // dap.connectByDistance();
//       // dap.connectByDistanceMesh();
//        var covered = [];
//        for (var i = 0; i < dap.neighbours.length; i++) {
//            if (dap.neighbours[i].type == "Meter") {
//                var toAdd = positionInArray(dap.neighbours[i]);
//                covered.push(toAdd);
//                sM[toAdd].push(j);
//            }


//          //  covered.push(dap.neighbours[i]);
//        }
//        for (var i = 0; i < dap.meshMeters.length; i++) {
//            covered.push(positionInArray(dap.meshMeters[i].target));
//            sM[toAdd].push(j);
//          // covered.push(dap.meshMeters[i].target);
//        }
//        cM.push(covered);
//        dap.remove();
//    }
//   // for (var i = 0; i < dapsToRemove.length;i++)
//   //     dapsToRemove[i].remove();
//    var scpMatrixes = ({
//        scpMatrix: sM,
//        coverageMatrix: cM
//    });
//    return scpMatrixes;
//}
function positionInArray(marker) {

    if (marker.type == "Meter") {
        for (var i = 0; i < meters.length; i++) {
            if (marker.ID == meters[i].ID)
                return i;
        }
    }
}

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

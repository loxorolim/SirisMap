
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
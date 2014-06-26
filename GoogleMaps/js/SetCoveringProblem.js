
function createScpMatrixes() {
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
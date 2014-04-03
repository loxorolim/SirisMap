﻿function circlesFromP1p2r(p1, p2, r) {
    if (p1.x == p2.x && p2.y == p2.y)
        return null;
    else {        
        var latLng1 = pointToLatLng(p1);
        var latLng2 = pointToLatLng(p2);
        var dist = google.maps.geometry.spherical.computeDistanceBetween(latLng1,latLng2);
        var fraction = (0.9*r) / dist;
        var latLng = google.maps.geometry.spherical.interpolate(latLng1, latLng2, fraction);
        var circle = latLngToPoint(latLng);
        return circle;
    }
}
function covers(c, pt, r) {
    var latlng = pointToLatLng(pt, meters);
    var latlng2 = pointToLatLng(c, meters);
    return (google.maps.geometry.spherical.computeDistanceBetween(latlng, latlng2) <= r)
}
function containsPoint(elem, vet) {
    for (var i = 0; i < vet.length; i++) {
        if (vet[i].x == elem.x && vet[i].y == elem.y)
            return i;
    }
    return -1;
}
function findBestCoverage(points, coverage) {
   
    var coveragePos = -1;
    var numContained = 0;
    for (var i = 0; i < coverage.length; i++) {
        if (coverage[i].points.length >= numContained) {
            var contained = 0;
            for (var j = 0; j < points.length ; j++) {
                if (containsPoint(points[j], coverage[i].points) >= 0)
                    contained++;
            }
            if (contained > numContained) {
                coveragePos = i;
                numContained = contained;
            }
        }
        
            
    }
    return coveragePos;
}

function addDapAtPoints(circles,meters) {
    for (var i = 0; i < circles.length; i++) {
        var latLng = pointToLatLng(circles[i], meters);
        placeDAP(latLng.lat(), latLng.lng(), "bla");
    }
}
function getDapMaximumReach() {
    return table[table.length - 1].distance;
}
function applyPlanning() {
    var points = metersToPoints(meters);
    var r = getDapMaximumReach();
    var CirclesBetween2Points = [];   
    for(var i = 0; i < points.length; i ++)
        for( var j = 0; j < points.length;j++)
            if (i != j) {
                var circle = circlesFromP1p2r(points[i], points[j], r);
                if (circle != null)
                    CirclesBetween2Points.push(circlesFromP1p2r(points[i], points[j], r));
            }
    var coverage = [];
    for(var i = 0 ; i < CirclesBetween2Points.length ; i++){
        var obj = ({
            c: CirclesBetween2Points[i],
            points: []});
        for(var j = 0; j < points.length; j ++)
            if(covers(CirclesBetween2Points[i],points[j],r)){
                obj.points.push(points[j]);
                
            }   
        coverage.push(obj);
    }
    coverage.sort(function(a, b) {
        if (a.points.length > b.points.length) return -1;
        if (a.points.length < b.points.length) return 1;
        return 0;
    });
    var circlesChosen = [];
   
    while (points.length > 0) {
        var bestCoveragePos = findBestCoverage(points, coverage);
        var bestCoverage = coverage[bestCoveragePos];
        var listaPontos = printPoints(points);

        var listaCoberta = printPoints(coverage[bestCoveragePos].points);

        for (var k = 0; k < coverage[bestCoveragePos].points.length; k++) {
            var pointPos = containsPoint(coverage[bestCoveragePos].points[k], points);
            if(pointPos >= 0)
                points.splice(pointPos, 1);
            listaPontos = printPoints(points);
            listaCoberta = printPoints(coverage[bestCoveragePos].points);
        }
        circlesChosen.push(coverage[bestCoveragePos].c);
        coverage.splice(bestCoveragePos, 1);
        
        //for (var j = 0 ; j < coverage.length; j++) {
        //    if (containsPoint(points[0], coverage[j].points) != -1) {
        //        //remover esse coverage 
        //        // remover todos os pointos q ele cobre
        //        circlesChosen.push(coverage[j].c);
        //        for (var k = 0; k < coverage[j].points.length; k++) {
        //            points.splice(containsPoint(coverage[j].points[k], points),1);
        //        }
        //        coverage.splice(j,1);
        //        break;
                

        //    }
        //}
  
    }
    
    addDapAtPoints(circlesChosen, meters);
     
    //var teste = [];
    //for (var i = 0; i < 1 ; i++)
    //    teste.push(coverage[i].c);
    //addDapAtPoints(teste, meters);

    //for(var i = 0; i < points.length ; i++){
    //    for (var j = 0 ; j < coverage.length; j++) {
    //        if (contains(points[i], coverage[j].points) != -1) {
    //            //remover esse coverage 
    //            // remover todos os pointos q ele cobre
    //            circlesChosen.push(coverage[j].c);
                
    //        }
                
    //    }
    //}

    

}
function printPoints(points) {
    var listaPontos = "";
    points.sort(function (a, b) {
        if (a.x < b.x) return -1;
        if (a.x > b.x) return 1;
        return 0;
    });
    for (var ls = 0 ; ls < points.length; ls++) {
        listaPontos += "Ponto " + ls + " : (" + points[ls].x + ", " + points[ls].y + ")\n";
    }
    return listaPontos;

}

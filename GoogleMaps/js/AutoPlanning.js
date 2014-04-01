

function circlesFromP1p2r(p1,p2,r){
    if(p1.x == p2.x && p2.y == p2.y)
        return null;
    else{
        var deltax = p2.x - p1.x ;
        var deltay = p2.y - p1.y;
        var q = Math.sqrt(deltax*deltax + deltay*deltay);
     //   var q = google.maps.geometry.spherical.computeDistanceBetween(p1.latLng, p2.latLng);
        if(q>2.0*r)
            return null;
        else{
            var x3 = (p1.x + p2.x) / 2 ;
            var y3 = (p1.y + p2.y) / 2 ;
            var d = Math.sqrt(r*r - ((q/2)*(q/2)));
            var circle1 = ({
                x: x3 - d*deltay/q,
                y: y3 + d*deltax/q,
                r: Math.abs(r)
            });
            var circle2 = ({
                x: x3 + d*deltay/q,
                y: y3 - d*deltax/q,
                r: Math.abs(r)
            });
            var ret = [];
            ret.push(circle1);
            ret.push(circle2);
            return ret;
        }
    }
}
function covers(c,pt,r){
    return (((c.x - pt.x)*(c.x - pt.x) + (c.y - pt.y)*(c.y - pt.y)) <= r*r);
}
function contains(elem, vet){
    for(var i = 0; i < vet.length; i++){
        if(vet[i] == elem)
            return i;
    }
    return -1;
}
function containsPoint(elem, vet) {
    for (var i = 0; i < vet.length; i++) {
        if (vet[i].x == elem.x && vet[i].y == elem.y)
            return i;
    }
    return -1;
}
function CanvasProjectionOverlay() { }
CanvasProjectionOverlay.prototype = new google.maps.OverlayView();
CanvasProjectionOverlay.prototype.constructor = CanvasProjectionOverlay;
CanvasProjectionOverlay.prototype.onAdd = function () { };
CanvasProjectionOverlay.prototype.draw = function () { };
CanvasProjectionOverlay.prototype.onRemove = function () { };

function markersToPoints() {
    var canvasProjectionOverlay = new CanvasProjectionOverlay();
    canvasProjectionOverlay.setMap(map);
    var points = [];
    for (var i = 0; i < meters.length; i++) {
        var markerPos = meters[i].getPosition();
        var p = canvasProjectionOverlay.getProjection().fromLatLngToContainerPixel(markerPos);
        points.push(p);
    }
    return points;
}
function addDapAtPoints(circles,meters) {
    //var canvasProjectionOverlay = new CanvasProjectionOverlay();
    //canvasProjectionOverlay.setMap(map);
    for (var i = 0; i < circles.length; i++) {
        //var point = ({
        //    x: circles[i].x,
        //    y: circles[i].y
        //});
        var latLng = pointToLatLng(circles[i], meters);
       // var latLng = canvasProjectionOverlay.getProjection().fromContainerPixelToLatLng(point);
        placeDAP(latLng.lat(), latLng.lng(), "bla");
    }
}
function getDapMaximumReach() {
    return table[table.length - 1].distance;
}
function applyPlanning() {
   // var p = 
    //var projection = map.getProjection();
   // var markerPos = allMarkers[0].getPosition();
    //var screenPos = projection.fromLatLngToContainerPixel(markerPos);

   
   
   


    var points = metersToPoints(meters);



    var r = getDapMaximumReach();
    var CirclesBetween2Points = [];
    
    for(var i = 0; i < points.length; i ++)
        for( var j = 0; j < points.length;j++){
            if(i != j){
                var circles = circlesFromP1p2r(points[i], points[j], r);
                if (circles != null) {

                    CirclesBetween2Points.push(circles[0]);
                    CirclesBetween2Points.push(circles[1]);
                }
                //if(circles[0] != NULL)
                //    CirclesBetween2Points.push(circles[0]);
                //if(circles[1] != NULL)
                //    CirclesBetween2Points.push(circles[0]);
            }
               
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
   // var i = 0;
    while (points.length > 0) {
        for (var j = 0 ; j < coverage.length; j++) {
            if (containsPoint(points[0], coverage[j].points) != -1) {
                //remover esse coverage 
                // remover todos os pointos q ele cobre
                circlesChosen.push(coverage[j].c);
                for (var k = 0; k < coverage[j].points.length; k++) {
                    points.splice(containsPoint(coverage[j].points[k], points),1);
                }
                coverage.splice(j,1);
                break;
                

            }
        }
  
    }
    addDapAtPoints(circlesChosen,meters);

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

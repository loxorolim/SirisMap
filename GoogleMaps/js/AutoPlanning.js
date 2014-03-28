
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
function covers(c,pt){
    return (((c.x - pt.x)*(c.x - pt.x) + (c.y - pt.y)*(c.y - pt.y)) <= (c.r)*(c.r));
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


function applyPlanning() {
    var points = [];
    for (var i = 0 ; i < 10; i++) {
        var point = ({
            x: Math.random()*10,
            y: Math.random()*10
        });
        points.push(point);
    }
    


    var r = 3;
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
            if(covers(CirclesBetween2Points[i],points[j])){
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

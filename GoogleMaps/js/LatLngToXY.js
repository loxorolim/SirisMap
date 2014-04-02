var rad = function (x) {
    return x * Math.PI / 180;
};
function ComputeLatLng(vLatitude, vLongitude, vAngle, vDistance) {
    var vNewLatLng = [];
    vDistance = vDistance / 6371;
    vAngle = ToRad(vAngle);

    var vLat1 = ToRad(vLatitude);
    var vLng1 = ToRad(vLongitude);

    var vNewLat = Math.asin(Math.sin(vLat1) * Math.cos(vDistance) +
                  Math.cos(vLat1) * Math.sin(vDistance) * Math.cos(vAngle));

    var vNewLng = vLng1 + Math.atan2(Math.sin(vAngle) * Math.sin(vDistance) * Math.cos(vLat1),
                          Math.cos(vDistance) - Math.sin(vLat1) * Math.sin(vNewLat));

    if (isNaN(vNewLat) || isNaN(vNewLng)) {
        return null;
    }

    vNewLatLng[0] = ToDeg(vNewLat);
    vNewLatLng[1] = ToDeg(vNewLng);

    return vNewLatLng;
}

function ToRad(vInput) {
    return vInput * Math.PI / 180;
}


function ToDeg(vInput) {
    return vInput * 180 / Math.PI;
}

var getDistance = function (p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat() - p1.lat());
    var dLong = rad(p2.lng() - p1.lng());
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
};

function metersToPoints(meters) {
    var points = [];
    if (meters.length > 0) {
        var referencePos = meters[0].getPosition();
       
        for (var i = 0; i < meters.length ; i++) {
           
            var markerPos = meters[i].getPosition();
            var latLng1 = new google.maps.LatLng(referencePos.lat(), markerPos.lng());

         //   placeDAP(latLng1.lat(), latLng1.lng(), "bla");

            //var latLng2 = new google.maps.LatLng(markerPos.lat(), referencePos.lng());
            var distX = google.maps.geometry.spherical.computeDistanceBetween(referencePos, latLng1);
            
            var distY = google.maps.geometry.spherical.computeDistanceBetween(markerPos, latLng1);
            if (markerPos.lat() < referencePos.lat())
                distY = -distY;
            if (markerPos.lng() < referencePos.lng())
                distX = -distX;
            var p = {
                x: distX,
                y: distY
            }
            var latng = ComputeLatLng(referencePos.lat(), referencePos.lng(), referencePos.lat(), distX);
            
          //  alert('DistX: ' + distX + 'DistY: ' + distY + 'Hipotenusa: ' + Math.sqrt(distX * distX + distY * distY) + 'Distancia: ' + google.maps.geometry.spherical.computeDistanceBetween(referencePos,markerPos));
            meters[i].X = distX;
            meters[i].Y = distY;
            points.push(p);
        }
    }
    return points;   
}
function metersToPointsXY(meters) {
    var points = [];
    if (meters.length > 0) {
       // var referencePos = meters[0].getPosition();

        for (var i = 0; i < meters.length ; i++) {

            //var markerPos = meters[i].getPosition();
            //var latLng1 = new google.maps.LatLng(referencePos.lat(), markerPos.lng());
            //var latLng2 = new google.maps.LatLng(markerPos.lat(), referencePos.lng());
            //var distX = google.maps.geometry.spherical.computeDistanceBetween(referencePos, latLng1);
            //var distY = google.maps.geometry.spherical.computeDistanceBetween(referencePos, latLng2);
            //if (markerPos.lat() < referencePos.lat())
            //    distY = -distY;
            //if (markerPos.lng() < referencePos.lng())
            //    distX = -distX;
            var p = {
                x: getX(meters[i].getPosition().lng(),1080),
                y: getY(meters[i].getPosition().lat(),1080,1920)
            }
            meters[i].X = p.x;
            meters[i].Y = p.y;
            points.push(p);
        }
    }
    return points;
}
function pointToLatLng(p, meters) {
    var referencePos = meters[0].getPosition();
    var R = 6378137 //Raio da Terra, CONFIRMAR!
    var r = Math.abs( R * Math.cos(referencePos.lat()));
    var lat = referencePos.lat() + (180 * p.y / (Math.PI * R));
    var r2 = Math.abs(R * Math.cos(lat));
    var lng = referencePos.lng() + (360 * p.x / (2 * Math.PI * r));
    
    

    //alert("DistX: " + p.x + "DistY: " + p.y);
    //    for (var i = 0; i < meters.length; i ++)
//        alert(google.maps.geometry.spherical.computeDistanceBetween(meters[i].getPosition(), new google.maps.LatLng(lat, lng)));


    //    var lng = referencePos.lng();
//    var lat = referencePos.lat();
    return new google.maps.LatLng(lat, lng);




   // var lng = referencePos.lng() +( Math.PI * 2 * 6378100) / (360*p.x);
   // return new google.maps.LatLng(referencePos.lat() + p.y, lng);
}
function getX(lon, width) {
    var x = (width * (180 + lon) / 360) % (width + (width / 2));
    return x;

}
function getY(lat, width, height) {
    // height and width are map height and width
  
    var latRad = lat*Math.PI/180;

    // get y value
    var mercN = Math.log(Math.tan((Math.PI/4)+(latRad/2)));
    var y     = (height/2)-(width*mercN/(2*Math.PI));
    return y;
}
    ''
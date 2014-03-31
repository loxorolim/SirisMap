
function metersToPoints(meters) {
    var points = [];
    if (meters.length > 0) {
        var referencePos = meters[0].getPosition();
       
        for (var i = 0; i < meters.length ; i++) {
           
            var markerPos = meters[i].getPosition();
            var latLng1 = new google.maps.LatLng(referencePos.lat(), markerPos.lng());
            var latLng2 = new google.maps.LatLng(markerPos.lat(), referencePos.lng());
            var distX = google.maps.geometry.spherical.computeDistanceBetween(referencePos, latLng1);
            var distY = google.maps.geometry.spherical.computeDistanceBetween(referencePos, latLng2);
            if (markerPos.lat() < referencePos.lat())
                distY = -distY;
            if (markerPos.lng() < referencePos.lng())
                distX = -distX;
            var p = {
                x: distX,
                y: distY
            }
            points.push(p);
        }
    }
    return points;   
}
function pointToLatLng(p, meters) {
    var referencePos = meters[0].getPosition();
    var R = 6378137 //Raio da Terra, CONFIRMAR!
    var r = Math.abs( R * Math.cos(referencePos.lat()));
    var lng = referencePos.lng() + (360 * p.x / (2 * Math.PI * r));
    var lat = referencePos.lat() + (180 * p.y / (Math.PI * R));

    //alert("DistX: " + p.x + "DistY: " + p.y);
    //    for (var i = 0; i < meters.length; i ++)
//        alert(google.maps.geometry.spherical.computeDistanceBetween(meters[i].getPosition(), new google.maps.LatLng(lat, lng)));


    //    var lng = referencePos.lng();
//    var lat = referencePos.lat();
    return new google.maps.LatLng(lat, lng);




   // var lng = referencePos.lng() +( Math.PI * 2 * 6378100) / (360*p.x);
   // return new google.maps.LatLng(referencePos.lat() + p.y, lng);
}

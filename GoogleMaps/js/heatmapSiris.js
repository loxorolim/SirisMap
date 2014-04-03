﻿
var pontosteste = [
  { location: new google.maps.LatLng(37.782, -122.447), weight: 0.9 },
  { location: new google.maps.LatLng(37.782, -122.443), weight: 0.8 },
  { location: new google.maps.LatLng(37.782, -122.441), weight: 0.7 },
  { location: new google.maps.LatLng(37.782, -122.439), weight: 1.0 },
  { location: new google.maps.LatLng(37.782, -122.435), weight: 0.5 },
  { location: new google.maps.LatLng(37.785, -122.447), weight: 0.3 },
  { location: new google.maps.LatLng(37.785, -122.445), weight: 0.6 },
  { location: new google.maps.LatLng(37.785, -122.441), weight: 0.9 },
  { location: new google.maps.LatLng(37.785, -122.437), weight: 1.0 },
  { location: new google.maps.LatLng(37.785, -122.435), weight: 0.5 }
];

function drawHeatMap()
{
    //for (var i = 0; i < pontosteste.length ; i++) {
    //    var hmpoint = {
    //        position: pontosteste[i].location,
    //        efficiency: 0.9
    //    }
    //    heatmapPoints.push(hmpoint);
   // heatmapPoints = pontosteste;

    //}
    var pointArray = new google.maps.MVCArray(heatmapPoints);

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: pointArray,
        radius: 35,
        opacity: 0.7,
        maxIntensity: 10000

    });
   // heatmap.set('radius', heatmap.get('radius') ? null : 40);
    var gradient = [
     'rgba(255, 0, 0, 0)',
     'rgba(255, 16, 0, 1)',
     'rgba(255, 32, 0, 1)',
     'rgba(255, 48, 0, 1)',
     'rgba(255, 64, 0, 1)',
     'rgba(255, 80, 0, 1)',
     'rgba(255, 96, 0, 1)',
     'rgba(255, 112, 0, 1)',
     'rgba(255, 128, 0, 1)',
     'rgba(255, 144, 0, 1)',
     'rgba(255, 160, 0, 1)',
     'rgba(255, 176, 0, 1)',
     'rgba(255, 192, 0, 1)',
     'rgba(255, 208, 0, 1)',
     'rgba(255, 224, 0, 1)',
     'rgba(255, 240, 0, 1)',
     'rgba(255, 255, 0, 1)',
     'rgba(240, 255, 0, 1)',
     'rgba(224, 255, 0, 1)',
     'rgba(208, 255, 0, 1)',
     'rgba(192, 255, 0, 1)',
     'rgba(176, 255, 0, 1)',
     'rgba(160, 255, 0, 1)',
     'rgba(144, 255, 0, 1)',
     'rgba(128, 255, 0, 1)',
     'rgba(112, 255, 0, 1)',
     'rgba(96, 255, 0, 1)',
     'rgba(80, 255, 0, 1)',
     'rgba(64, 255, 0, 1)',
     'rgba(48, 255, 0, 1)',
     'rgba(32, 255, 0, 1)',
     'rgba(16, 255, 0, 1)'
     

    ]
 //   heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
  
    heatmap.setMap(map);
   

}
function createCircle() {

    for(var rad=10000;rad<=50000;rad+=10000)
    {

        //var circleOptions = new google.maps.Circle({
        //    center:latLng,   //set center
        //    radius:rad,   //set radius in meters
        //    //fillColor: Color.TRANSPARENT,  //default
        //    strokeColor:0x10000000,
        //    strokeWidth:5,
        //});
        var yellowCircle = new google.maps.Circle(
	    {
	        center: new google.maps.LatLng(-22, -43),
	    radius: rad,
	    strokeColor: "#FFFF00",
	    strokeOpacity: 0.8,
	    strokeWeight: 0,
	    fillColor: "#FFFF00",
	    fillOpacity: 0.35,
	    map: map
	    });
        var yellowCircle = new google.maps.Circle(
	    {
	        center: new google.maps.LatLng(-22.5, -43.5),
	        radius: rad,
	        strokeColor: "#FF00FF",
	        strokeOpacity: 0.8,
	        strokeWeight: 0,
	        fillColor: "#FF00FF",
	        fillOpacity: 0.35,
	        map: map
	    });
              
     //myCircle = map.addCircle(circleOptions);
    }
}

//function changeRadius() {
//    heatmap.set('radius', heatmap.get('radius') ? null : 40);
//}
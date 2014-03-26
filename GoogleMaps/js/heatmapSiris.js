
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
     'rgba(150, 75, 0, 1)',
     'rgba(125, 100, 0, 1)',
     'rgba(100, 125, 0, 1)',
     'rgba(75, 150, 0, 1)',
     'rgba(50, 175, 0, 1)',
     'rgba(25, 200, 0, 1)',
     'rgba(0, 225, 0, 1)',
     'rgba(0, 255, 0, 1)'
    ]
   // heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
  
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

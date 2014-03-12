
var pontosteste = [
  new google.maps.LatLng(37.782551, -122.445368),
  new google.maps.LatLng(37.782745, -122.444586),
  new google.maps.LatLng(37.782842, -122.443688),
  new google.maps.LatLng(37.782919, -122.442815),
  new google.maps.LatLng(37.782992, -122.442112),
  new google.maps.LatLng(37.783100, -122.441461),
  new google.maps.LatLng(37.783206, -122.440829),
  new google.maps.LatLng(37.783273, -122.440324),
  new google.maps.LatLng(37.783316, -122.440023),
];

function drawHeatMap()
{
    for (var i = 0; i < pontosteste.length ; i++) {
        var hmpoint = {
            position: pontosteste[i],
            efficiency: 0.9
        }
        heatmapPoints.push(hmpoint);

    }
    var pointArray = new google.maps.MVCArray(pontosteste);

    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: pointArray,
        radius: 30,
        opacity: 0.7
    });
   // heatmap.set('radius', heatmap.get('radius') ? null : 40);
    var gradient = [
     'rgba(0, 255, 255, 0)',
     'rgba(0, 255, 255, 1)',
     'rgba(0, 191, 255, 1)',
     'rgba(0, 127, 255, 1)',
     'rgba(0, 63, 255, 1)',
     'rgba(0, 0, 255, 1)',
     'rgba(0, 0, 223, 1)',
     'rgba(0, 0, 191, 1)',
     'rgba(0, 0, 159, 1)',
     'rgba(0, 0, 127, 1)',
     'rgba(63, 0, 91, 1)',
     'rgba(127, 0, 63, 1)',
     'rgba(191, 0, 31, 1)',
     'rgba(255, 0, 0, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);

    heatmap.setMap(map);

}
//function changeRadius() {
//    heatmap.set('radius', heatmap.get('radius') ? null : 40);
//}

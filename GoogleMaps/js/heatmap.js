
function drawHeatMap()
{
    var pointArray = new google.maps.MVCArray(taxiData);

    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: pointArray,
        radius: 100,
        opacity: 0.7
    });
   // heatmap.set('radius', heatmap.get('radius') ? null : 40);
    var gradient = [
    'rgba(255, 255, 255, 0)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);

    heatmap.setMap(map);

}
//function changeRadius() {
//    heatmap.set('radius', heatmap.get('radius') ? null : 40);
//}

var alpha = 0.9;

function autoPlanningGrasp

function constructPhase(solution) {
 //   var Matrixes = createScpMatrixes();
 //   var scpMatrix = Matrixes.scpMatrix;
 //   var coverageMatrix = Matrixes.coverageMatrix;

    var scpMatrix = [[0, 1, 4], [5, 6], [0, 1, 2], [1, 5]];
    var coverageMatrix = [[0,2], [0,2,3], [2],[],[0],[1,3],[1]];
    //TALVEZ TENHA Q COPIAR AS MATRIZES ANTES
    var tam = scpMatrix.length;
    while(tam > 0){ //ALTERAR ISSO AQUI PRA NAO DAR LOOP INFINITO SE TIVER PONTOS IMPSOSIVEIS DE SE COBRIR
        var rcl = generateRCL(scpMatrix, coverageMatrix, solution);
        var chosen = Math.floor((Math.random() * rcl.length));
        chosen = rcl[chosen].position;
        solution[chosen] = 1;
//        var scpCopy = scp
        tam = removeCovered(scpMatrix, coverageMatrix, chosen, tam);


    }

}
function removeCovered(scpMatrix,coverageMatrix, chosen, tam) {

    var newTam = tam - coverageMatrix[chosen].length;
    var scpRemoved = [];
    for (var i = 0; i < coverageMatrix[chosen].length; i++) {
        var pos = coverageMatrix[chosen][i];
        var length = scpMatrix[pos].length;
        var copy = scpMatrix[pos].slice(0, length);
        scpMatrix[pos].splice(0, length);
        var obj = ({
            position: pos,
            posCopy: copy 
        });
        scpRemoved.push(obj);
    }
    for (var i = 0; i < scpRemoved.length; i++)
        for (var j = 0; j < scpRemoved[i].posCopy.length; j++)
            for (var k = 0; k < coverageMatrix[scpRemoved[i].posCopy[j]].length; k++)
                if (coverageMatrix[scpRemoved[i].posCopy[j]][k] == scpRemoved[i].position) {
                    coverageMatrix[scpRemoved[i].posCopy[j]].splice(k, 1);
                    break;
                }
   return newTam;

}
function generateRCL(scpMatrix, coverageMatrix, solution) {
    
    var max = 0;
    var rcl = [];
    for (var i = 0; i < coverageMatrix.length; i++) {
        if (solution[i] != 1) {
            var s = coverageMatrix[i].length;
            if (s >= alpha * max && s != 0) {
                var duple = ({
                    position: i,
                    satisfied: s
                });
                rcl.push(duple);
                if (s > max)
                    max = s;
            }
        }
    }
    var limit = alpha * max;
    rcl = rcl.filter(function (item) {
        return (item.satisfied >= limit);
    });
    return rcl;

}
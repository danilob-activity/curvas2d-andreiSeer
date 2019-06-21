var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var textarea = document.getElementById("code");
var reset = document.getElementById("reset");
var edit = document.getElementById("edit");
var code = textarea.value;

var scale = 1;

 //armazena os pontos da curva de hermite
var np = 30;
var fps = 60;
var total_time_hermite = 3;
var total_time_bezier = 3;
var points_curveH = []
var p_current =[]
var frame_current = 0;
var total_time = 3;

var points_curveM = []
var p_currentB =[]
var frame_currentB = 0;
var total_timeB = 3;

var points_curveBLoop =[];
var p_currentBLoop =[]
var frame_currentBLoop = 0;
var total_timeBLoop= 1;

function drawCanvas() {
  
    points_curveM=[];
  /* points_curveM = []
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    eval(textarea.value);*/

    setTimeout(function(){
        requestAnimationFrame(drawCanvas);
        frame_current+=1;
        frame_currentB+=1;
        frame_current = frame_current % (total_time_hermite *fps);
        frame_currentB = frame_currentB % (total_time_bezier *fps);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.setTransform(1,0,0,1,0,0);
        eval(textarea.value);
    },1000/fps);
}

function drawCircle(M, canv, color) { //desenha um círculo
    canv.beginPath();
    canv.strokeStyle = '#000000';
    c = multVec(M, [0, 0, 1]);
    canv.arc(c[0], c[1], 5, 0, 2 * Math.PI, false);
    canv.lineWidth = 2;
    canv.fillStyle = color;
    canv.fill();
    canv.setLineDash([]);
    canv.strokeStyle = color;
    canv.stroke();
    canv.fillStyle = '#000000';
}

function drawCircleVec(c, canv, color) { //desenha um círculo
    canv.beginPath();
    canv.strokeStyle = '#000000';
    //c = multVec(M, [0, 0, 1]);
    canv.arc(c[0], c[1], 5, 0, 2 * Math.PI, false);
    canv.lineWidth = 2;
    canv.fillStyle = color;
    canv.fill();
    canv.setLineDash([]);
    canv.strokeStyle = color;
    canv.stroke();
    canv.fillStyle = '#000000';
}

function drawArrow(context, fromx, fromy, tox, toy) {
    var headlen = 8; // length of head in pixels
    var angle = Math.atan2(toy - fromy, tox - fromx);
    context.lineWidth = 2;
    //context.setLineDash([1, 2]);
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
    //context.setLineDash([]);
}

function setSizePoints(v) {
    np = v;
}

function showPoints() {
    M = transformCanvas(canvas.width, canvas.height);
    ctx.beginPath();
    for (var i = 1; i < points_curveH.length - 1; i++) {
        pa = multVec(mult(M, translate(points_curveH[i][0][0], points_curveH[i][0][1])), [0, 0, 1]);
        drawCircleVec(pa, ctx, "#6a0000");
    }


}


function setHermite(p0, p1, p0l, p1l) {
    points_curveH = []
    ctx.beginPath();
    M = transformCanvas(canvas.width, canvas.height);
    ctx.font = "14px Arial";
    pos0 = multVec(mult(M, translate(p0[0], p0[1])), [0, 0, 1]);
    pos1 = multVec(mult(M, translate(p1[0], p1[1])), [0, 0, 1]);
    pos0l = multVec(mult(M, translate(p0[0] + p0l[0] / 10., p0[1] + p0l[1] / 10.)), [0, 0, 1]);
    pos1l = multVec(mult(M, translate(p1[0] + p1l[0] / 10., p1[1] + p1l[1] / 10.)), [0, 0, 1]);
    calculatePointsCurveHermite(p0, p1, p0l, p1l);
    ctx.lineWidth = 1.5;
    drawCurveHermite();
    ctx.fillStyle = "#ff836444";
    ctx.strokeStyle = "#ff836444";
    drawArrow(ctx, pos0[0], pos0[1], pos0l[0], pos0l[1]);
    drawArrow(ctx, pos1[0], pos1[1], pos1l[0], pos1l[1]);
    ctx.fillStyle = "#494949";
    ctx.fillText("p0", pos0[0] + 7, pos0[1] - 7);
    ctx.fillText("p1", pos1[0] + 7, pos1[1] - 7);
    drawCircle(mult(M, translate(p0[0], p0[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p1[0], p1[1])), ctx, "#8b104e");

    var p_current = calculatePointCurveHermite(p0, p1, p0l, p1l,frame_current / (total_time_hermite * fps));
   
    drawCircle(mult(M, translate(p_current[0][0], p_current[0][1])), ctx, "#7B68EE");

}
function setBezier(p0, p1, p2, p3) {
    points_curveM = []
    ctx.beginPath();
    M = transformCanvas(canvas.width, canvas.height);
    ctx.font = "14px Arial";
    pos0 = multVec(mult(M, translate(p0[0], p0[1])), [0, 0, 1]);
    pos1 = multVec(mult(M, translate(p1[0], p1[1])), [0, 0, 1]);
    pos2 = multVec(mult(M, translate(p2[0], p2[1])), [0, 0, 1]);
    pos3 = multVec(mult(M, translate(p3[0], p3[1])), [0, 0, 1]);
    calculatePointsCurveBezier(p0, p1, p2, p3);
    ctx.lineWidth = 1.5;
    drawCurveBezier();
    ctx.fillStyle = "#ff8364";
    ctx.strokeStyle = "#ff8364";
    ctx.fillStyle = "#494949";
    ctx.fillText("p0", pos0[0] + 7, pos0[1] - 7);
    ctx.fillText("p1", pos1[0] + 7, pos1[1] - 7);
    ctx.fillText("p2", pos2[0] + 7, pos2[1] - 7);
    ctx.fillText("p3", pos3[0] + 7, pos3[1] - 7);
    drawCircle(mult(M, translate(p0[0], p0[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p1[0], p1[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p2[0], p2[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p3[0], p3[1])), ctx, "#8b104e");

    var arc = createArc(p0, p1, p2, p3);
    var total_length = arc[0].length;
    var length_current = total_length * (frame_current / (total_time_bezier * fps));
    p_current = arc[0].getVec4S(arc[1], length_current)

    //p_current = calculatePointCurveBezier(p0, p1, p2, p3, frame_current / (total_time * fps));
    drawCircle(mult(M, translate(p_current.x, p_current.y)), ctx, "#52437b");
    
    }

function drawCurveHermite() {
    ctx.fillStyle = "#4B0082";
    ctx.strokeStyle = "#4B0082";

    for (var i = 0; i < points_curveH.length - 1; i++) {
        ctx.beginPath();
        pa = multVec(mult(M, translate(points_curveH[i][0][0], points_curveH[i][0][1])), [0, 0, 1]);
        pb = multVec(mult(M, translate(points_curveH[i + 1][0][0], points_curveH[i + 1][0][1])), [0, 0, 1]);
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
    }
}
maxT =0;
function drawCurveBezier() {
   // points_curveM = []
    ctx.fillStyle = "#008B8B";
    ctx.strokeStyle = "#008B8B";

  for (var i = 0; i < points_curveM.length - 1; i++) {
        ctx.beginPath();
        pa = multVec(mult(M, translate(points_curveM[i][0][0], points_curveM[i][0][1])), [0, 0, 1]);
        pb = multVec(mult(M, translate(points_curveM[i + 1][0][0], points_curveM[i + 1][0][1])), [0, 0, 1]);
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
    }
    
}

function calculatePointsCurveHermite(p0, p1, p0l, p1l) {
    q = [
        [p0[0], p0[1]],
        [p1[0], p1[1]],
        [p0l[0], p0l[1]],
        [p1l[0], p1l[1]]
    ];

    for (var i = 0; i <= np; i++) {
        u = (1. * (i)) / np;
        p = mult(getMatrixBuhermite(u), q);
        points_curveH.push([p[0], p[1]]);
    }
}
////////////////////////////////////////////////////////////////
function calculatePointCurveHermite(p0, p1, p0l, p1l,t) {
    q = [
        [p0[0], p0[1]],
        [p1[0], p1[1]],
        [p0l[0], p0l[1]],
        [p1l[0], p1l[1]]
    ];

       return mult(getMatrixBuhermite(t), q);
      
    }

/////////////////////////////////////////////////////////////////
function calculatePointsCurveBezier(p0, p1, p0l, p1l) {
    q = [
        [p0[0], p0[1]],
        [p1[0], p1[1]],
        [p0l[0], p0l[1]],
        [p1l[0], p1l[1]]
    ];
    console.log("Olá mundo")
    for (var i = 0; i <= np; i++) {
        u = (1. * (i)) / np;
        p = mult(getMatrixBuBrezier(u), q);
        points_curveM.push([p[0], p[1]]);
    }
}
////////////////////////////////////////////////////////////////
function calculatePointCurveBezier(p0, p1, p0l, p1l,t) {
    q = [
        [p0[0], p0[1]],
        [p1[0], p1[1]],
        [p0l[0], p0l[1]],
        [p1l[0], p1l[1]]
    ];
    return mult(getMatrixBuBrezier(t), q);
        
    
}


////////////////////////////////////////////////////////////////
function getMatrixBuhermite(u) {
    return [
        [2 * u * u * u - 3 * u * u + 1, -2 * u * u * u + 3 * u * u, u * u * u - 2 * u * u + u, u * u * u - u * u]
    ];
}
function getMatrixBuBrezier(u) {
    return [
        [1 - 3 * u + 3 * u * u - u * u * u, 3 * u - 6 * u * u + 3 * u * u * u, 3 * u * u - 3 * u * u * u, u * u * u]
         //[(1-u)*(1-u)*(1-u), 3*u*(1-u)*(1-u), 3*u*u*(1-u), u * u * u ]
    ];
}
////////////////////////////////////Bonus//////////////////////////////
function setRepetitionBezier(p0, p1, p2, p3) {
    points_curveM = []
    ctx.beginPath();
    M = transformCanvas(canvas.width, canvas.height);
    ctx.font = "14px Arial";
    pos0 = multVec(mult(M, translate(p0[0], p0[1])), [0, 0, 1]);
    pos1 = multVec(mult(M, translate(p1[0], p1[1])), [0, 0, 1]);
    pos2 = multVec(mult(M, translate(p2[0], p2[1])), [0, 0, 1]);
    pos3 = multVec(mult(M, translate(p3[0], p3[1])), [0, 0, 1]);

    calculatePointsCurveBezier(p0, p1, p2, p3);

    ctx.lineWidth = 1.5;

    drawAnimBezier();
    ctx.fillStyle = "#ff836444";
    ctx.strokeStyle = "#ff836444";
    drawArrow(ctx, pos0[0], pos0[1], pos2[0], pos2[1]);
    drawArrow(ctx, pos1[0], pos1[1], pos3[0], pos3[1]);
    
    ctx.fillStyle = "#494949";
    ctx.fillText("p0", pos0[0] + 7, pos0[1] - 7);
    ctx.fillText("p1", pos1[0] + 7, pos1[1] - 7);
    ctx.fillText("p2", pos2[0] + 7, pos2[1] - 7);
    ctx.fillText("p3", pos3[0] + 7, pos3[1] - 7);
    drawCircle(mult(M, translate(p0[0], p0[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p1[0], p1[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p2[0], p2[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p3[0], p3[1])), ctx, "#8b104e");
   

}
maxT=0;
function drawAnimBezier() {
   // points_curveM = []
    ctx.fillStyle = gera_cor();
    ctx.strokeStyle = gera_cor();

  
    //maxT = points_curveM.length-1;
    ctx.beginPath();
    for(var t =0; t<=maxT; t++){
        pa = multVec(mult(M, translate(points_curveM[t][0][0], points_curveM[t][0][1])), [0, 0, 1]);
        pb = multVec(mult(M, translate(points_curveM[t + 1][0][0], points_curveM[t + 1][0][1])), [0, 0, 1]);
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
    }
    ctx.stroke();
    maxT+=1;
    if(maxT > np-1){
        maxT = 0;
        console.log("oi")

    }
    requestAnimationFrame(drawCurveBezier);
}
////////////////////////////////////Bonus 2///////////////////////////////////////////////

function setChainBezier(p0, p1, p2, p3) {
    points_curveM = []
    ctx.beginPath();
    M = transformCanvas(canvas.width, canvas.height);
    ctx.font = "14px Arial";
    pos0 = multVec(mult(M, translate(p0[0], p0[1])), [0, 0, 1]);
    pos1 = multVec(mult(M, translate(p1[0], p1[1])), [0, 0, 1]);
    pos2 = multVec(mult(M, translate(p2[0], p2[1])), [0, 0, 1]);
    pos3 = multVec(mult(M, translate(p3[0], p3[1])), [0, 0, 1]);
    
    calculatePointsCurveBezier(p0, p1, p2, p3);
    ctx.lineWidth = 1.5;
    drawtestBezier();
    ctx.fillStyle = "#ff836444";
    ctx.strokeStyle = "#ff836444";
    drawArrow(ctx, pos0[0], pos0[1], pos2[0], pos2[1]);
    drawArrow(ctx, pos1[0], pos1[1], pos3[0], pos3[1]);
    
    ctx.fillStyle = "#494949";
    ctx.fillText("p0", pos0[0] + 7, pos0[1] - 7);
    ctx.fillText("p1", pos1[0] + 7, pos1[1] - 7);
    ctx.fillText("p2", pos2[0] + 7, pos2[1] - 7);
    ctx.fillText("p3", pos3[0] + 7, pos3[1] - 7);
    drawCircle(mult(M, translate(p0[0], p0[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p1[0], p1[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p2[0], p2[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p3[0], p3[1])), ctx, "#8b104e");
   

}
function drawtestBezier() {
   // points_curveM = []
    ctx.fillStyle = "#008B8B";
    ctx.strokeStyle = "#008B8B";

  for (var i = 0; i < points_curveM.length - 1; i++) {
        ctx.beginPath();
        pa = multVec(mult(M, translate(points_curveM[i][0][0], points_curveM[i][0][1])), [0, 0, 1]);
        pb = multVec(mult(M, translate(points_curveM[i + 1][0][0], points_curveM[i + 1][0][1])), [0, 0, 1]);
        //ctx.moveTo(pa[0], pa[1]);
        //ctx.lineTo(pb[0], pb[1]);
        ctx.arc(pb[0], pb[1], 20, 0, Math.PI * 2, false)
        ctx.stroke();
    }
    
}
///////////////////////////////Bonus 3/////////////////////////////////////////////

function setPiscaPiscaBezier(p0, p1, p2, p3) {
    points_curveM = []
    ctx.beginPath();
    M = transformCanvas(canvas.width, canvas.height);
    ctx.font = "14px Arial";
    pos0 = multVec(mult(M, translate(p0[0], p0[1])), [0, 0, 1]);
    pos1 = multVec(mult(M, translate(p1[0], p1[1])), [0, 0, 1]);
    pos2 = multVec(mult(M, translate(p2[0], p2[1])), [0, 0, 1]);
    pos3 = multVec(mult(M, translate(p3[0], p3[1])), [0, 0, 1]);

    calculatePointsCurveBezier(p0, p1, p2, p3);

    ctx.lineWidth = 1.5;

    drawCurveBezier2();
          

    
}
function gera_cor(){
    var hexadecimais = '0123456789ABCDEF';
    var cor = '#';
  
    // Pega um número aleatório no array acima
    for (var i = 0; i < 6; i++ ) {
    //E concatena à variável cor
        cor += hexadecimais[Math.floor(Math.random() * 16)];
    }
    return cor;
}
function drawCurveBezier2() {
   // points_curveM = []
    ctx.fillStyle = "#008B8B";
    ctx.strokeStyle = "#008B8B";

  for (var i = 0; i < points_curveM.length - 1; i++) {
        ctx.beginPath();
        pa = multVec(mult(M, translate(points_curveM[i][0][0], points_curveM[i][0][1])), [0, 0, 1]);
        pb = multVec(mult(M, translate(points_curveM[i + 1][0][0], points_curveM[i + 1][0][1])), [0, 0, 1]);
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
    }

    var arc = createArc(p0, p1, p2, p3);
    var total_length = arc[0].length;
    var length_current = total_length * (frame_currentB / (total_time_bezier * fps));
    p_currentB = arc[0].getVec4S(arc[1], length_current)

    //p_current = calculatePointCurveBezier(p0, p1, p2, p3, frame_current / (total_time * fps));
    drawCircle(mult(M, translate(p_currentB.x, p_currentB.y)), ctx, gera_cor());

     var arc = createArc(p0, p1, p2, p3);
    var total_length = arc[0].length;
    var length_current = 30+total_length * (frame_currentB / (total_time_bezier * fps));
    p_currentB = arc[0].getVec4S(arc[1], length_current)
    drawCircle(mult(M, translate(p_currentB.x, p_currentB.y)), ctx, gera_cor());

     var arc = createArc(p0, p1, p2, p3);
    var total_length = arc[0].length;
    var length_current = 60+total_length * (frame_currentB / (total_time_bezier * fps));
    p_currentB = arc[0].getVec4S(arc[1], length_current)
    drawCircle(mult(M, translate(p_currentB.x, p_currentB.y)), ctx, gera_cor());
    //var p_currentB = calculatePointCurveBezier(p0, p1, p2, p3,frame_currentB / (total_timeB * fps));
   
    //drawCircle(mult(M, translate(p_currentB[0][0], p_currentB[0][1])), ctx, "#00FFFF");
    
}
function calculatePointsCurveBezier(p0, p1, p0l, p1l) {
    q = [
        [p0[0], p0[1]],
        [p1[0], p1[1]],
        [p0l[0], p0l[1]],
        [p1l[0], p1l[1]]
    ];
    console.log("Olá mundo")
    for (var i = 0; i <= np; i++) {
        u = (1. * (i)) / np;
        p = mult(getMatrixBuBrezier(u), q);
        points_curveM.push([p[0], p[1]]);
    }
}
function calculatePointCurveHermite(p0, p1, p0l, p1l,t) {
    q = [
        [p0[0], p0[1]],
        [p1[0], p1[1]],
        [p0l[0], p0l[1]],
        [p1l[0], p1l[1]]
    ];

       return mult(getMatrixBuhermite(t), q);
      
    }
//////////////////////////////////////Bonus 4///////////////////////////////////

function setPacManBezier(p0, p1, p2, p3){
    points_curveM = []
    ctx.beginPath();
    M = transformCanvas(canvas.width, canvas.height);
    ctx.font = "14px Arial";
    pos0 = multVec(mult(M, translate(p0[0], p0[1])), [0, 0, 1]);
    pos1 = multVec(mult(M, translate(p1[0], p1[1])), [0, 0, 1]);
    pos2 = multVec(mult(M, translate(p2[0], p2[1])), [0, 0, 1]);
    pos3 = multVec(mult(M, translate(p3[0], p3[1])), [0, 0, 1]);
    
    calculatePointsCurveBezier(p0, p1, p2, p3);
    ctx.lineWidth = 1.5;
    drawCurveBezier2();
    ctx.fillStyle = "#ff836444";
    ctx.strokeStyle = "#ff836444";
    drawArrow(ctx, pos0[0], pos0[1], pos2[0], pos2[1]);
    drawArrow(ctx, pos1[0], pos1[1], pos3[0], pos3[1]);
    var img = new Image();
    img.src = 'pacaman.png';
    ctx.fillStyle = "#494949";
    ctx.fillText("p0", pos0[0] + 7, pos0[1] - 7);
    ctx.fillText("p1 ", pos1[0] +7, pos1[1] - 7);
    ctx.fillText("p2", pos2[0] + 7, pos2[1] - 7);
    ctx.drawImage(img, pos3[0] + 20, pos3[1] - 20 );
    drawCircle(mult(M, translate(p0[0], p0[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p1[0], p1[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p2[0], p2[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p3[0], p3[1])), ctx, "#FFFFFF");
    


}



function setTimeHermite(value) {
    total_time_hermite = value;
}

function setTimeBezier(value) {
    total_time_bezier = value;
}

save.addEventListener("click", function() {

    var fullQuality = canvas.toDataURL('image/png', 1.0);
    window.location.href = fullQuality;
});



textarea.addEventListener("input", drawCanvas);
window.addEventListener("load", drawCanvas);
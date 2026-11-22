var cnvs = document.getElementById('canvasExperiment');
cnvs.width = 720;
cnvs.height = 720;

const BACKGROUND = "#000000";
const FOREGROUND = "#ff2547";

const FPS = 60;
const size = 0.5;
const axisLimit = 10; 
var cam = 3.0;

// imagine the coordinate system
/*       ^
		 |
		 | (0,0)
		 |/
---------|---------axisLimit ->
		 |
		 |
		 |
	  axisLimit
*/

const ctx = cnvs.getContext("2d");

function clear(){
	ctx.fillStyle = BACKGROUND;
	ctx.fillRect(0,0,cnvs.width,cnvs.height);
}

function point({x,y}){
	
	ctx.beginPath();
	ctx.arc(x-size/2,y-size/2, size, 0, 2*Math.PI);
	ctx.fillStyle = "white";
	ctx.fill();// circular vertices
	ctx.closePath();
}

// Normalisation of point
function renderPoint(p){
	return {
		x: (p.x/axisLimit+1)/2*cnvs.width,
		y: (-p.y/axisLimit+1)/2*cnvs.height,
	}
}

function renderPoint_all(vertices_2d){
	for(let i=0;i<vertices_2d.length;i++) vertices_2d[i] = renderPoint(vertices_2d[i]);
	return vertices_2d;
}

function project({x, y, z})
{
	z=z+cam;
	return {
		x: x/z,
		y: y/z,
	}
}

function project_all(vertices){
	vertices_2d = [];
	for(let i=0; i<vertices.length; i++)
	{
		vertices_2d[i] = project(vertices[i]);
	}
	return vertices_2d;
}

function translate_z({x,y,z}, dz) {
	return {
	x,
	y,
	z: z+dz,
	}
}
function translate_all_xz(vertices, dz){
	for(let i=0; i<vertices.length; i++)
	{
		vertices[i] = translate_z(vertices[i], dz);
	}
	return vertices;
}

function rotate_xz({x, y, z}, angle){
	return {
	x: x*Math.cos(angle)-z*Math.sin(angle),
	y: y,
	z: x*Math.sin(angle)+z*Math.cos(angle),
	}
}
function rotate_all_xz(vertices, angle){
	for(let i=0; i<vertices.length; i++)
	{
		vertices[i] = rotate_xz(vertices[i], angle);
	}
	return vertices;
}

clear();
arrray_size = 35;

var randPoints = [];

var points = [
{x:1,y:1,z:-1},
{x:1,y:-1,z:-1},
{x:-1,y:-1,z:-1},
{x:-1,y:1,z:-1},
{x:1,y:1,z:1},
{x:1,y:-1,z:1},
{x:-1,y:-1,z:1},
{x:-1,y:1,z:1},
]

var polygon = [
{x:0, y:3, z:0},
{x:2, y:2, z:0},
{x:2, y:-2, z:0},
{x:-2, y:-2, z:0},
{x:-2, y:2, z:0},
]

pointLimit = axisLimit/4;

for(var i=0; i<arrray_size; i++)
{
	randPoints[i] = 
	{
	x: pointLimit*(0.5-Math.random()),
	y: pointLimit*(0.5-Math.random()),
	z: pointLimit*(0.5-Math.random()),
	}
}

var edges = [
	[0, 1, 2, 3],
	[4, 5, 6, 7],
	[0, 4],
	[1, 5],
	[2, 6],
	[3, 7],
]

var randEdges = [];

for(var i=0; i<15; i++) // number of set of edges
{
	var edge = [];
	edgeSetLength = Math.floor(Math.random()*5);
	for(let j=0; j<edgeSetLength; j++)
	{
		edge[j] = Math.floor(Math.random()*10)
	}
	randEdges[i] = edge;
}
console.log("points: "+JSON.stringify(randPoints))
console.log("edges: "+randEdges);

var theta = 0;
const angle = 1*Math.PI/2;
function pointLoad()
{
	// for (const p of points) 
		// {
			// point(renderPoint(project(rotate_xz(p, theta))));
		// }
	// for (const e of randEdges) {
		// for(var i=0; i<e.length; i++){
		// line(
		// renderPoint(project(translate_z(rotate_xz(randPoints[e[i]], theta),dz))),
		// renderPoint(project(translate_z(rotate_xz(randPoints[e[(i+1)%e.length]], theta),dz)))
		// );
		// }
	// }
	
	// All edges
	for (var i=0; i<randPoints.length; i++) {
		for(var j=i+1; j<randPoints.length; j++){
		line(
		renderPoint(project(translate_z(rotate_xz(randPoints[i], theta),dz))),
		renderPoint(project(translate_z(rotate_xz(randPoints[j], theta),dz)))
		);
		}
	}
	
}

function line(p1, p2) {
    ctx.strokeStyle = "blue";
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.lineWidth = 5;
	ctx.stroke();
}

function triangleFill(v1, v2, v3, color = "royalblue"){
	ctx.beginPath();
	ctx.moveTo(v1.x, v1.y);
	ctx.lineTo(v2.x, v2.y);
	ctx.lineTo(v3.x, v3.y);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
}

function surface(vertices_2d)
{
	if(vertices_2d.length <3) {
	console.log("Error: Minimum 3 vertices needed for surface fill");
	return;
	}
	for(let i=1; i<vertices_2d.length-1;i++)
	{
		//console.log(vertices_2d[0], vertices_2d[i], vertices_2d[i+1])
		triangleFill(vertices_2d[0], vertices_2d[i], vertices_2d[i+1], FOREGROUND); // Triangle fan technique
	}
}

function surface_all(vertices_2d){
	if(vertices_2d.length <3) {
	console.log("Error: Minimum 3 vertices needed for surface fill");
	return;
	}
	
	for(let j=0;j<vertices_2d.length-2;j++){
		for(let i=j; i<vertices_2d.length-1;i++)
		{
			//console.log(vertices_2d[0], vertices_2d[i], vertices_2d[i+1])
			triangleFill(vertices_2d[j], vertices_2d[i], vertices_2d[i+1], FOREGROUND); // Triangle fan technique
			point(vertices_2d[j]);
			point(vertices_2d[i]);
			point(vertices_2d[i+1])
		}
	}
}


function drawSurface() {
	// surface(renderPoint_all(project_all(translate_all_xz(rotate_all_xz(randPoints, theta), 0))));
	// pointLoad();
	surface_all(renderPoint_all(project_all(translate_all_xz(rotate_all_xz(randPoints, theta), 0))));
}

// point(renderPoint(project({x:0,y:0,z:0})));
var dz=1;
const angleLimit = 2*Math.PI;
function frame(){
	clear();
	const dt = 1/FPS;
	// dz += 1*dt;
	theta = angle*dt%angleLimit;
	drawSurface();
	setTimeout(frame, 1000/FPS);
}
setTimeout(frame, 1000/FPS);

const z_dir = document.getElementById("z_dir");

const dir_z = -0.2; // displacement per second
document.addEventListener('keydown', (event) => {
	if(event.key=='w') cam += dir_z;
	if(event.key=='s') cam -= dir_z;
	z_dir.textContent = "z="+cam.toFixed(2);
	// if(event.key=='w') cam += ds;
	// if(event.key=='w') cam += ds;
});

var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var cubeNumber = [];

var scaleCube = 0.10;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var RandomxAxis = 0;
var RandomyAxis = 1;
var RandomzAxis = 2;



var axis = 0;

var rotationSpeed = 0;

var theta = [ 0, 0, 0 ];

var mvMatrix;

var modelView;
var scaleLoc;

var RandomRotationAxis;

var rotationAxis;
cubeXlocation = [];
cubeYlocation = [];
cubeZlocation = [];
cubeRotationSpeed = [];
cubeCurrentRotation = [];

var index = 0;
window.onload = function init()
{

    canvas = document.getElementById( "gl-canvas" );

    colorCube();
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    RandomRotationSpeed = (Math.random() * 10) - 5;

    canvas.addEventListener("mousedown", function(){

        //HW470: Each click store information for each and every cube
        cubeXlocation[index] = 2*event.clientX/canvas.width-1; //X location
        cubeYlocation[index] = 2*(canvas.height-event.clientY)/canvas.height-1; //Y location
        cubeZlocation[index] = Math.random() * 1; //Z location
        cubeRotationSpeed[index] = (Math.random() * 10) - 5; //Rotation Speed
        cubeCurrentRotation[index] = Math.random() * 25;

        index++;

    } );


    

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 0.9, 0.9, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0. );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation( program, "modelView" );
    scaleLoc = gl.getUniformLocation(program, "scaleCube");
    
    //event listeners for buttons

    document.getElementById("slider").onchange = function() {
        scaleCube = (event.srcElement.value)/100;
    };
    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
    document.getElementById( "RandomButton" ).onclick = function () {
        RandomzAxis = Math.random() * 90;
        RandomyAxis = Math.random() * 90;
        RandomxAxis = Math.random() * 90;
        axis = 3;
        
        RandomRotationAxis = vec3(RandomxAxis, RandomyAxis, RandomzAxis);
    };


    render();
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(var i = 0; i < index; i++){
        //HW470: Increment the rotationSpeed for each 
        cubeCurrentRotation[i] += cubeRotationSpeed[i];

        //HW470: Select which axis to rotate on based on which button is pressed.
        if(axis == 0){
            rotationAxis = rotateX(cubeCurrentRotation[i]);
        }else if(axis == 1){
            rotationAxis = rotateY(cubeCurrentRotation[i]);
        }else if(axis == 2){
            rotationAxis = rotateZ(cubeCurrentRotation[i]);
        }else{
            rotationAxis = rotate(cubeCurrentRotation[i], RandomRotationAxis);
        }


        //HW470: Send the model view matrix to the gpu
        var scaleMat = scalem(scaleCube,scaleCube,scaleCube);
        var transMat = translate(cubeXlocation[i], cubeYlocation[i], cubeZlocation[i]);
        mvMatrix = mult(rotationAxis, scaleMat);
        mvMatrix = mult(transMat, mvMatrix);

        gl.uniformMatrix4fv(modelView, gl.FALSE, flatten(mvMatrix));

        
        gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
    }
    requestAnimFrame( render );
}


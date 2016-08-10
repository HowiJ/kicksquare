
var //New THREE.js Scene
scene      = new THREE.Scene(),
//New THREE.js Camera (There's multiple but for now, we use this one)
//                                      ( FOV, Aspect Ratio (Generally want width/height), near clipping plane, far clipping plane )
camera     = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100 ),
//Renderer, there's more than just WebGL but for now we use this one.
renderer   = new THREE.WebGLRenderer();

//Set the size of the renderer (width, height, optional boolean for keep size but smaller resolution);
renderer.setSize( window.innerWidth, window.innerHeight );
//Add it to the document
document.body.appendChild( renderer.domElement );
window.onresize = function(e) {
    renderer.setSize( window.innerWidth, window.innerHeight );
}



var //Object that contains all points and fill faces of the cube
    geometry = function(geo, size) {
        if (geo == "box") {
            return new THREE.BoxGeometry( size.x, size.y, size.z );
        } else if ( geo == "Sphere" ) {
            return new THREE.SphereGeometry( size.r, size.num );
        }
    }
    //Provide the box with a texture. (Mesh and color) (in this case: basic material)
    material = function(mat, options) {
        if (mat == "basic") {
            return new THREE.MeshBasicMaterial( options );
        } else if (mat == "normal") {
            return new THREE.MeshNormalMaterial( options );
        }
    };


var objs         = [];

var randColor = function() {
    valid = 'abcdefABCDEF1234567890';
    color = '#';
    for (var i = 0; i < 6; i++) {
        color = color+valid[Math.floor(Math.random()*valid.length)];
    }
    return color;
}

//Add this to the scene (adds it to coordinates[0,0,0])
var obj  = new THREE.Mesh( geometry('box', {x: 1, y: 1, z: 0}), material('basic', {color: 'blue', wireframe: false}) ),
    bag  = new THREE.Mesh( geometry('box', {x: 0.5, y: 0.5, z: 0}), material('basic', {color: 'red', wireframe: false }) ),
    velo = {
        x: 0,
        y: 0 },
    veloBag = {
        x: 0,
        y: 0 };

obj.position.x = -10;
bag.position.x = 0;

var boundBox = new THREE.Box3().setFromObject( scene );
var objBox   = new THREE.Box3().setFromObject( obj );
var bagBox   = new THREE.Box3().setFromObject( bag );

scene.add(obj);
scene.add(bag);


// //Since camera spawns at [0,0,0], it would be inside the cube we made, so we set the camera away from the cube.
camera.position.z = 10;

////////////////////////////////////////////////////////////
//                       VARIABLES                        //
////////////////////////////////////////////////////////////
var check = {
    mousedown: false
}
var m = {
    prev: {x: window.innerWidth/2, y: window.innerHeight/2}
}
var k = {
    up    : false,
    down  : false,
    left  : false,
    right : false,
    kicking: false
}

////////////////////////////////////////////////////////////
//                     EVENT HANDLERS                     //
////////////////////////////////////////////////////////////
document.onmousedown = function(e) {
    console.log(e.pageX, e.pageY)
    check.mousedown = true;  }
document.onmouseup   = function(e) {
    check.mousedown = false; }
document.onmousemove = function(e) {
    if (check.mousedown) {
    }
}
document.onkeydown = function(e) {
    console.log(e.keyCode);
    moveCase(e, true); }
document.onkeyup = function(e) {
    moveCase(e, false); }

////////////////////////////////////////////////////////////
//                        MOVEMENT                        //
////////////////////////////////////////////////////////////
var acceleration = 0.02,
    friction     = 0.01,
    topSpeed     = 0.20,
    direction    = {up: false, down: false, left: false, right: false},
    kickStr      = 2;

function moveCase(e, bool) {
    switch (e.keyCode) {
        case 38: //up
            k.up = bool;
            break;
        case 40: //down
            k.down = bool;
            break;
        case 37: //left
            k.left = bool;
            break;
        case 39: //right
            k.right = bool;
            break;
        case 32: //space
            if (k.kicking) {
                veloBag.x = velo.x*kickStr;
                veloBag.y = velo.y*kickStr; }
                break;
        case 8: //backspace
            obj.position.x = -10;
            obj.position.y = 0;
            obj.position.z = 0;

            bag.position.x = 0;
            bag.position.y = 0;
            bag.position.z = 0;
            break;
    }
}
function moveObj() {
    if (k.up) {
        if (velo.y+acceleration >= topSpeed) {
            velo.y = topSpeed;
        } else if (velo.y+ acceleration < topSpeed) {
            velo.y += acceleration;
        }
    } else if (k.down) {
        if (velo.y-acceleration <= -topSpeed) {
            velo.y = -topSpeed;
        } else if (velo.y-acceleration > -topSpeed) {
            velo.y -= acceleration;
        }
    } else {
        if (velo.y < 0) {
            if (velo.y+friction > 0) {
                velo.y = 0;
            } else {
                velo.y += friction;
            }
        } else if (velo.y > 0) {
            if (velo.y-friction < 0) {
                velo.y = 0;
            } else {
                velo.y -= friction;
            }
        }
    }

    if (k.left) {
        if (velo.x-acceleration <= -topSpeed) {
            velo.x = -topSpeed;
        } else if (velo.x-acceleration > -topSpeed) {
            velo.x -= acceleration;
        }
    } else if (k.right) {
        if (velo.x+acceleration >= topSpeed) {
            velo.x = topSpeed;
        } else if (velo.x+acceleration < topSpeed) {
            velo.x += acceleration;
        }
    } else {
        if (velo.x < 0) {
            if (velo.x+friction > 0) {
                velo.x = 0;
            } else {
                velo.x += friction;
            }
        } else if (velo.x > 0) {
            if (velo.x-friction < 0) {
                velo.x = 0;
            } else {
                velo.x -= friction;
            }
        }
    }


    obj.position.x += velo.x;
    obj.position.y += velo.y;
}
function moveBag () {
    bag.position.x += veloBag.x;
    bag.position.y += veloBag.y;
    if (veloBag.x > 0) {
        if (veloBag.x - 0.01 < 0) {
            veloBag.x = 0;
        } else {
            veloBag.x -= 0.005;
        }
    }
    if (veloBag.x < 0) {
        if (veloBag.x + 0.01 > 0) {
            veloBag.x = 0;
        } else {
            veloBag.x += 0.005;
        }
    }

    if (veloBag.y > 0) {
        if (veloBag.y - 0.01 < 0) {
            veloBag.y = 0;
        } else {
            veloBag.y -= 0.005;
        }
    }
    if (veloBag.y < 0) {
        if (veloBag.y + 0.01 > 0) {
            veloBag.y = 0;
        } else {
            veloBag.y += 0.005;
        }
    }
}

////////////////////////////////////////////////////////////
//                       COLLISION                        //
////////////////////////////////////////////////////////////
function collision() {
    k.kicking = false;
    var actualX = Math.abs(bag.position.x - obj.position.x);
    var actualY = Math.abs(bag.position.y - obj.position.y);

    var kickX = Math.abs(bag.position.x - obj.position.x);
    var kickY = Math.abs(bag.position.y - obj.position.y);

    var collisionX = bagBox.size().x/2 + objBox.size().x/2;
    var collisionY = bagBox.size().y/2 + objBox.size().y/2;

    if ( actualX <= collisionX  ) {
        if (actualY <= collisionY) {

            veloBag.x = velo.x;
            veloBag.y = velo.y;
            if (velo.x > 0) {
            }
            velo.x -= velo.x/5;
            velo.y -= velo.y/5;

        }
    }
    if ( kickX <= collisionX ) {
        if ( kickY <= collisionY ) {
            console.log(kickX, collisionX);
            k.kicking = true;
        }
    }
}
////////////////////////////////////////////////////////////
//                         RENDER                         //
////////////////////////////////////////////////////////////
// //Creates a loop that renders at 60 times a second
function render() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );

    moveObj();
    moveBag();
    collision();
}
render();

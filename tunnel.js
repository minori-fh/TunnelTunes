let scene, camera, renderer, cube;
let amountX = 50; 
let amountY = 50;
let numPoints = amountX * amountY; 
let separation = 100; 
let mouseX = 0; 
let mouseY = 0; 
let count = 0; 
let particles; 

function init(){
    // Create scene
    scene = new THREE.Scene();
    // Create perspective camera (FOV, degress, aspect, near plane, far plane)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 10000);
    camera.position.z = 1000; 
    
    
    // Create points positioning and scale
    let positions = new Float32Array(numPoints * 3); //3 for x y z positioning
    let scales = new Float32Array(numPoints);

    let i = 0; 
    let j = 0; 

    for (let ix = 0; ix < amountX; ix++){
        for (let iy = 0; iy < amountY; iy++){
            positions[i] = (ix * separation) - ((amountX * separation)/2) //position x
            positions[i+1] = 0 //position y
            positions[i+2] = (iy * separation) - ((amountY * separation)/2) //position z

            scales[j] = 5; 

            i += 3;
            j ++;
        }
    }

    console.log(positions)
    console.log(scales)

    // Create geometry
    let geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute( positions, 3));
    geometry.addAttribute('scale', new THREE.BufferAttribute( scales, 1));

    // Create material
    let material = new THREE.ShaderMaterial( {
        uniforms: {
            color: { value: new THREE.Color( 0xffffff ) },
        },
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent
    } );

    // Create points with geometry and material
    particles = new THREE.Points( geometry, material );
    scene.add( particles );
    
    // WebGL Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight); //size of renderer
    renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild(renderer.domElement);
}


function animate() {
    requestAnimationFrame( animate );
    camera.position.set(0, 200, 200)
    renderer.render( scene, camera )
    // render();
}

function waves(){
    
}

// function render() {
//     camera.position.x += ( mouseX - camera.position.x ) * .05;
//     camera.position.y += ( - mouseY - camera.position.y ) * .05;
//     camera.lookAt( scene.position );
//     var positions = particles.geometry.attributes.position.array;
//     var scales = particles.geometry.attributes.scale.array;
//     var i = 0, j = 0;

//     for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
//         for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
//             positions[ i + 1 ] = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) +
//                             ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
//             scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 8 +
//                             ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 8;
//             i += 3;
//             j ++;
//         }
//     }

//     particles.geometry.attributes.position.needsUpdate = true;
//     particles.geometry.attributes.scale.needsUpdate = true;
//     renderer.render( scene, camera );
//     count += 0.1;
// }

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight); //size of renderer
}

window.addEventListener('resize', onWindowResize, false)

init();
animate();

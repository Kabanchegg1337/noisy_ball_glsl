import './style.css'
import * as THREE from 'three'

import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";

import vertexParticles from "./shaders/particles/vertex.glsl";
import fragmentParticles from "./shaders/particles/fragment.glsl";

import vertexBackground from "./shaders/background/vertex.glsl";
import fragmentBackground from "./shaders/background/fragment.glsl";

export default class Sketch {
    constructor() {

        this.settings = {
            progress: 0,
            stage: 0,
            clicks: 0,
        }

        this.time = 0;

        //Perspective camera
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	    this.camera.position.z = 4;
        this.camera.position.y = 0;
        window.camera = this.camera;
        if (window.innerWidth < 500){
            this.camera.position.z = 5.5
        }

        //Scene
	    this.scene = new THREE.Scene();

        //Renderer
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor(0x110011);
        this.canvas = document.body.appendChild( this.renderer.domElement );


        //Params
        this.height = this.canvas.offsetHeight;
        this.width = this.canvas.offsetWidth;


        this.addMesh();
        this.addBackground();
        this.addParticles();
        this.render();
        this.handleResize();
    }
  
    addParticles() {
        this.particlesGeometry = new THREE.BufferGeometry();

        let N = 10000 // number of points
        let position = [] // array of points
        let rad = 1.8;

        let inc = Math.PI * (3 - Math.sqrt(5));
        let off = 2 / N;
        for (let i = 0; i < N; i++) { 
        let y = i * off - 1 + (off / 2);
        let r = Math.sqrt(1 - y*y);
        let phi = i * inc;
        position[3*i] = rad*Math.cos(phi)*r;
        position[3*i + 1] = rad*y;
        position[3*i + 2] = rad*Math.sin(phi)*r;
        }

        this.particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));



        this.particlesMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: {type: "f", value: 0.}
            },
            vertexShader: vertexParticles,
            fragmentShader: fragmentParticles,
            transparent: true,
            blending: THREE.AdditiveBlending
        })

        this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial);
        this.scene.add(this.particles);
    }


    addBackground() {
        this.backgroundGeometry = new THREE.BufferGeometry();

        let N = 810 // number of points
        let position = [] // array of points 
        let size = [];
        let rad = 4;

        let inc = Math.PI * (3 - Math.sqrt(5));
        let off = 2 / N;
        for (let i = 0; i < N; i++) { 
        let y = i * off - 1 + (off / 2);
        let r = Math.sqrt(1 - y*y);
        let phi = i * inc;
        position[3*i] = rad*Math.cos(phi)*r;
        position[3*i + 1] = rad*y;
        position[3*i + 2] = rad*Math.sin(phi)*r;
        size[i] = 20 * Math.random() + 0.5;
        }

        this.backgroundGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
        this.backgroundGeometry.setAttribute('size', new THREE.Float32BufferAttribute(size, 1));



        this.backgroundMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: {type: "f", value: 0.}
            },
            vertexShader: vertexBackground,
            fragmentShader: fragmentBackground,
            transparent: true,
        })

        this.background = new THREE.Points(this.backgroundGeometry, this.backgroundMaterial);
        this.scene.add(this.background);
    }
    addMesh() {
        this.geometry = new THREE.SphereBufferGeometry(1.2, 150, 150);


        this.material = new THREE.MeshNormalMaterial();

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: {type: "f", value: 0.},
                progress: {type: "f", value: 0.},
                resolution: {type: "v4", value: new THREE.Vector4()},
                mouse: {type: "v2", value: new THREE.Vector2(0, 0)},

            },
            vertexShader: vertex,
            fragmentShader: fragment,
        })

        this.mesh = new THREE.Mesh( this.geometry, this.material );


        this.scene.add( this.mesh );
    }

    
    render(){
        this.time += 0.01;
        
        this.material.uniforms.time.value = this.time;
        this.material.uniforms.progress.value = this.settings.progress;
        this.mesh.position.y = Math.sin(this.time) * 0.3;

        this.particlesMaterial.uniforms.time.value = this.time;
        this.particles.rotation.y = this.time / 3;
        this.particles.position.y = Math.sin(this.time) * 0.3;


        this.backgroundMaterial.uniforms.time.value = this.time;
        this.background.rotation.set(this.time / 40, this.time / 50, this.time / 100);

	    this.renderer.render( this.scene, this.camera );
        window.requestAnimationFrame(this.render.bind(this));
    }

    handleResize() {
        const that = this;
        window.addEventListener('resize', handle);

        function handle() {
            that.camera.aspect = window.innerWidth / window.innerHeight
            that.camera.updateProjectionMatrix()
            that.renderer.setSize(window.innerWidth, window.innerHeight)
        }

    }
}


const sketch = new Sketch();
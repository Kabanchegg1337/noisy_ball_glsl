import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

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
        this.mouse = new THREE.Vector2(0, 0);

        //Perspective camera
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	    this.camera.position.z = 3.4;
        this.camera.position.y = 2;
        if (window.innerWidth < 500){
            this.camera.position.z = 7.5
        }


        //Orthographic camera
        /* let fructumSize = 1;
        let aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.OrthographicCamera(fructumSize / -2, fructumSize / 2, fructumSize / 2, fructumSize / -2, -1000, 1000);
        this.camera.position.set(0, 0, 2); */


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


        //Orbit controls
        this.controls = new OrbitControls(this.camera, this.canvas);



        //this.mouseEvents();
        //this.touchEvents();
        this.addMesh();
        this.addBackground();
        this.addParticles();
        //this.aspect();
        //this.enableSettings();
        this.render();
        this.handleResize();
    }


    enableSettings() {
        this.gui = new dat.GUI();

        this.gui.add(this.settings, "progress", 0, 1, 0.01);
    }
    mouseEvents() {
        const that = this;
        function onMouseMove( event ) {

            that.mouse.x = ( event.clientX / window.innerWidth )  - 0.5;
            that.mouse.y = - ( event.clientY / window.innerHeight ) + 0.5;

            that.camera.rotation.y = that.mouse.x * 0.1
            that.camera.rotation.x = that.mouse.y * 0.1
            //that.material.uniforms.mouse.value = new THREE.Vector2(that.mouse.x, that.mouse.y);
        
        }
        window.addEventListener( 'mousemove', onMouseMove, false );
    }
    touchEvents() {
        const that = this
        this.canvas.addEventListener("touchmove", (e) => {
            
            e.preventDefault();
            that.mouse.x = ( e.targetTouches[0].clientX / window.innerWidth )  - 0.5;
            that.mouse.y = - ( e.targetTouches[0].clientY / window.innerHeight ) + 0.5;

            that.material.uniforms.mouse.value = new THREE.Vector2(that.mouse.x, that.mouse.y);
        }, false)
    }
    aspect() {
        this.imageAspect = 1;
        console.log(this.imageAspect)
        let a1; let a2;
        if (this.height / this.width > this.imageAspect) {
            a1 = (this.width / this.height) * this.imageAspect;
            a2 = 1;
        }
        else {
            a1 = 1;
            a2 = (this.height/this.width) / this.imageAspect;
        }
        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;
    }

    addParticles() {
        this.particlesGeometry = new THREE.BufferGeometry();

        let N = 10000 // number of points
        let position = [] // array of poinst 
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
        let position = [] // array of poinst 
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
            //depthTest: false,
            //depthWrite: false,
            //alphaTest: false,
            //side: THREE.DoubleSide
        })

        this.mesh = new THREE.Mesh( this.geometry, this.material );


        this.scene.add( this.mesh );
    }

    
    render(){
        this.time += 0.01;
	    this.renderer.render( this.scene, this.camera );
        this.material.uniforms.time.value = this.time;
        this.material.uniforms.progress.value = this.settings.progress;
        this.mesh.position.y = Math.sin(this.time) * 0.3;



        this.particlesMaterial.uniforms.time.value = this.time;
        this.particles.rotation.y = this.time / 3;
        this.particles.position.y = Math.sin(this.time) * 0.3;



        this.backgroundMaterial.uniforms.time.value = this.time;
        this.background.rotation.set(this.time / 40, this.time / 50, this.time / 100);

        //this.scene.rotation.y = this.time / 20;

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
varying vec2 vUv;

uniform float time;
varying vec3 vPos;


void main() {

    float dist = length(gl_PointCoord - vec2(0.5));
    float disc = 1. - smoothstep(0.45, 0.5, dist);
    if (disc < 0.001) discard;

    gl_FragColor = vec4(0.826, 0.999, 0.999, 0.5 - dist);
}
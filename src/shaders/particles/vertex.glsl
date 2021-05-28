varying vec2 vUv;
uniform float progress;
uniform float time;
varying vec3 vPos;

void main() {
    vUv = uv;

    vPos = position;

    vec3 p = position;

    p.y += 0.1 * (sin(p.y * 10. + time * 5.)*0.5 + 0.5);
    p.z += 0.1 * (sin(p.y * 10. + time * 5.)*0.5 + 0.5);
    
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
    gl_PointSize = 2. * (1. / - mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
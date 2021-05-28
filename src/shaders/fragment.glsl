varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vColor;
uniform float time;
uniform float progress;

uniform vec4 resolution;

void main() {

    vec2 newUv = (vUv - 0.5) * resolution.zw + vec2(0.5);

    vec3 light = vec3(0.);

    vec3 skyColor = vec3(1.000, 1.000, 0.547);
    vec3 groundColor = vec3(0.562, 0.275, 0.111);

    vec3 lightDirection = normalize(vec3(-2., -1., -0.));
    light += dot(lightDirection, vNormal);


    light = mix(skyColor, groundColor, dot(lightDirection, vNormal));



    //gl_FragColor = vec4(vNormal, 1.);
    //gl_FragColor = vec4(vColor, 1.);
    gl_FragColor = vec4(light * vColor, 1.);
}
//This file is automatically rebuilt by the Speed3DGis build process.
class equirect_frag{static theWord() {
    return "uniform sampler2D tEquirect;\n\
\n\
varying vec3 vWorldPosition;\n\
\n\
#include <common>\n\
\n\
void main() {\n\
\n\
	vec3 direction = normalize( vWorldPosition );\n\
\n\
	vec2 sampleUV;\n\
\n\
	sampleUV.y = asin( clamp( direction.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n\
\n\
	sampleUV.x = atan( direction.z, direction.x ) * RECIPROCAL_PI2 + 0.5;\n\
\n\
	gl_FragColor = texture2D( tEquirect, sampleUV );\n\
\n\
}\n\
";
}} export {equirect_frag};
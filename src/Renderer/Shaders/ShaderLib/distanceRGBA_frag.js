//This file is automatically rebuilt by the Speed3DGis build process.
class distanceRGBA_frag{static theWord() {
    return "#define DISTANCE\n\
\n\
uniform vec3 referencePosition;\n\
uniform float nearDistance;\n\
uniform float farDistance;\n\
varying vec3 vWorldPosition;\n\
\n\
#include <common>\n\
#include <packing>\n\
#include <uv_pars_fragment>\n\
#include <map_pars_fragment>\n\
#include <alphamap_pars_fragment>\n\
#include <clipping_planes_pars_fragment>\n\
\n\
void main () {\n\
\n\
	#include <clipping_planes_fragment>\n\
\n\
	vec4 diffuseColor = vec4( 1.0 );\n\
\n\
	#include <map_fragment>\n\
	#include <alphamap_fragment>\n\
	#include <alphatest_fragment>\n\
\n\
	float dist = length( vWorldPosition - referencePosition );\n\
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );\n\
	dist = saturate( dist ); // clamp to [ 0, 1 ]\n\
\n\
	gl_FragColor = packDepthToRGBA( dist );\n\
\n\
}\n\
";
}} export {distanceRGBA_frag};
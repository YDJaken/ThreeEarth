//This file is automatically rebuilt by the Speed3DGis build process.
class linedashed_frag{static theWord() {
    return "uniform vec3 diffuse;\n\
uniform float opacity;\n\
\n\
uniform float dashSize;\n\
uniform float totalSize;\n\
\n\
varying float vLineDistance;\n\
\n\
#include <common>\n\
#include <color_pars_fragment>\n\
#include <fog_pars_fragment>\n\
#include <logdepthbuf_pars_fragment>\n\
#include <clipping_planes_pars_fragment>\n\
\n\
void main() {\n\
\n\
	#include <clipping_planes_fragment>\n\
\n\
	if ( mod( vLineDistance, totalSize ) > dashSize ) {\n\
\n\
		discard;\n\
\n\
	}\n\
\n\
	vec3 outgoingLight = vec3( 0.0 );\n\
	vec4 diffuseColor = vec4( diffuse, opacity );\n\
\n\
	#include <logdepthbuf_fragment>\n\
	#include <color_fragment>\n\
\n\
	outgoingLight = diffuseColor.rgb; // simple shader\n\
\n\
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\
\n\
	#include <premultiplied_alpha_fragment>\n\
	#include <tonemapping_fragment>\n\
	#include <encodings_fragment>\n\
	#include <fog_fragment>\n\
\n\
}\n\
";
}} export {linedashed_frag};
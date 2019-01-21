//This file is automatically rebuilt by the Speed3DGis build process.
class meshbasic_frag{static theWord() {
    return "uniform vec3 diffuse;\n\
uniform float opacity;\n\
\n\
#ifndef FLAT_SHADED\n\
\n\
	varying vec3 vNormal;\n\
\n\
#endif\n\
\n\
#include <common>\n\
#include <color_pars_fragment>\n\
#include <uv_pars_fragment>\n\
#include <uv2_pars_fragment>\n\
#include <map_pars_fragment>\n\
#include <alphamap_pars_fragment>\n\
#include <aomap_pars_fragment>\n\
#include <lightmap_pars_fragment>\n\
#include <envmap_pars_fragment>\n\
#include <fog_pars_fragment>\n\
#include <specularmap_pars_fragment>\n\
#include <logdepthbuf_pars_fragment>\n\
#include <clipping_planes_pars_fragment>\n\
\n\
void main() {\n\
\n\
	#include <clipping_planes_fragment>\n\
\n\
	vec4 diffuseColor = vec4( diffuse, opacity );\n\
\n\
	#include <logdepthbuf_fragment>\n\
	#include <map_fragment>\n\
	#include <color_fragment>\n\
	#include <alphamap_fragment>\n\
	#include <alphatest_fragment>\n\
	#include <specularmap_fragment>\n\
\n\
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\
\n\
	// accumulation (baked indirect lighting only)\n\
	#ifdef USE_LIGHTMAP\n\
\n\
		reflectedLight.indirectDiffuse += texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;\n\
\n\
	#else\n\
\n\
		reflectedLight.indirectDiffuse += vec3( 1.0 );\n\
\n\
	#endif\n\
\n\
	// modulation\n\
	#include <aomap_fragment>\n\
\n\
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;\n\
\n\
	vec3 outgoingLight = reflectedLight.indirectDiffuse;\n\
\n\
	#include <envmap_fragment>\n\
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
}} export {meshbasic_frag};
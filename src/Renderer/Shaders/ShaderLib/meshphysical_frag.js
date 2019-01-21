//This file is automatically rebuilt by the Speed3DGis build process.
class meshphysical_frag{static theWord() {
    return "#define PHYSICAL\n\
\n\
uniform vec3 diffuse;\n\
uniform vec3 emissive;\n\
uniform float roughness;\n\
uniform float metalness;\n\
uniform float opacity;\n\
\n\
#ifndef STANDARD\n\
	uniform float clearCoat;\n\
	uniform float clearCoatRoughness;\n\
#endif\n\
\n\
varying vec3 vViewPosition;\n\
\n\
#ifndef FLAT_SHADED\n\
\n\
	varying vec3 vNormal;\n\
\n\
#endif\n\
\n\
#include <common>\n\
#include <packing>\n\
#include <dithering_pars_fragment>\n\
#include <color_pars_fragment>\n\
#include <uv_pars_fragment>\n\
#include <uv2_pars_fragment>\n\
#include <map_pars_fragment>\n\
#include <alphamap_pars_fragment>\n\
#include <aomap_pars_fragment>\n\
#include <lightmap_pars_fragment>\n\
#include <emissivemap_pars_fragment>\n\
#include <envmap_pars_fragment>\n\
#include <fog_pars_fragment>\n\
#include <bsdfs>\n\
#include <cube_uv_reflection_fragment>\n\
#include <lights_pars_begin>\n\
#include <lights_pars_maps>\n\
#include <lights_physical_pars_fragment>\n\
#include <shadowmap_pars_fragment>\n\
#include <bumpmap_pars_fragment>\n\
#include <normalmap_pars_fragment>\n\
#include <roughnessmap_pars_fragment>\n\
#include <metalnessmap_pars_fragment>\n\
#include <logdepthbuf_pars_fragment>\n\
#include <clipping_planes_pars_fragment>\n\
\n\
void main() {\n\
\n\
	#include <clipping_planes_fragment>\n\
\n\
	vec4 diffuseColor = vec4( diffuse, opacity );\n\
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\
	vec3 totalEmissiveRadiance = emissive;\n\
\n\
	#include <logdepthbuf_fragment>\n\
	#include <map_fragment>\n\
	#include <color_fragment>\n\
	#include <alphamap_fragment>\n\
	#include <alphatest_fragment>\n\
	#include <roughnessmap_fragment>\n\
	#include <metalnessmap_fragment>\n\
	#include <normal_fragment_begin>\n\
	#include <normal_fragment_maps>\n\
	#include <emissivemap_fragment>\n\
\n\
	// accumulation\n\
	#include <lights_physical_fragment>\n\
	#include <lights_fragment_begin>\n\
	#include <lights_fragment_maps>\n\
	#include <lights_fragment_end>\n\
\n\
	// modulation\n\
	#include <aomap_fragment>\n\
\n\
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n\
\n\
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\
\n\
	#include <tonemapping_fragment>\n\
	#include <encodings_fragment>\n\
	#include <fog_fragment>\n\
	#include <premultiplied_alpha_fragment>\n\
	#include <dithering_fragment>\n\
\n\
}\n\
";
}} export {meshphysical_frag};
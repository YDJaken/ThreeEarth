//This file is automatically rebuilt by the Speed3DGis build process.
class shadow_frag{static theWord() {
    return "uniform vec3 color;\n\
uniform float opacity;\n\
\n\
#include <common>\n\
#include <packing>\n\
#include <fog_pars_fragment>\n\
#include <bsdfs>\n\
#include <lights_pars_begin>\n\
#include <shadowmap_pars_fragment>\n\
#include <shadowmask_pars_fragment>\n\
\n\
void main() {\n\
\n\
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );\n\
\n\
	#include <fog_fragment>\n\
\n\
}\n\
";
}} export {shadow_frag};
//This file is automatically rebuilt by the Speed3DGis build process.
class lightmap_pars_fragment{static theWord() {
    return "#ifdef USE_LIGHTMAP\n\
\n\
	uniform sampler2D lightMap;\n\
	uniform float lightMapIntensity;\n\
\n\
#endif";
}} export {lightmap_pars_fragment};
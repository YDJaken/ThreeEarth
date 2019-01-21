//This file is automatically rebuilt by the Speed3DGis build process.
class lights_fragment_end{static theWord() {
    return "#if defined( RE_IndirectDiffuse )\n\
\n\
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );\n\
\n\
#endif\n\
\n\
#if defined( RE_IndirectSpecular )\n\
\n\
	RE_IndirectSpecular( radiance, clearCoatRadiance, geometry, material, reflectedLight );\n\
\n\
#endif\n\
";
}} export {lights_fragment_end};
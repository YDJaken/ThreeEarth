//This file is automatically rebuilt by the Speed3DGis build process.
class lightmap_fragment{static theWord() {
    return "#ifdef USE_LIGHTMAP\n\
\n\
	reflectedLight.indirectDiffuse += PI * texture2D( lightMap, vUv2 ).xyz * lightMapIntensity; // factor of PI should not be present; included here to prevent breakage\n\
\n\
#endif\n\
";
}} export {lightmap_fragment};
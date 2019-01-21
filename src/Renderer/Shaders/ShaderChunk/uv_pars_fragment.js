//This file is automatically rebuilt by the Speed3DGis build process.
class uv_pars_fragment{static theWord() {
    return "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\n\
\n\
	varying vec2 vUv;\n\
\n\
#endif";
}} export {uv_pars_fragment};
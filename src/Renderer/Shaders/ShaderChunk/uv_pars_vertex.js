//This file is automatically rebuilt by the Speed3DGis build process.
class uv_pars_vertex{static theWord() {
    return "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\n\
\n\
	varying vec2 vUv;\n\
	uniform mat3 uvTransform;\n\
\n\
#endif\n\
";
}} export {uv_pars_vertex};
//This file is automatically rebuilt by the Speed3DGis build process.
class skinnormal_vertex{static theWord() {
    return "#ifdef USE_SKINNING\n\
\n\
	mat4 skinMatrix = mat4( 0.0 );\n\
	skinMatrix += skinWeight.x * boneMatX;\n\
	skinMatrix += skinWeight.y * boneMatY;\n\
	skinMatrix += skinWeight.z * boneMatZ;\n\
	skinMatrix += skinWeight.w * boneMatW;\n\
	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;\n\
\n\
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n\
\n\
#endif\n\
";
}} export {skinnormal_vertex};
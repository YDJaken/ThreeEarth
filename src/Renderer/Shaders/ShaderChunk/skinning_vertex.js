//This file is automatically rebuilt by the Speed3DGis build process.
class skinning_vertex{static theWord() {
    return "#ifdef USE_SKINNING\n\
\n\
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n\
\n\
	vec4 skinned = vec4( 0.0 );\n\
	skinned += boneMatX * skinVertex * skinWeight.x;\n\
	skinned += boneMatY * skinVertex * skinWeight.y;\n\
	skinned += boneMatZ * skinVertex * skinWeight.z;\n\
	skinned += boneMatW * skinVertex * skinWeight.w;\n\
\n\
	transformed = ( bindMatrixInverse * skinned ).xyz;\n\
\n\
#endif\n\
";
}} export {skinning_vertex};
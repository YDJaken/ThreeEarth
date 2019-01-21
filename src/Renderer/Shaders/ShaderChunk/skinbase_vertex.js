//This file is automatically rebuilt by the Speed3DGis build process.
class skinbase_vertex{static theWord() {
    return "#ifdef USE_SKINNING\n\
\n\
	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n\
	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n\
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n\
	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n\
\n\
#endif";
}} export {skinbase_vertex};
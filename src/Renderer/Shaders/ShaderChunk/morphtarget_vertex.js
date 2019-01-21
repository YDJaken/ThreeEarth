//This file is automatically rebuilt by the Speed3DGis build process.
class morphtarget_vertex{static theWord() {
    return "#ifdef USE_MORPHTARGETS\n\
\n\
	transformed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\n\
	transformed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\n\
	transformed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\n\
	transformed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n\
\n\
	#ifndef USE_MORPHNORMALS\n\
\n\
	transformed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\n\
	transformed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\n\
	transformed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\n\
	transformed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n\
\n\
	#endif\n\
\n\
#endif\n\
";
}} export {morphtarget_vertex};
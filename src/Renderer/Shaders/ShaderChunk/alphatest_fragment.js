//This file is automatically rebuilt by the Speed3DGis build process.
class alphatest_fragment{static theWord() {
    return "#ifdef ALPHATEST\n\
\n\
	if ( diffuseColor.a < ALPHATEST ) discard;\n\
\n\
#endif\n\
";
}} export {alphatest_fragment};
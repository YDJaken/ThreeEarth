//This file is automatically rebuilt by the Speed3DGis build process.
class equirect_vert{static theWord() {
    return "varying vec3 vWorldPosition;\n\
\n\
#include <common>\n\
\n\
void main() {\n\
\n\
	vWorldPosition = transformDirection( position, modelMatrix );\n\
\n\
	#include <begin_vertex>\n\
	#include <project_vertex>\n\
\n\
}\n\
";
}} export {equirect_vert};
//This file is automatically rebuilt by the Speed3DGis build process.
class shadow_vert{static theWord() {
    return "#include <fog_pars_vertex>\n\
#include <shadowmap_pars_vertex>\n\
\n\
void main() {\n\
\n\
	#include <begin_vertex>\n\
	#include <project_vertex>\n\
	#include <worldpos_vertex>\n\
	#include <shadowmap_vertex>\n\
	#include <fog_vertex>\n\
\n\
}\n\
";
}} export {shadow_vert};
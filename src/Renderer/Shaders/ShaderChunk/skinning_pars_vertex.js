//This file is automatically rebuilt by the Speed3DGis build process.
class skinning_pars_vertex{static theWord() {
    return "#ifdef USE_SKINNING\n\
\n\
	uniform mat4 bindMatrix;\n\
	uniform mat4 bindMatrixInverse;\n\
\n\
	#ifdef BONE_TEXTURE\n\
\n\
		uniform sampler2D boneTexture;\n\
		uniform int boneTextureSize;\n\
\n\
		mat4 getBoneMatrix( const in float i ) {\n\
\n\
			float j = i * 4.0;\n\
			float x = mod( j, float( boneTextureSize ) );\n\
			float y = floor( j / float( boneTextureSize ) );\n\
\n\
			float dx = 1.0 / float( boneTextureSize );\n\
			float dy = 1.0 / float( boneTextureSize );\n\
\n\
			y = dy * ( y + 0.5 );\n\
\n\
			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n\
			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n\
			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n\
			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n\
\n\
			mat4 bone = mat4( v1, v2, v3, v4 );\n\
\n\
			return bone;\n\
\n\
		}\n\
\n\
	#else\n\
\n\
		uniform mat4 boneMatrices[ MAX_BONES ];\n\
\n\
		mat4 getBoneMatrix( const in float i ) {\n\
\n\
			mat4 bone = boneMatrices[ int(i) ];\n\
			return bone;\n\
\n\
		}\n\
\n\
	#endif\n\
\n\
#endif\n\
";
}} export {skinning_pars_vertex};
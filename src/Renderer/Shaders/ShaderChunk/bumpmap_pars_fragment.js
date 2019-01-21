//This file is automatically rebuilt by the Speed3DGis build process.
class bumpmap_pars_fragment{static theWord() {
    return "#ifdef USE_BUMPMAP\n\
\n\
	uniform sampler2D bumpMap;\n\
	uniform float bumpScale;\n\
\n\
	// Bump Mapping Unparametrized Surfaces on the GPU by Morten S. Mikkelsen\n\
	// http://api.unrealengine.com/attachments/Engine/Rendering/LightingAndShadows/BumpMappingWithoutTangentSpace/mm_sfgrad_bump.pdf\n\
\n\
	// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)\n\
\n\
	vec2 dHdxy_fwd() {\n\
\n\
		vec2 dSTdx = dFdx( vUv );\n\
		vec2 dSTdy = dFdy( vUv );\n\
\n\
		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;\n\
		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\n\
		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\n\
\n\
		return vec2( dBx, dBy );\n\
\n\
	}\n\
\n\
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\n\
\n\
		// Workaround for Adreno 3XX dFd*( vec3 ) bug. See #9988\n\
\n\
		vec3 vSigmaX = vec3( dFdx( surf_pos.x ), dFdx( surf_pos.y ), dFdx( surf_pos.z ) );\n\
		vec3 vSigmaY = vec3( dFdy( surf_pos.x ), dFdy( surf_pos.y ), dFdy( surf_pos.z ) );\n\
		vec3 vN = surf_norm;		// normalized\n\
\n\
		vec3 R1 = cross( vSigmaY, vN );\n\
		vec3 R2 = cross( vN, vSigmaX );\n\
\n\
		float fDet = dot( vSigmaX, R1 );\n\
\n\
		fDet *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\
\n\
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n\
		return normalize( abs( fDet ) * surf_norm - vGrad );\n\
\n\
	}\n\
\n\
#endif\n\
";
}} export {bumpmap_pars_fragment};
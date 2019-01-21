//This file is automatically rebuilt by the Speed3DGis build process.
class fog_fragment{static theWord() {
    return "#ifdef USE_FOG\n\
\n\
	#ifdef FOG_EXP2\n\
\n\
		float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * fogDepth * fogDepth * LOG2 ) );\n\
\n\
	#else\n\
\n\
		float fogFactor = smoothstep( fogNear, fogFar, fogDepth );\n\
\n\
	#endif\n\
\n\
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n\
\n\
#endif\n\
";
}} export {fog_fragment};
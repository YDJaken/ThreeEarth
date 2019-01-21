//This file is automatically rebuilt by the Speed3DGis build process.
class tonemapping_fragment{static theWord() {
    return "#if defined( TONE_MAPPING )\n\
\n\
  gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );\n\
\n\
#endif\n\
";
}} export {tonemapping_fragment};
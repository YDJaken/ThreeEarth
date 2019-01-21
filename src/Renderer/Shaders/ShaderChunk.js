
import {alphamap_fragment} from "./ShaderChunk/alphamap_fragment.js";
import {alphamap_pars_fragment} from './ShaderChunk/alphamap_pars_fragment.js';
import {alphatest_fragment} from './ShaderChunk/alphatest_fragment.js';
import {aomap_fragment} from './ShaderChunk/aomap_fragment.js';
import {aomap_pars_fragment} from './ShaderChunk/aomap_pars_fragment.js';
import {begin_vertex} from './ShaderChunk/begin_vertex.js';
import {beginnormal_vertex} from './ShaderChunk/beginnormal_vertex.js';
import {bsdfs} from './ShaderChunk/bsdfs.js';
import {bumpmap_pars_fragment} from './ShaderChunk/bumpmap_pars_fragment.js';
import {clipping_planes_fragment} from './ShaderChunk/clipping_planes_fragment.js';
import {clipping_planes_pars_fragment} from './ShaderChunk/clipping_planes_pars_fragment.js';
import {clipping_planes_pars_vertex} from './ShaderChunk/clipping_planes_pars_vertex.js';
import {clipping_planes_vertex} from './ShaderChunk/clipping_planes_vertex.js';
import {color_fragment} from './ShaderChunk/color_fragment.js';
import {color_pars_fragment} from './ShaderChunk/color_pars_fragment.js';
import {color_pars_vertex} from './ShaderChunk/color_pars_vertex.js';
import {color_vertex} from './ShaderChunk/color_vertex.js';
import {common} from './ShaderChunk/common.js';
import {cube_uv_reflection_fragment} from './ShaderChunk/cube_uv_reflection_fragment.js';
import {defaultnormal_vertex} from './ShaderChunk/defaultnormal_vertex.js';
import {displacementmap_pars_vertex} from './ShaderChunk/displacementmap_pars_vertex.js';
import {displacementmap_vertex} from './ShaderChunk/displacementmap_vertex.js';
import {emissivemap_fragment} from './ShaderChunk/emissivemap_fragment.js';
import {emissivemap_pars_fragment} from './ShaderChunk/emissivemap_pars_fragment.js';
import {encodings_fragment} from './ShaderChunk/encodings_fragment.js';
import {encodings_pars_fragment} from './ShaderChunk/encodings_pars_fragment.js';
import {envmap_fragment} from './ShaderChunk/envmap_fragment.js';
import {envmap_pars_fragment} from './ShaderChunk/envmap_pars_fragment.js';
import {envmap_pars_vertex} from './ShaderChunk/envmap_pars_vertex.js';
import {envmap_vertex} from './ShaderChunk/envmap_vertex.js';
import {fog_vertex} from './ShaderChunk/fog_vertex.js';
import {fog_pars_vertex} from './ShaderChunk/fog_pars_vertex.js';
import {fog_fragment} from './ShaderChunk/fog_fragment.js';
import {fog_pars_fragment} from './ShaderChunk/fog_pars_fragment.js';
import {gradientmap_pars_fragment} from './ShaderChunk/gradientmap_pars_fragment.js';
import {lightmap_fragment} from './ShaderChunk/lightmap_fragment.js';
import {lightmap_pars_fragment} from './ShaderChunk/lightmap_pars_fragment.js';
import {lights_lambert_vertex} from './ShaderChunk/lights_lambert_vertex.js';
import {lights_pars_begin} from './ShaderChunk/lights_pars_begin.js';
import {lights_pars_maps} from './ShaderChunk/lights_pars_maps.js';
import {lights_phong_fragment} from './ShaderChunk/lights_phong_fragment.js';
import {lights_phong_pars_fragment} from './ShaderChunk/lights_phong_pars_fragment.js';
import {lights_physical_fragment} from './ShaderChunk/lights_physical_fragment.js';
import {lights_physical_pars_fragment} from './ShaderChunk/lights_physical_pars_fragment.js';
import {lights_fragment_begin} from './ShaderChunk/lights_fragment_begin.js';
import {lights_fragment_maps} from './ShaderChunk/lights_fragment_maps.js';
import {lights_fragment_end} from './ShaderChunk/lights_fragment_end.js';
import {logdepthbuf_fragment} from './ShaderChunk/logdepthbuf_fragment.js';
import {logdepthbuf_pars_fragment} from './ShaderChunk/logdepthbuf_pars_fragment.js';
import {logdepthbuf_pars_vertex} from './ShaderChunk/logdepthbuf_pars_vertex.js';
import {logdepthbuf_vertex} from './ShaderChunk/logdepthbuf_vertex.js';
import {map_fragment} from './ShaderChunk/map_fragment.js';
import {map_pars_fragment} from './ShaderChunk/map_pars_fragment.js';
import {map_particle_fragment} from './ShaderChunk/map_particle_fragment.js';
import {map_particle_pars_fragment} from './ShaderChunk/map_particle_pars_fragment.js';
import {metalnessmap_fragment} from './ShaderChunk/metalnessmap_fragment.js';
import {metalnessmap_pars_fragment} from './ShaderChunk/metalnessmap_pars_fragment.js';
import {morphnormal_vertex} from './ShaderChunk/morphnormal_vertex.js';
import {morphtarget_pars_vertex} from './ShaderChunk/morphtarget_pars_vertex.js';
import {morphtarget_vertex} from './ShaderChunk/morphtarget_vertex.js';
import {normal_fragment_begin} from './ShaderChunk/normal_fragment_begin.js';
import {normal_fragment_maps} from './ShaderChunk/normal_fragment_maps.js';
import {normalmap_pars_fragment} from './ShaderChunk/normalmap_pars_fragment.js';
import {packing} from './ShaderChunk/packing.js';
import {premultiplied_alpha_fragment} from './ShaderChunk/premultiplied_alpha_fragment.js';
import {project_vertex} from './ShaderChunk/project_vertex.js';
import {dithering_fragment} from './ShaderChunk/dithering_fragment.js';
import {dithering_pars_fragment} from './ShaderChunk/dithering_pars_fragment.js';
import {roughnessmap_fragment} from './ShaderChunk/roughnessmap_fragment.js';
import {roughnessmap_pars_fragment} from './ShaderChunk/roughnessmap_pars_fragment.js';
import {shadowmap_pars_fragment} from './ShaderChunk/shadowmap_pars_fragment.js';
import {shadowmap_pars_vertex} from './ShaderChunk/shadowmap_pars_vertex.js';
import {shadowmap_vertex} from './ShaderChunk/shadowmap_vertex.js';
import {shadowmask_pars_fragment} from './ShaderChunk/shadowmask_pars_fragment.js';
import {skinbase_vertex} from './ShaderChunk/skinbase_vertex.js';
import {skinning_pars_vertex} from './ShaderChunk/skinning_pars_vertex.js';
import {skinning_vertex} from './ShaderChunk/skinning_vertex.js';
import {skinnormal_vertex} from './ShaderChunk/skinnormal_vertex.js';
import {specularmap_fragment} from './ShaderChunk/specularmap_fragment.js';
import {specularmap_pars_fragment} from './ShaderChunk/specularmap_pars_fragment.js';
import {tonemapping_fragment} from './ShaderChunk/tonemapping_fragment.js';
import {tonemapping_pars_fragment} from './ShaderChunk/tonemapping_pars_fragment.js';
import {uv_pars_fragment} from './ShaderChunk/uv_pars_fragment.js';
import {uv_pars_vertex} from './ShaderChunk/uv_pars_vertex.js';
import {uv_vertex} from './ShaderChunk/uv_vertex.js';
import {uv2_pars_fragment} from './ShaderChunk/uv2_pars_fragment.js';
import {uv2_pars_vertex} from './ShaderChunk/uv2_pars_vertex.js';
import {uv2_vertex} from './ShaderChunk/uv2_vertex.js';
import {worldpos_vertex} from './ShaderChunk/worldpos_vertex.js';

import {cube_frag} from './ShaderLib/cube_frag.js';
import {cube_vert} from './ShaderLib/cube_vert.js';
import {depth_frag} from './ShaderLib/depth_frag.js';
import {depth_vert} from './ShaderLib/depth_vert.js';
import {distanceRGBA_frag} from './ShaderLib/distanceRGBA_frag.js';
import {distanceRGBA_vert} from './ShaderLib/distanceRGBA_vert.js';
import {equirect_frag} from './ShaderLib/equirect_frag.js';
import {equirect_vert} from './ShaderLib/equirect_vert.js';
import {linedashed_frag} from './ShaderLib/linedashed_frag.js';
import {linedashed_vert} from './ShaderLib/linedashed_vert.js';
import {meshbasic_frag} from './ShaderLib/meshbasic_frag.js';
import {meshbasic_vert} from './ShaderLib/meshbasic_vert.js';
import {meshlambert_frag} from './ShaderLib/meshlambert_frag.js';
import {meshlambert_vert} from './ShaderLib/meshlambert_vert.js';
import {meshphong_frag} from './ShaderLib/meshphong_frag.js';
import {meshphong_vert} from './ShaderLib/meshphong_vert.js';
import {meshphysical_frag} from './ShaderLib/meshphysical_frag.js';
import {meshphysical_vert} from './ShaderLib/meshphysical_vert.js';
import {normal_frag} from './ShaderLib/normal_frag.js';
import {normal_vert} from './ShaderLib/normal_vert.js';
import {points_frag} from './ShaderLib/points_frag.js';
import {points_vert} from './ShaderLib/points_vert.js';
import {shadow_frag} from './ShaderLib/shadow_frag.js';
import {shadow_vert} from './ShaderLib/shadow_vert.js';

/**
 * @author WangZhiDong
 * @modified DongYi 2018/07/14
 */

const ShaderChunk = {
    alphamap_fragment: alphamap_fragment.theWord(),
    alphamap_pars_fragment: alphamap_pars_fragment.theWord(),
    alphatest_fragment: alphatest_fragment.theWord(),
    aomap_fragment: aomap_fragment.theWord(),
    aomap_pars_fragment: aomap_pars_fragment.theWord(),
    begin_vertex: begin_vertex.theWord(),
    beginnormal_vertex: beginnormal_vertex.theWord(),
    bsdfs: bsdfs.theWord(),
    bumpmap_pars_fragment: bumpmap_pars_fragment.theWord(),
    clipping_planes_fragment: clipping_planes_fragment.theWord(),
    clipping_planes_pars_fragment: clipping_planes_pars_fragment.theWord(),
    clipping_planes_pars_vertex: clipping_planes_pars_vertex.theWord(),
    clipping_planes_vertex: clipping_planes_vertex.theWord(),
    color_fragment: color_fragment.theWord(),
    color_pars_fragment: color_pars_fragment.theWord(),
    color_pars_vertex: color_pars_vertex.theWord(),
    color_vertex: color_vertex.theWord(),
    common: common.theWord(),
    cube_uv_reflection_fragment: cube_uv_reflection_fragment.theWord(),
    defaultnormal_vertex: defaultnormal_vertex.theWord(),
    displacementmap_pars_vertex: displacementmap_pars_vertex.theWord(),
    displacementmap_vertex: displacementmap_vertex.theWord(),
    emissivemap_fragment: emissivemap_fragment.theWord(),
    emissivemap_pars_fragment: emissivemap_pars_fragment.theWord(),
    encodings_fragment: encodings_fragment.theWord(),
    encodings_pars_fragment: encodings_pars_fragment.theWord(),
    envmap_fragment: envmap_fragment.theWord(),
    envmap_pars_fragment: envmap_pars_fragment.theWord(),
    envmap_pars_vertex: envmap_pars_vertex.theWord(),
    envmap_vertex: envmap_vertex.theWord(),
    fog_vertex: fog_vertex.theWord(),
    fog_pars_vertex: fog_pars_vertex.theWord(),
    fog_fragment: fog_fragment.theWord(),
    fog_pars_fragment: fog_pars_fragment.theWord(),
    gradientmap_pars_fragment: gradientmap_pars_fragment.theWord(),
    lightmap_fragment: lightmap_fragment.theWord(),
    lightmap_pars_fragment: lightmap_pars_fragment.theWord(),
    lights_lambert_vertex: lights_lambert_vertex.theWord(),
    lights_pars_begin: lights_pars_begin.theWord(),
    lights_pars_maps: lights_pars_maps.theWord(),
    lights_phong_fragment: lights_phong_fragment.theWord(),
    lights_phong_pars_fragment: lights_phong_pars_fragment.theWord(),
    lights_physical_fragment: lights_physical_fragment.theWord(),
    lights_physical_pars_fragment: lights_physical_pars_fragment.theWord(),
    lights_fragment_begin: lights_fragment_begin.theWord(),
    lights_fragment_maps: lights_fragment_maps.theWord(),
    lights_fragment_end: lights_fragment_end.theWord(),
    logdepthbuf_fragment: logdepthbuf_fragment.theWord(),
    logdepthbuf_pars_fragment: logdepthbuf_pars_fragment.theWord(),
    logdepthbuf_pars_vertex: logdepthbuf_pars_vertex.theWord(),
    logdepthbuf_vertex: logdepthbuf_vertex.theWord(),
    map_fragment: map_fragment.theWord(),
    map_pars_fragment: map_pars_fragment.theWord(),
    map_particle_fragment: map_particle_fragment.theWord(),
    map_particle_pars_fragment: map_particle_pars_fragment.theWord(),
    metalnessmap_fragment: metalnessmap_fragment.theWord(),
    metalnessmap_pars_fragment: metalnessmap_pars_fragment.theWord(),
    morphnormal_vertex: morphnormal_vertex.theWord(),
    morphtarget_pars_vertex: morphtarget_pars_vertex.theWord(),
    morphtarget_vertex: morphtarget_vertex.theWord(),
    normal_fragment_begin: normal_fragment_begin.theWord(),
    normal_fragment_maps: normal_fragment_maps.theWord(),
    normalmap_pars_fragment: normalmap_pars_fragment.theWord(),
    packing: packing.theWord(),
    premultiplied_alpha_fragment: premultiplied_alpha_fragment.theWord(),
    project_vertex: project_vertex.theWord(),
    dithering_fragment: dithering_fragment.theWord(),
    dithering_pars_fragment: dithering_pars_fragment.theWord(),
    roughnessmap_fragment: roughnessmap_fragment.theWord(),
    roughnessmap_pars_fragment: roughnessmap_pars_fragment.theWord(),
    shadowmap_pars_fragment: shadowmap_pars_fragment.theWord(),
    shadowmap_pars_vertex: shadowmap_pars_vertex.theWord(),
    shadowmap_vertex: shadowmap_vertex.theWord(),
    shadowmask_pars_fragment: shadowmask_pars_fragment.theWord(),
    skinbase_vertex: skinbase_vertex.theWord(),
    skinning_pars_vertex: skinning_pars_vertex.theWord(),
    skinning_vertex: skinning_vertex.theWord(),
    skinnormal_vertex: skinnormal_vertex.theWord(),
    specularmap_fragment: specularmap_fragment.theWord(),
    specularmap_pars_fragment: specularmap_pars_fragment.theWord(),
    tonemapping_fragment: tonemapping_fragment.theWord(),
    tonemapping_pars_fragment: tonemapping_pars_fragment.theWord(),
    uv_pars_fragment: uv_pars_fragment.theWord(),
    uv_pars_vertex: uv_pars_vertex.theWord(),
    uv_vertex: uv_vertex.theWord(),
    uv2_pars_fragment: uv2_pars_fragment.theWord(),
    uv2_pars_vertex: uv2_pars_vertex.theWord(),
    uv2_vertex: uv2_vertex.theWord(),
    worldpos_vertex: worldpos_vertex.theWord(),
    cube_frag: cube_frag.theWord(),
    cube_vert: cube_vert.theWord(),
    depth_frag: depth_frag.theWord(),
    depth_vert: depth_vert.theWord(),
    distanceRGBA_frag: distanceRGBA_frag.theWord(),
    distanceRGBA_vert: distanceRGBA_vert.theWord(),
    equirect_frag: equirect_frag.theWord(),
    equirect_vert: equirect_vert.theWord(),
    linedashed_frag: linedashed_frag.theWord(),
    linedashed_vert: linedashed_vert.theWord(),
    meshbasic_frag: meshbasic_frag.theWord(),
    meshbasic_vert: meshbasic_vert.theWord(),
    meshlambert_frag: meshlambert_frag.theWord(),
    meshlambert_vert: meshlambert_vert.theWord(),
    meshphong_frag: meshphong_frag.theWord(),
    meshphong_vert: meshphong_vert.theWord(),
    meshphysical_frag: meshphysical_frag.theWord(),
    meshphysical_vert: meshphysical_vert.theWord(),
    normal_frag: normal_frag.theWord(),
    normal_vert: normal_vert.theWord(),
    points_frag: points_frag.theWord(),
    points_vert: points_vert.theWord(),
    shadow_frag: shadow_frag.theWord(),
    shadow_vert: shadow_vert.theWord()
};

export {ShaderChunk};

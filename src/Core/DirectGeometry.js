/**
 * @author mrdoob / http://mrdoob.com/
 * @modified DongYi 2018/07/19
 */

import { Vector2 } from '../Datum/Math/Vector2.js';

/*function DirectGeometry() {

	this.vertices = [];
	this.normals = [];
	this.colors = [];
	this.uvs = [];
	this.uvs2 = [];

	this.groups = [];

	this.morphTargets = {};

	this.skinWeights = [];
	this.skinIndices = [];

	// this.lineDistances = [];

	this.boundingBox = null;
	this.boundingSphere = null;

	// update flags

	this.verticesNeedUpdate = false;
	this.normalsNeedUpdate = false;
	this.colorsNeedUpdate = false;
	this.uvsNeedUpdate = false;
	this.groupsNeedUpdate = false;

}

Object.assign( DirectGeometry.prototype, {

	computeGroups: function ( geometry ) {

		var group;
		var groups = [];
		var materialIndex = undefined;

		var faces = geometry.faces;

		for ( var i = 0; i < faces.length; i ++ ) {

			var face = faces[ i ];

			// materials

			if ( face.materialIndex !== materialIndex ) {

				materialIndex = face.materialIndex;

				if ( group !== undefined ) {

					group.count = ( i * 3 ) - group.start;
					groups.push( group );

				}

				group = {
					start: i * 3,
					materialIndex: materialIndex
				};

			}

		}

		if ( group !== undefined ) {

			group.count = ( i * 3 ) - group.start;
			groups.push( group );

		}

		this.groups = groups;

	},

	fromGeometry: function ( geometry ) {

		var faces = geometry.faces;
		var vertices = geometry.vertices;
		var faceVertexUvs = geometry.faceVertexUvs;

		var hasFaceVertexUv = faceVertexUvs[ 0 ] && faceVertexUvs[ 0 ].length > 0;
		var hasFaceVertexUv2 = faceVertexUvs[ 1 ] && faceVertexUvs[ 1 ].length > 0;

		// morphs

		var morphTargets = geometry.morphTargets;
		var morphTargetsLength = morphTargets.length;

		var morphTargetsPosition;

		if ( morphTargetsLength > 0 ) {

			morphTargetsPosition = [];

			for ( var i = 0; i < morphTargetsLength; i ++ ) {

				morphTargetsPosition[ i ] = [];

			}

			this.morphTargets.position = morphTargetsPosition;

		}

		var morphNormals = geometry.morphNormals;
		var morphNormalsLength = morphNormals.length;

		var morphTargetsNormal;

		if ( morphNormalsLength > 0 ) {

			morphTargetsNormal = [];

			for ( var i = 0; i < morphNormalsLength; i ++ ) {

				morphTargetsNormal[ i ] = [];

			}

			this.morphTargets.normal = morphTargetsNormal;

		}

		// skins

		var skinIndices = geometry.skinIndices;
		var skinWeights = geometry.skinWeights;

		var hasSkinIndices = skinIndices.length === vertices.length;
		var hasSkinWeights = skinWeights.length === vertices.length;

		//

		if ( vertices.length > 0 && faces.length === 0 ) {

			console.error( 'Speed3D.DirectGeometry: Faceless geometries are not supported.' );

		}

		for ( var i = 0; i < faces.length; i ++ ) {

			var face = faces[ i ];

			this.vertices.push( vertices[ face.a ], vertices[ face.b ], vertices[ face.c ] );

			var vertexNormals = face.vertexNormals;

			if ( vertexNormals.length === 3 ) {

				this.normals.push( vertexNormals[ 0 ], vertexNormals[ 1 ], vertexNormals[ 2 ] );

			} else {

				var normal = face.normal;

				this.normals.push( normal, normal, normal );

			}

			var vertexColors = face.vertexColors;

			if ( vertexColors.length === 3 ) {

				this.colors.push( vertexColors[ 0 ], vertexColors[ 1 ], vertexColors[ 2 ] );

			} else {

				var color = face.color;

				this.colors.push( color, color, color );

			}

			if ( hasFaceVertexUv === true ) {

				var vertexUvs = faceVertexUvs[ 0 ][ i ];

				if ( vertexUvs !== undefined ) {

					this.uvs.push( vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ] );

				} else {

					console.warn( 'Speed3D.DirectGeometry.fromGeometry(): Undefined vertexUv ', i );

					this.uvs.push( new Vector2(), new Vector2(), new Vector2() );

				}

			}

			if ( hasFaceVertexUv2 === true ) {

				var vertexUvs = faceVertexUvs[ 1 ][ i ];

				if ( vertexUvs !== undefined ) {

					this.uvs2.push( vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ] );

				} else {

					console.warn( 'Speed3D.DirectGeometry.fromGeometry(): Undefined vertexUv2 ', i );

					this.uvs2.push( new Vector2(), new Vector2(), new Vector2() );

				}

			}

			// morphs

			for ( var j = 0; j < morphTargetsLength; j ++ ) {

				var morphTarget = morphTargets[ j ].vertices;

				morphTargetsPosition[ j ].push( morphTarget[ face.a ], morphTarget[ face.b ], morphTarget[ face.c ] );

			}

			for ( var j = 0; j < morphNormalsLength; j ++ ) {

				var morphNormal = morphNormals[ j ].vertexNormals[ i ];

				morphTargetsNormal[ j ].push( morphNormal.a, morphNormal.b, morphNormal.c );

			}

			// skins

			if ( hasSkinIndices ) {

				this.skinIndices.push( skinIndices[ face.a ], skinIndices[ face.b ], skinIndices[ face.c ] );

			}

			if ( hasSkinWeights ) {

				this.skinWeights.push( skinWeights[ face.a ], skinWeights[ face.b ], skinWeights[ face.c ] );

			}

		}

		this.computeGroups( geometry );

		this.verticesNeedUpdate = geometry.verticesNeedUpdate;
		this.normalsNeedUpdate = geometry.normalsNeedUpdate;
		this.colorsNeedUpdate = geometry.colorsNeedUpdate;
		this.uvsNeedUpdate = geometry.uvsNeedUpdate;
		this.groupsNeedUpdate = geometry.groupsNeedUpdate;

		return this;

	}

} );*/

class DirectGeometry {
	constructor(){
        this.vertices = [];
        this.normals = [];
        this.colors = [];
        this.uvs = [];
        this.uvs2 = [];
        this.groups = [];
        this.morphTargets = {};
        this.skinWeights = [];
        this.skinIndices = [];
        this.lineDistances = [];
        this.boundingBox = null;
        this.boundingSphere = null;
        // update flags
        this.verticesNeedUpdate = false;
        this.normalsNeedUpdate = false;
        this.colorsNeedUpdate = false;
        this.uvsNeedUpdate = false;
        this.groupsNeedUpdate = false;
	}

    computeGroups( geometry ) {
        let group;
        let groups = [];
        let materialIndex = undefined;
        let faces = geometry.faces;
        let i;
        for ( i = 0; i < faces.length; i ++ ) {
            let face = faces[ i ];
            // materials
            if ( face.materialIndex !== materialIndex ) {
                materialIndex = face.materialIndex;
                if ( group !== undefined ) {
                    group.count = ( i * 3 ) - group.start;
                    groups.push( group );
                }
                group = {
                    start: i * 3,
                    materialIndex: materialIndex
                };
            }
        }
        if ( group !== undefined ) {
            group.count = ( i * 3 ) - group.start;
            groups.push( group );
        }
        this.groups = groups;
    }

    fromGeometry( geometry ) {
        let faces = geometry.faces;
        let vertices = geometry.vertices;
        let faceVertexUvs = geometry.faceVertexUvs;
        let hasFaceVertexUv = faceVertexUvs[ 0 ] && faceVertexUvs[ 0 ].length > 0;
        let hasFaceVertexUv2 = faceVertexUvs[ 1 ] && faceVertexUvs[ 1 ].length > 0;
        // morphs
        let morphTargets = geometry.morphTargets;
        let morphTargetsLength = morphTargets.length;
        let morphTargetsPosition;
        if ( morphTargetsLength > 0 ) {
            morphTargetsPosition = [];
            for ( let i = 0; i < morphTargetsLength; i ++ ) {
                morphTargetsPosition[ i ] = [];
            }
            this.morphTargets.position = morphTargetsPosition;
        }
        let morphNormals = geometry.morphNormals;
        let morphNormalsLength = morphNormals.length;
        let morphTargetsNormal;
        if ( morphNormalsLength > 0 ) {
            morphTargetsNormal = [];
            for ( let i = 0; i < morphNormalsLength; i ++ ) {
                morphTargetsNormal[ i ] = [];
            }
            this.morphTargets.normal = morphTargetsNormal;
        }
        // skins
        let skinIndices = geometry.skinIndices;
        let skinWeights = geometry.skinWeights;
        let hasSkinIndices = skinIndices.length === vertices.length;
        let hasSkinWeights = skinWeights.length === vertices.length;
        //
        if ( vertices.length > 0 && faces.length === 0 ) {
            console.error( 'Speed3DEngine.DirectGeometry: Faceless geometries are not supported.' );
        }
        for ( let i = 0; i < faces.length; i ++ ) {
            let face = faces[ i ];
            this.vertices.push( vertices[ face.a ], vertices[ face.b ], vertices[ face.c ] );
            let vertexNormals = face.vertexNormals;
            if ( vertexNormals.length === 3 ) {
                this.normals.push( vertexNormals[ 0 ], vertexNormals[ 1 ], vertexNormals[ 2 ] );
            } else {
                let normal = face.normal;
                this.normals.push( normal, normal, normal );
            }
            let vertexColors = face.vertexColors;
            if ( vertexColors.length === 3 ) {
                this.colors.push( vertexColors[ 0 ], vertexColors[ 1 ], vertexColors[ 2 ] );
            } else {
                let color = face.color;
                this.colors.push( color, color, color );
            }
            if ( hasFaceVertexUv === true ) {
                let vertexUvs = faceVertexUvs[ 0 ][ i ];
                if ( vertexUvs !== undefined ) {
                    this.uvs.push( vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ] );
                } else {
                    console.warn( 'Speed3DEngine.DirectGeometry.fromGeometry(): Undefined vertexUv ', i );
                    this.uvs.push( new Vector2(), new Vector2(), new Vector2() );
                }
            }
            if ( hasFaceVertexUv2 === true ) {
                let vertexUvs = faceVertexUvs[ 1 ][ i ];
                if ( vertexUvs !== undefined ) {
                    this.uvs2.push( vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ] );
                } else {
                    console.warn( 'Speed3DEngine.DirectGeometry.fromGeometry(): Undefined vertexUv2 ', i );
                    this.uvs2.push( new Vector2(), new Vector2(), new Vector2() );
                }
            }
            // morphs
            for ( let j = 0; j < morphTargetsLength; j ++ ) {
                let morphTarget = morphTargets[ j ].vertices;
                morphTargetsPosition[ j ].push( morphTarget[ face.a ], morphTarget[ face.b ], morphTarget[ face.c ] );
            }
            for ( let j = 0; j < morphNormalsLength; j ++ ) {
                let morphNormal = morphNormals[ j ].vertexNormals[ i ];
                morphTargetsNormal[ j ].push( morphNormal.a, morphNormal.b, morphNormal.c );
            }
            // skins
            if ( hasSkinIndices ) {
                this.skinIndices.push( skinIndices[ face.a ], skinIndices[ face.b ], skinIndices[ face.c ] );
            }
            if ( hasSkinWeights ) {
                this.skinWeights.push( skinWeights[ face.a ], skinWeights[ face.b ], skinWeights[ face.c ] );
            }
        }
        this.computeGroups( geometry );
        this.verticesNeedUpdate = geometry.verticesNeedUpdate;
        this.normalsNeedUpdate = geometry.normalsNeedUpdate;
        this.colorsNeedUpdate = geometry.colorsNeedUpdate;
        this.uvsNeedUpdate = geometry.uvsNeedUpdate;
        this.groupsNeedUpdate = geometry.groupsNeedUpdate;
        return this;
    }
}

export { DirectGeometry };

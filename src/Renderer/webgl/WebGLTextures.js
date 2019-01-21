/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

import {
    LinearFilter,
    NearestFilter,
    RGBFormat,
    RGBAFormat,
    DepthFormat,
    DepthStencilFormat,
    UnsignedShortType,
    UnsignedIntType,
    UnsignedInt248Type,
    FloatType,
    HalfFloatType,
    ClampToEdgeWrapping,
    NearestMipMapLinearFilter,
    NearestMipMapNearestFilter
} from "../../Core/Constants.js";
import {_Math} from '../../Datum/Math/Math.js';

/*function WebGLTextures(_gl, extensions, state, properties, capabilities, utils, info) {

    var _isWebGL2 = (typeof WebGL2RenderingContext !== 'undefined' && _gl instanceof WebGL2RenderingContext);
    /!* global WebGL2RenderingContext *!/
    var _videoTextures = {};
    var _canvas;

    //

    function clampToMaxSize(image, maxSize) {

        if (image.width > maxSize || image.height > maxSize) {

            if ('data' in image) {

                console.warn('Speed3DEngine.WebGLRenderer: image in DataTexture is too big (' + image.width + 'x' + image.height + ').');
                return;

            }

            // Warning: Scaling through the canvas will only work with images that use
            // premultiplied alpha.

            var scale = maxSize / Math.max(image.width, image.height);

            var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
            canvas.width = Math.floor(image.width * scale);
            canvas.height = Math.floor(image.height * scale);

            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

            console.warn('Speed3DEngine.WebGLRenderer: image is too big (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);

            return canvas;

        }

        return image;

    }

    function isPowerOfTwo(image) {

        return _Math.isPowerOfTwo(image.width) && _Math.isPowerOfTwo(image.height);

    }

    function makePowerOfTwo(image) {

        if (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement || image instanceof ImageBitmap) {

            if (_canvas === undefined) _canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');

            _canvas.width = _Math.floorPowerOfTwo(image.width);
            _canvas.height = _Math.floorPowerOfTwo(image.height);

            var context = _canvas.getContext('2d');
            context.drawImage(image, 0, 0, _canvas.width, _canvas.height);

            console.warn('Speed3DEngine.WebGLRenderer: image is not power of two (' + image.width + 'x' + image.height + '). Resized to ' + _canvas.width + 'x' + _canvas.height, image);

            return _canvas;

        }

        return image;

    }

    function textureNeedsPowerOfTwo(texture) {

        return (texture.wrapS !== ClampToEdgeWrapping || texture.wrapT !== ClampToEdgeWrapping) ||
            (texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter);

    }

    function textureNeedsGenerateMipmaps(texture, isPowerOfTwo) {

        return texture.generateMipmaps && isPowerOfTwo &&
            texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter;

    }

    function generateMipmap(target, texture, width, height) {

        _gl.generateMipmap(target);

        var textureProperties = properties.get(texture);

        // Note: Math.log( x ) * Math.LOG2E used instead of Math.log2( x ) which is not supported by IE11
        textureProperties.__maxMipLevel = Math.log(Math.max(width, height)) * Math.LOG2E;

    }

    // Fallback filters for non-power-of-2 textures

    function filterFallback(f) {

        if (f === NearestFilter || f === NearestMipMapNearestFilter || f === NearestMipMapLinearFilter) {

            return _gl.NEAREST;

        }

        return _gl.LINEAR;

    }

    //

    function onTextureDispose(event) {

        var texture = event.target;

        texture.removeEventListener('dispose', onTextureDispose);

        deallocateTexture(texture);

        if (texture.isVideoTexture) {

            delete _videoTextures[texture.id];

        }

        info.memory.textures--;

    }

    function onRenderTargetDispose(event) {

        var renderTarget = event.target;

        renderTarget.removeEventListener('dispose', onRenderTargetDispose);

        deallocateRenderTarget(renderTarget);

        info.memory.textures--;

    }

    //

    function deallocateTexture(texture) {

        var textureProperties = properties.get(texture);

        if (texture.image && textureProperties.__image__webglTextureCube) {

            // cube texture

            _gl.deleteTexture(textureProperties.__image__webglTextureCube);

        } else {

            // 2D texture

            if (textureProperties.__webglInit === undefined) return;

            _gl.deleteTexture(textureProperties.__webglTexture);

        }

        // remove all webgl properties
        properties.remove(texture);

    }

    function deallocateRenderTarget(renderTarget) {

        var renderTargetProperties = properties.get(renderTarget);
        var textureProperties = properties.get(renderTarget.texture);

        if (!renderTarget) return;

        if (textureProperties.__webglTexture !== undefined) {

            _gl.deleteTexture(textureProperties.__webglTexture);

        }

        if (renderTarget.depthTexture) {

            renderTarget.depthTexture.dispose();

        }

        if (renderTarget.isWebGLRenderTargetCube) {

            for (var i = 0; i < 6; i++) {

                _gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer[i]);
                if (renderTargetProperties.__webglDepthbuffer) _gl.deleteRenderbuffer(renderTargetProperties.__webglDepthbuffer[i]);

            }

        } else {

            _gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer);
            if (renderTargetProperties.__webglDepthbuffer) _gl.deleteRenderbuffer(renderTargetProperties.__webglDepthbuffer);

        }

        properties.remove(renderTarget.texture);
        properties.remove(renderTarget);

    }

    //


    function setTexture2D(texture, slot) {

        var textureProperties = properties.get(texture);

        if (texture.isVideoTexture) updateVideoTexture(texture);

        if (texture.version > 0 && textureProperties.__version !== texture.version) {

            var image = texture.image;

            if (image === undefined) {

                console.warn('Speed3DEngine.WebGLRenderer: Texture marked for update but image is undefined', texture);

            } else if (image.complete === false) {

                console.warn('Speed3DEngine.WebGLRenderer: Texture marked for update but image is incomplete', texture);

            } else {

                uploadTexture(textureProperties, texture, slot);
                return;

            }

        }

        state.activeTexture(_gl.TEXTURE0 + slot);
        state.bindTexture(_gl.TEXTURE_2D, textureProperties.__webglTexture);

    }

    function setTextureCube(texture, slot) {

        var textureProperties = properties.get(texture);

        if (texture.image.length === 6) {

            if (texture.version > 0 && textureProperties.__version !== texture.version) {

                if (!textureProperties.__image__webglTextureCube) {

                    texture.addEventListener('dispose', onTextureDispose);

                    textureProperties.__image__webglTextureCube = _gl.createTexture();

                    info.memory.textures++;

                }

                state.activeTexture(_gl.TEXTURE0 + slot);
                state.bindTexture(_gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube);

                _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);

                var isCompressed = (texture && texture.isCompressedTexture);
                var isDataTexture = (texture.image[0] && texture.image[0].isDataTexture);

                var cubeImage = [];

                for (var i = 0; i < 6; i++) {

                    if (!isCompressed && !isDataTexture) {

                        cubeImage[i] = clampToMaxSize(texture.image[i], capabilities.maxCubemapSize);

                    } else {

                        cubeImage[i] = isDataTexture ? texture.image[i].image : texture.image[i];

                    }

                }

                var image = cubeImage[0],
                    isPowerOfTwoImage = isPowerOfTwo(image),
                    glFormat = utils.convert(texture.format),
                    glType = utils.convert(texture.type);

                setTextureParameters(_gl.TEXTURE_CUBE_MAP, texture, isPowerOfTwoImage);

                for (var i = 0; i < 6; i++) {

                    if (!isCompressed) {

                        if (isDataTexture) {

                            state.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, cubeImage[i].width, cubeImage[i].height, 0, glFormat, glType, cubeImage[i].data);

                        } else {

                            state.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, glFormat, glType, cubeImage[i]);

                        }

                    } else {

                        var mipmap, mipmaps = cubeImage[i].mipmaps;

                        for (var j = 0, jl = mipmaps.length; j < jl; j++) {

                            mipmap = mipmaps[j];

                            if (texture.format !== RGBAFormat && texture.format !== RGBFormat) {

                                if (state.getCompressedTextureFormats().indexOf(glFormat) > -1) {

                                    state.compressedTexImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, mipmap.data);

                                } else {

                                    console.warn('Speed3DEngine.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()');

                                }

                            } else {

                                state.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);

                            }

                        }

                    }

                }

                if (!isCompressed) {

                    textureProperties.__maxMipLevel = 0;

                } else {

                    textureProperties.__maxMipLevel = mipmaps.length - 1;

                }

                if (textureNeedsGenerateMipmaps(texture, isPowerOfTwoImage)) {

                    // We assume images for cube map have the same size.
                    generateMipmap(_gl.TEXTURE_CUBE_MAP, texture, image.width, image.height);

                }

                textureProperties.__version = texture.version;

                if (texture.onUpdate) texture.onUpdate(texture);

            } else {

                state.activeTexture(_gl.TEXTURE0 + slot);
                state.bindTexture(_gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube);

            }

        }

    }

    function setTextureCubeDynamic(texture, slot) {

        state.activeTexture(_gl.TEXTURE0 + slot);
        state.bindTexture(_gl.TEXTURE_CUBE_MAP, properties.get(texture).__webglTexture);

    }

    function setTextureParameters(textureType, texture, isPowerOfTwoImage) {

        var extension;

        if (isPowerOfTwoImage) {

            _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_S, utils.convert(texture.wrapS));
            _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_T, utils.convert(texture.wrapT));

            _gl.texParameteri(textureType, _gl.TEXTURE_MAG_FILTER, utils.convert(texture.magFilter));
            _gl.texParameteri(textureType, _gl.TEXTURE_MIN_FILTER, utils.convert(texture.minFilter));

        } else {

            _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE);
            _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE);

            if (texture.wrapS !== ClampToEdgeWrapping || texture.wrapT !== ClampToEdgeWrapping) {

                console.warn('Speed3DEngine.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to Speed3DEngine.ClampToEdgeWrapping.', texture);

            }

            _gl.texParameteri(textureType, _gl.TEXTURE_MAG_FILTER, filterFallback(texture.magFilter));
            _gl.texParameteri(textureType, _gl.TEXTURE_MIN_FILTER, filterFallback(texture.minFilter));

            if (texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter) {

                console.warn('Speed3DEngine.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to Speed3DEngine.NearestFilter or Speed3DEngine.LinearFilter.', texture);

            }

        }

        extension = extensions.get('EXT_texture_filter_anisotropic');

        if (extension) {

            if (texture.type === FloatType && extensions.get('OES_texture_float_linear') === null) return;
            if (texture.type === HalfFloatType && extensions.get('OES_texture_half_float_linear') === null) return;

            if (texture.anisotropy > 1 || properties.get(texture).__currentAnisotropy) {

                _gl.texParameterf(textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(texture.anisotropy, capabilities.getMaxAnisotropy()));
                properties.get(texture).__currentAnisotropy = texture.anisotropy;

            }

        }

    }

    function uploadTexture(textureProperties, texture, slot) {

        if (textureProperties.__webglInit === undefined) {

            textureProperties.__webglInit = true;

            texture.addEventListener('dispose', onTextureDispose);

            textureProperties.__webglTexture = _gl.createTexture();

            info.memory.textures++;

        }

        state.activeTexture(_gl.TEXTURE0 + slot);
        state.bindTexture(_gl.TEXTURE_2D, textureProperties.__webglTexture);

        _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
        _gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha);
        _gl.pixelStorei(_gl.UNPACK_ALIGNMENT, texture.unpackAlignment);

        var image = clampToMaxSize(texture.image, capabilities.maxTextureSize);

        if (textureNeedsPowerOfTwo(texture) && isPowerOfTwo(image) === false) {

            image = makePowerOfTwo(image);

        }

        var isPowerOfTwoImage = isPowerOfTwo(image),
            glFormat = utils.convert(texture.format),
            glType = utils.convert(texture.type);

        setTextureParameters(_gl.TEXTURE_2D, texture, isPowerOfTwoImage);

        var mipmap, mipmaps = texture.mipmaps;

        if (texture.isDepthTexture) {

            // populate depth texture with dummy data

            var internalFormat = _gl.DEPTH_COMPONENT;

            if (texture.type === FloatType) {

                if (!_isWebGL2) throw new Error('Float Depth Texture only supported in WebGL2.0');
                internalFormat = _gl.DEPTH_COMPONENT32F;

            } else if (_isWebGL2) {

                // WebGL 2.0 requires signed internalformat for glTexImage2D
                internalFormat = _gl.DEPTH_COMPONENT16;

            }

            if (texture.format === DepthFormat && internalFormat === _gl.DEPTH_COMPONENT) {

                // The error INVALID_OPERATION is generated by texImage2D if format and internalformat are
                // DEPTH_COMPONENT and type is not UNSIGNED_SHORT or UNSIGNED_INT
                // (https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/)
                if (texture.type !== UnsignedShortType && texture.type !== UnsignedIntType) {

                    console.warn('Speed3DEngine.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture.');

                    texture.type = UnsignedShortType;
                    glType = utils.convert(texture.type);

                }

            }

            // Depth stencil textures need the DEPTH_STENCIL internal format
            // (https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/)
            if (texture.format === DepthStencilFormat) {

                internalFormat = _gl.DEPTH_STENCIL;

                // The error INVALID_OPERATION is generated by texImage2D if format and internalformat are
                // DEPTH_STENCIL and type is not UNSIGNED_INT_24_8_WEBGL.
                // (https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/)
                if (texture.type !== UnsignedInt248Type) {

                    console.warn('Speed3DEngine.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture.');

                    texture.type = UnsignedInt248Type;
                    glType = utils.convert(texture.type);

                }

            }

            state.texImage2D(_gl.TEXTURE_2D, 0, internalFormat, image.width, image.height, 0, glFormat, glType, null);

        } else if (texture.isDataTexture) {

            // use manually created mipmaps if available
            // if there are no manual mipmaps
            // set 0 level mipmap and then use GL to generate other mipmap levels

            if (mipmaps.length > 0 && isPowerOfTwoImage) {

                for (var i = 0, il = mipmaps.length; i < il; i++) {

                    mipmap = mipmaps[i];
                    state.texImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);

                }

                texture.generateMipmaps = false;
                textureProperties.__maxMipLevel = mipmaps.length - 1;

            } else {

                state.texImage2D(_gl.TEXTURE_2D, 0, glFormat, image.width, image.height, 0, glFormat, glType, image.data);
                textureProperties.__maxMipLevel = 0;

            }

        } else if (texture.isCompressedTexture) {

            for (var i = 0, il = mipmaps.length; i < il; i++) {

                mipmap = mipmaps[i];

                if (texture.format !== RGBAFormat && texture.format !== RGBFormat) {

                    if (state.getCompressedTextureFormats().indexOf(glFormat) > -1) {

                        state.compressedTexImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, mipmap.data);

                    } else {

                        console.warn('Speed3DEngine.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()');

                    }

                } else {

                    state.texImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);

                }

            }

            textureProperties.__maxMipLevel = mipmaps.length - 1;

        } else {

            // regular Texture (image, video, canvas)

            // use manually created mipmaps if available
            // if there are no manual mipmaps
            // set 0 level mipmap and then use GL to generate other mipmap levels

            if (mipmaps.length > 0 && isPowerOfTwoImage) {

                for (var i = 0, il = mipmaps.length; i < il; i++) {

                    mipmap = mipmaps[i];
                    state.texImage2D(_gl.TEXTURE_2D, i, glFormat, glFormat, glType, mipmap);

                }

                texture.generateMipmaps = false;
                textureProperties.__maxMipLevel = mipmaps.length - 1;

            } else {

                state.texImage2D(_gl.TEXTURE_2D, 0, glFormat, glFormat, glType, image);
                textureProperties.__maxMipLevel = 0;

            }

        }

        if (textureNeedsGenerateMipmaps(texture, isPowerOfTwoImage)) {

            generateMipmap(_gl.TEXTURE_2D, texture, image.width, image.height);

        }

        textureProperties.__version = texture.version;

        if (texture.onUpdate) texture.onUpdate(texture);

    }

    // Render targets

    // Setup storage for target texture and bind it to correct framebuffer
    function setupFrameBufferTexture(framebuffer, renderTarget, attachment, textureTarget) {

        var glFormat = utils.convert(renderTarget.texture.format);
        var glType = utils.convert(renderTarget.texture.type);
        state.texImage2D(textureTarget, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null);
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer);
        _gl.framebufferTexture2D(_gl.FRAMEBUFFER, attachment, textureTarget, properties.get(renderTarget.texture).__webglTexture, 0);
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);

    }

    // Setup storage for internal depth/stencil buffers and bind to correct framebuffer
    function setupRenderBufferStorage(renderbuffer, renderTarget) {

        _gl.bindRenderbuffer(_gl.RENDERBUFFER, renderbuffer);

        if (renderTarget.depthBuffer && !renderTarget.stencilBuffer) {

            _gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height);
            _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer);

        } else if (renderTarget.depthBuffer && renderTarget.stencilBuffer) {

            _gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height);
            _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer);

        } else {

            // FIXME: We don't support !depth !stencil
            _gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.RGBA4, renderTarget.width, renderTarget.height);

        }

        _gl.bindRenderbuffer(_gl.RENDERBUFFER, null);

    }

    // Setup resources for a Depth Texture for a FBO (needs an extension)
    function setupDepthTexture(framebuffer, renderTarget) {

        var isCube = (renderTarget && renderTarget.isWebGLRenderTargetCube);
        if (isCube) throw new Error('Depth Texture with cube render targets is not supported');

        _gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer);

        if (!(renderTarget.depthTexture && renderTarget.depthTexture.isDepthTexture)) {

            throw new Error('renderTarget.depthTexture must be an instance of Speed3DEngine.DepthTexture');

        }

        // upload an empty depth texture with framebuffer size
        if (!properties.get(renderTarget.depthTexture).__webglTexture ||
            renderTarget.depthTexture.image.width !== renderTarget.width ||
            renderTarget.depthTexture.image.height !== renderTarget.height) {

            renderTarget.depthTexture.image.width = renderTarget.width;
            renderTarget.depthTexture.image.height = renderTarget.height;
            renderTarget.depthTexture.needsUpdate = true;

        }

        setTexture2D(renderTarget.depthTexture, 0);

        var webglDepthTexture = properties.get(renderTarget.depthTexture).__webglTexture;

        if (renderTarget.depthTexture.format === DepthFormat) {

            _gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.TEXTURE_2D, webglDepthTexture, 0);

        } else if (renderTarget.depthTexture.format === DepthStencilFormat) {

            _gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.TEXTURE_2D, webglDepthTexture, 0);

        } else {

            throw new Error('Unknown depthTexture format');

        }

    }

    // Setup GL resources for a non-texture depth buffer
    function setupDepthRenderbuffer(renderTarget) {

        var renderTargetProperties = properties.get(renderTarget);

        var isCube = (renderTarget.isWebGLRenderTargetCube === true);

        if (renderTarget.depthTexture) {

            if (isCube) throw new Error('target.depthTexture not supported in Cube render targets');

            setupDepthTexture(renderTargetProperties.__webglFramebuffer, renderTarget);

        } else {

            if (isCube) {

                renderTargetProperties.__webglDepthbuffer = [];

                for (var i = 0; i < 6; i++) {

                    _gl.bindFramebuffer(_gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer[i]);
                    renderTargetProperties.__webglDepthbuffer[i] = _gl.createRenderbuffer();
                    setupRenderBufferStorage(renderTargetProperties.__webglDepthbuffer[i], renderTarget);

                }

            } else {

                _gl.bindFramebuffer(_gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
                renderTargetProperties.__webglDepthbuffer = _gl.createRenderbuffer();
                setupRenderBufferStorage(renderTargetProperties.__webglDepthbuffer, renderTarget);

            }

        }

        _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);

    }

    // Set up GL resources for the render target
    function setupRenderTarget(renderTarget) {

        var renderTargetProperties = properties.get(renderTarget);
        var textureProperties = properties.get(renderTarget.texture);

        renderTarget.addEventListener('dispose', onRenderTargetDispose);

        textureProperties.__webglTexture = _gl.createTexture();

        info.memory.textures++;

        var isCube = (renderTarget.isWebGLRenderTargetCube === true);
        var isTargetPowerOfTwo = isPowerOfTwo(renderTarget);

        // Setup framebuffer

        if (isCube) {

            renderTargetProperties.__webglFramebuffer = [];

            for (var i = 0; i < 6; i++) {

                renderTargetProperties.__webglFramebuffer[i] = _gl.createFramebuffer();

            }

        } else {

            renderTargetProperties.__webglFramebuffer = _gl.createFramebuffer();

        }

        // Setup color buffer

        if (isCube) {

            state.bindTexture(_gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);
            setTextureParameters(_gl.TEXTURE_CUBE_MAP, renderTarget.texture, isTargetPowerOfTwo);

            for (var i = 0; i < 6; i++) {

                setupFrameBufferTexture(renderTargetProperties.__webglFramebuffer[i], renderTarget, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i);

            }

            if (textureNeedsGenerateMipmaps(renderTarget.texture, isTargetPowerOfTwo)) {

                generateMipmap(_gl.TEXTURE_CUBE_MAP, renderTarget.texture, renderTarget.width, renderTarget.height);

            }

            state.bindTexture(_gl.TEXTURE_CUBE_MAP, null);

        } else {

            state.bindTexture(_gl.TEXTURE_2D, textureProperties.__webglTexture);
            setTextureParameters(_gl.TEXTURE_2D, renderTarget.texture, isTargetPowerOfTwo);
            setupFrameBufferTexture(renderTargetProperties.__webglFramebuffer, renderTarget, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_2D);

            if (textureNeedsGenerateMipmaps(renderTarget.texture, isTargetPowerOfTwo)) {

                generateMipmap(_gl.TEXTURE_2D, renderTarget.texture, renderTarget.width, renderTarget.height);

            }

            state.bindTexture(_gl.TEXTURE_2D, null);

        }

        // Setup depth and stencil buffers

        if (renderTarget.depthBuffer) {

            setupDepthRenderbuffer(renderTarget);

        }

    }

    function updateRenderTargetMipmap(renderTarget) {

        var texture = renderTarget.texture;
        var isTargetPowerOfTwo = isPowerOfTwo(renderTarget);

        if (textureNeedsGenerateMipmaps(texture, isTargetPowerOfTwo)) {

            var target = renderTarget.isWebGLRenderTargetCube ? _gl.TEXTURE_CUBE_MAP : _gl.TEXTURE_2D;
            var webglTexture = properties.get(texture).__webglTexture;

            state.bindTexture(target, webglTexture);
            generateMipmap(target, texture, renderTarget.width, renderTarget.height);
            state.bindTexture(target, null);

        }

    }

    function updateVideoTexture(texture) {

        var id = texture.id;
        var frame = info.render.frame;

        // Check the last frame we updated the VideoTexture

        if (_videoTextures[id] !== frame) {

            _videoTextures[id] = frame;
            texture.update();

        }

    }

    this.setTexture2D = setTexture2D;
    this.setTextureCube = setTextureCube;
    this.setTextureCubeDynamic = setTextureCubeDynamic;
    this.setupRenderTarget = setupRenderTarget;
    this.updateRenderTargetMipmap = updateRenderTargetMipmap;

}*/

class WebGLTextures {

    constructor(_gl, extensions, state, properties, capabilities, utils, info) {
        this._gl = _gl;
        this.extensions = extensions;
        this.state = state;
        this.properties = properties;
        this.capabilities = capabilities;
        this.utils = utils;
        this.info = info;
        this._isWebGL2 = (typeof WebGL2RenderingContext !== 'undefined' && _gl instanceof WebGL2RenderingContext);
        /* global WebGL2RenderingContext */
        this._videoTextures = {};
        this._canvas;
    }

    clampToMaxSize(image, maxSize) {
        if (image.width > maxSize || image.height > maxSize) {
            if ('data' in image) {
                console.warn('Speed3DEngine.WebGLRenderer: image in DataTexture is too big (' + image.width + 'x' + image.height + ').');
                return;
            }
            // Warning: Scaling through the canvas will only work with images that use
            // premultiplied alpha.
            let scale = maxSize / Math.max(image.width, image.height);
            let canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
            canvas.width = Math.floor(image.width * scale);
            canvas.height = Math.floor(image.height * scale);
            let context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
            console.warn('Speed3DEngine.WebGLRenderer: image is too big (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);
            return canvas;
        }
        return image;
    }

    isPowerOfTwo(image) {
        return _Math.isPowerOfTwo(image.width) && _Math.isPowerOfTwo(image.height);
    }

    makePowerOfTwo(image) {
        if (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement || image instanceof ImageBitmap) {
            if (this._canvas === undefined) this._canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
            this._canvas.width = _Math.floorPowerOfTwo(image.width);
            this._canvas.height = _Math.floorPowerOfTwo(image.height);
            let context = this._canvas.getContext('2d');
            context.drawImage(image, 0, 0, this._canvas.width, this._canvas.height);
            console.warn('Speed3DEngine.WebGLRenderer: image is not power of two (' + image.width + 'x' + image.height + '). Resized to ' + this._canvas.width + 'x' + this._canvas.height, image);
            return this._canvas;
        }
        return image;
    }

    textureNeedsPowerOfTwo(texture) {
        return (texture.wrapS !== ClampToEdgeWrapping || texture.wrapT !== ClampToEdgeWrapping) ||
            (texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter);
    }

    textureNeedsGenerateMipmaps(texture, isPowerOfTwo) {
        return texture.generateMipmaps && isPowerOfTwo &&
            texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter;
    }

    generateMipmap(target, texture, width, height) {
        this._gl.generateMipmap(target);
        // Note: Math.log( x ) * Math.LOG2E used instead of Math.log2( x ) which is not supported by IE11
        this.properties.get(texture).__maxMipLevel = Math.log(Math.max(width, height)) * Math.LOG2E;
    }

    // Fallback filters for non-power-of-2 textures
    filterFallback(f) {
        if (f === NearestFilter || f === NearestMipMapNearestFilter || f === NearestMipMapLinearFilter) {
            return this._gl.NEAREST;
        }
        return this._gl.LINEAR;
    }

    onTextureDispose(event) {
        let texture = event.target;
        texture.removeEventListener('dispose', this.onTextureDispose);
        this.deallocateTexture(texture);
        if (texture.isVideoTexture) {
            delete this._videoTextures[texture.id];
        }
        this.info.memory.textures--;
    }

    onRenderTargetDispose(event) {
        let renderTarget = event.target;
        renderTarget.removeEventListener('dispose', this.onRenderTargetDispose);
        this.deallocateRenderTarget(renderTarget);
        this.info.memory.textures--;
    }

    deallocateTexture(texture) {
        let textureProperties = this.properties.get(texture);
        if (texture.image && textureProperties.__image__webglTextureCube) {
            // cube texture
            this._gl.deleteTexture(textureProperties.__image__webglTextureCube);
        } else {
            // 2D texture
            if (textureProperties.__webglInit === undefined) return;
            this._gl.deleteTexture(textureProperties.__webglTexture);
        }
        // remove all webgl properties
        this.properties.remove(texture);
    }

    deallocateRenderTarget(renderTarget) {
        let renderTargetProperties = this.properties.get(renderTarget);
        let textureProperties = this.properties.get(renderTarget.texture);
        if (!renderTarget) return;
        if (textureProperties.__webglTexture !== undefined) {
            this._gl.deleteTexture(textureProperties.__webglTexture);
        }
        if (renderTarget.depthTexture) {
            renderTarget.depthTexture.dispose();
        }
        if (renderTarget.isWebGLRenderTargetCube) {
            for (let i = 0; i < 6; i++) {
                this._gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer[i]);
                if (renderTargetProperties.__webglDepthbuffer) this._gl.deleteRenderbuffer(renderTargetProperties.__webglDepthbuffer[i]);
            }
        } else {
            this._gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer);
            if (renderTargetProperties.__webglDepthbuffer) this._gl.deleteRenderbuffer(renderTargetProperties.__webglDepthbuffer);
        }
        this.properties.remove(renderTarget.texture);
        this.properties.remove(renderTarget);
    }

    setTexture2D(texture, slot) {
        let textureProperties = this.properties.get(texture);
        if (texture.isVideoTexture) this.updateVideoTexture(texture);
        if (texture.version > 0 && textureProperties.__version !== texture.version) {
            let image = texture.image;
            if (image === undefined) {
                console.warn('Speed3DEngine.WebGLRenderer: Texture marked for update but image is undefined', texture);
            } else if (image.complete === false) {
                console.warn('Speed3DEngine.WebGLRenderer: Texture marked for update but image is incomplete', texture);
            } else {
                this.uploadTexture(textureProperties, texture, slot);
                return;
            }
        }
        this.state.activeTexture(this._gl.TEXTURE0 + slot);
        this.state.bindTexture(this._gl.TEXTURE_2D, textureProperties.__webglTexture);
    }

    setTextureCube(texture, slot) {
        let textureProperties = this.properties.get(texture);
        if (texture.image.length === 6) {
            if (texture.version > 0 && textureProperties.__version !== texture.version) {
                if (!textureProperties.__image__webglTextureCube) {
                    texture.addEventListener('dispose', this.onTextureDispose);
                    textureProperties.__image__webglTextureCube = this._gl.createTexture();
                    this.info.memory.textures++;
                }
                this.state.activeTexture(this._gl.TEXTURE0 + slot);
                this.state.bindTexture(this._gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube);
                this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
                let isCompressed = (texture && texture.isCompressedTexture);
                let isDataTexture = (texture.image[0] && texture.image[0].isDataTexture);
                let cubeImage = [];
                for (let i = 0; i < 6; i++) {
                    if (!isCompressed && !isDataTexture) {
                        cubeImage[i] = this.clampToMaxSize(texture.image[i], this.capabilities.maxCubemapSize);
                    } else {
                        cubeImage[i] = isDataTexture ? texture.image[i].image : texture.image[i];
                    }
                }
                let image = cubeImage[0],
                    isPowerOfTwoImage = this.isPowerOfTwo(image),
                    glFormat = this.utils.convert(texture.format),
                    glType = this.utils.convert(texture.type);
                this.setTextureParameters(this._gl.TEXTURE_CUBE_MAP, texture, isPowerOfTwoImage);
                let mipmaps = cubeImage[i].mipmaps;
                for (let i = 0; i < 6; i++) {
                    if (!isCompressed) {
                        if (isDataTexture) {
                            this.state.texImage2D(this._gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, cubeImage[i].width, cubeImage[i].height, 0, glFormat, glType, cubeImage[i].data);
                        } else {
                            this.state.texImage2D(this._gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, glFormat, glType, cubeImage[i]);
                        }
                    } else {
                        let mipmap = cubeImage[i].mipmaps;
                        for (let j = 0, jl = mipmaps.length; j < jl; j++) {
                            mipmap = mipmaps[j];
                            if (texture.format !== RGBAFormat && texture.format !== RGBFormat) {
                                if (this.state.getCompressedTextureFormats().indexOf(glFormat) > -1) {
                                    this.state.compressedTexImage2D(this._gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, mipmap.data);
                                } else {
                                    console.warn('Speed3DEngine.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()');
                                }
                            } else {
                                this.state.texImage2D(this._gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);
                            }
                        }
                    }
                }
                if (!isCompressed) {
                    textureProperties.__maxMipLevel = 0;
                } else {
                    textureProperties.__maxMipLevel = mipmaps.length - 1;
                }
                if (this.textureNeedsGenerateMipmaps(texture, isPowerOfTwoImage)) {
                    // We assume images for cube map have the same size.
                    this.generateMipmap(this._gl.TEXTURE_CUBE_MAP, texture, image.width, image.height);
                }
                textureProperties.__version = texture.version;
                if (texture.onUpdate) texture.onUpdate(texture);
            } else {
                this.state.activeTexture(this._gl.TEXTURE0 + slot);
                this.state.bindTexture(this._gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube);
            }
        }
    }

    setTextureCubeDynamic(texture, slot) {
        this.state.activeTexture(this._gl.TEXTURE0 + slot);
        this.state.bindTexture(this._gl.TEXTURE_CUBE_MAP, this.properties.get(texture).__webglTexture);
    }

    setTextureParameters(textureType, texture, isPowerOfTwoImage) {
        let extension;
        if (isPowerOfTwoImage) {
            this._gl.texParameteri(textureType, this._gl.TEXTURE_WRAP_S, this.utils.convert(texture.wrapS));
            this._gl.texParameteri(textureType, this._gl.TEXTURE_WRAP_T, this.utils.convert(texture.wrapT));
            this._gl.texParameteri(textureType, this._gl.TEXTURE_MAG_FILTER, this.utils.convert(texture.magFilter));
            this._gl.texParameteri(textureType, this._gl.TEXTURE_MIN_FILTER, this.utils.convert(texture.minFilter));
        } else {
            this._gl.texParameteri(textureType, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
            this._gl.texParameteri(textureType, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
            if (texture.wrapS !== ClampToEdgeWrapping || texture.wrapT !== ClampToEdgeWrapping) {
                console.warn('Speed3DEngine.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to Speed3DEngine.ClampToEdgeWrapping.', texture);
            }
            this._gl.texParameteri(textureType, this._gl.TEXTURE_MAG_FILTER, this.filterFallback(texture.magFilter));
            this._gl.texParameteri(textureType, this._gl.TEXTURE_MIN_FILTER, this.filterFallback(texture.minFilter));
            if (texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter) {
                console.warn('Speed3DEngine.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to Speed3DEngine.NearestFilter or Speed3DEngine.LinearFilter.', texture);
            }
        }
        extension = this.extensions.get('EXT_texture_filter_anisotropic');
        if (extension) {
            if (texture.type === FloatType && this.extensions.get('OES_texture_float_linear') === null) return;
            if (texture.type === HalfFloatType && this.extensions.get('OES_texture_half_float_linear') === null) return;
            if (texture.anisotropy > 1 || this.properties.get(texture).__currentAnisotropy) {
                this._gl.texParameterf(textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(texture.anisotropy, this.capabilities.getMaxAnisotropy()));
                this.properties.get(texture).__currentAnisotropy = texture.anisotropy;
            }
        }
    }

    uploadTexture(textureProperties, texture, slot) {
        if (textureProperties.__webglInit === undefined) {
            textureProperties.__webglInit = true;
            texture.addEventListener('dispose', this.onTextureDispose);
            textureProperties.__webglTexture = this._gl.createTexture();
            this.info.memory.textures++;
        }
        this.state.activeTexture(this._gl.TEXTURE0 + slot);
        this.state.bindTexture(this._gl.TEXTURE_2D, textureProperties.__webglTexture);
        this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
        this._gl.pixelStorei(this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha);
        this._gl.pixelStorei(this._gl.UNPACK_ALIGNMENT, texture.unpackAlignment);
        let image = this.clampToMaxSize(texture.image, this.capabilities.maxTextureSize);
        if (this.textureNeedsPowerOfTwo(texture) && this.isPowerOfTwo(image) === false) {
            image = this.makePowerOfTwo(image);
        }
        let isPowerOfTwoImage = this.isPowerOfTwo(image),
            glFormat = this.utils.convert(texture.format),
            glType = this.utils.convert(texture.type);
        this.setTextureParameters(this._gl.TEXTURE_2D, texture, isPowerOfTwoImage);
        let mipmap, mipmaps = texture.mipmaps;
        if (texture.isDepthTexture) {
            // populate depth texture with dummy data
            let internalFormat = this._gl.DEPTH_COMPONENT;
            if (texture.type === FloatType) {
                if (!this._isWebGL2) throw new Error('Float Depth Texture only supported in WebGL2.0');
                internalFormat = this._gl.DEPTH_COMPONENT32F;
            } else if (this._isWebGL2) {
                // WebGL 2.0 requires signed internalformat for glTexImage2D
                internalFormat = this._gl.DEPTH_COMPONENT16;
            }
            if (texture.format === DepthFormat && internalFormat === this._gl.DEPTH_COMPONENT) {
                // The error INVALID_OPERATION is generated by texImage2D if format and internalformat are
                // DEPTH_COMPONENT and type is not UNSIGNED_SHORT or UNSIGNED_INT
                // (https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/)
                if (texture.type !== UnsignedShortType && texture.type !== UnsignedIntType) {
                    console.warn('Speed3DEngine.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture.');
                    texture.type = UnsignedShortType;
                    glType = this.utils.convert(texture.type);
                }
            }
            // Depth stencil textures need the DEPTH_STENCIL internal format
            // (https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/)
            if (texture.format === DepthStencilFormat) {
                internalFormat = this._gl.DEPTH_STENCIL;
                // The error INVALID_OPERATION is generated by texImage2D if format and internalformat are
                // DEPTH_STENCIL and type is not UNSIGNED_INT_24_8_WEBGL.
                // (https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/)
                if (texture.type !== UnsignedInt248Type) {
                    console.warn('Speed3DEngine.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture.');
                    texture.type = UnsignedInt248Type;
                    glType = this.utils.convert(texture.type);
                }
            }
            this.state.texImage2D(this._gl.TEXTURE_2D, 0, internalFormat, image.width, image.height, 0, glFormat, glType, null);
        } else if (texture.isDataTexture) {
            // use manually created mipmaps if available
            // if there are no manual mipmaps
            // set 0 level mipmap and then use GL to generate other mipmap levels
            if (mipmaps.length > 0 && isPowerOfTwoImage) {
                for (let i = 0, il = mipmaps.length; i < il; i++) {
                    mipmap = mipmaps[i];
                    this.state.texImage2D(this._gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);
                }
                texture.generateMipmaps = false;
                textureProperties.__maxMipLevel = mipmaps.length - 1;
            } else {
                this.state.texImage2D(this._gl.TEXTURE_2D, 0, glFormat, image.width, image.height, 0, glFormat, glType, image.data);
                textureProperties.__maxMipLevel = 0;
            }
        } else if (texture.isCompressedTexture) {
            for (let i = 0, il = mipmaps.length; i < il; i++) {
                mipmap = mipmaps[i];
                if (texture.format !== RGBAFormat && texture.format !== RGBFormat) {
                    if (this.state.getCompressedTextureFormats().indexOf(glFormat) > -1) {
                        this.state.compressedTexImage2D(this._gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, mipmap.data);
                    } else {
                        console.warn('Speed3DEngine.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()');
                    }
                } else {
                    this.state.texImage2D(this._gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);
                }
            }
            textureProperties.__maxMipLevel = mipmaps.length - 1;
        } else {
            // regular Texture (image, video, canvas)
            // use manually created mipmaps if available
            // if there are no manual mipmaps
            // set 0 level mipmap and then use GL to generate other mipmap levels
            if (mipmaps.length > 0 && isPowerOfTwoImage) {
                for (let i = 0, il = mipmaps.length; i < il; i++) {
                    mipmap = mipmaps[i];
                    this.state.texImage2D(this._gl.TEXTURE_2D, i, glFormat, glFormat, glType, mipmap);
                }
                texture.generateMipmaps = false;
                textureProperties.__maxMipLevel = mipmaps.length - 1;
            } else {
                this.state.texImage2D(this._gl.TEXTURE_2D, 0, glFormat, glFormat, glType, image);
                textureProperties.__maxMipLevel = 0;
            }
        }
        if (this.textureNeedsGenerateMipmaps(texture, isPowerOfTwoImage)) {
            this.generateMipmap(this._gl.TEXTURE_2D, texture, image.width, image.height);
        }
        textureProperties.__version = texture.version;
        if (texture.onUpdate) texture.onUpdate(texture);
    }
    // Render targets
    // Setup storage for target texture and bind it to correct framebuffer
    setupFrameBufferTexture(framebuffer, renderTarget, attachment, textureTarget) {
        let glFormat = this.utils.convert(renderTarget.texture.format);
        let glType = this.utils.convert(renderTarget.texture.type);
        this.state.texImage2D(textureTarget, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null);
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, framebuffer);
        this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, attachment, textureTarget, this.properties.get(renderTarget.texture).__webglTexture, 0);
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);

    }
    // Setup storage for internal depth/stencil buffers and bind to correct framebuffer
    setupRenderBufferStorage(renderbuffer, renderTarget) {
        this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, renderbuffer);
        if (renderTarget.depthBuffer && !renderTarget.stencilBuffer) {
            this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height);
            this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.RENDERBUFFER, renderbuffer);
        } else if (renderTarget.depthBuffer && renderTarget.stencilBuffer) {
            this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height);
            this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.DEPTH_STENCIL_ATTACHMENT, this._gl.RENDERBUFFER, renderbuffer);
        } else {
            // FIXME: We don't support !depth !stencil
            this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.RGBA4, renderTarget.width, renderTarget.height);
        }
        this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, null);
    }
    // Setup resources for a Depth Texture for a FBO (needs an extension)
    setupDepthTexture(framebuffer, renderTarget) {
        let isCube = (renderTarget && renderTarget.isWebGLRenderTargetCube);
        if (isCube) throw new Error('Depth Texture with cube render targets is not supported');
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, framebuffer);
        if (!(renderTarget.depthTexture && renderTarget.depthTexture.isDepthTexture)) {
            throw new Error('renderTarget.depthTexture must be an instance of Speed3DEngine.DepthTexture');
        }
        // upload an empty depth texture with framebuffer size
        if (!this.properties.get(renderTarget.depthTexture).__webglTexture ||
            renderTarget.depthTexture.image.width !== renderTarget.width ||
            renderTarget.depthTexture.image.height !== renderTarget.height) {
            renderTarget.depthTexture.image.width = renderTarget.width;
            renderTarget.depthTexture.image.height = renderTarget.height;
            renderTarget.depthTexture.needsUpdate = true;
        }
        this.setTexture2D(renderTarget.depthTexture, 0);
        let webglDepthTexture = this.properties.get(renderTarget.depthTexture).__webglTexture;
        if (renderTarget.depthTexture.format === DepthFormat) {
            this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.TEXTURE_2D, webglDepthTexture, 0);
        } else if (renderTarget.depthTexture.format === DepthStencilFormat) {
            this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.DEPTH_STENCIL_ATTACHMENT, this._gl.TEXTURE_2D, webglDepthTexture, 0);
        } else {
            throw new Error('Unknown depthTexture format');
        }
    }
    // Setup GL resources for a non-texture depth buffer
    setupDepthRenderbuffer(renderTarget) {
        let renderTargetProperties = this.properties.get(renderTarget);
        let isCube = (renderTarget.isWebGLRenderTargetCube === true);
        if (renderTarget.depthTexture) {
            if (isCube) throw new Error('target.depthTexture not supported in Cube render targets');
            this.setupDepthTexture(renderTargetProperties.__webglFramebuffer, renderTarget);
        } else {
            if (isCube) {
                renderTargetProperties.__webglDepthbuffer = [];
                for (let i = 0; i < 6; i++) {
                    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer[i]);
                    renderTargetProperties.__webglDepthbuffer[i] = this._gl.createRenderbuffer();
                    this.setupRenderBufferStorage(renderTargetProperties.__webglDepthbuffer[i], renderTarget);
                }
            } else {
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
                renderTargetProperties.__webglDepthbuffer = this._gl.createRenderbuffer();
                this.setupRenderBufferStorage(renderTargetProperties.__webglDepthbuffer, renderTarget);
            }
        }
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
    }
    // Set up GL resources for the render target
    setupRenderTarget(renderTarget) {
        let renderTargetProperties = this.properties.get(renderTarget);
        let textureProperties = this.properties.get(renderTarget.texture);
        renderTarget.addEventListener('dispose', this.onRenderTargetDispose);
        textureProperties.__webglTexture = this._gl.createTexture();
        this.info.memory.textures++;
        let isCube = (renderTarget.isWebGLRenderTargetCube === true);
        let isTargetPowerOfTwo = this.isPowerOfTwo(renderTarget);
        // Setup framebuffer
        if (isCube) {
            renderTargetProperties.__webglFramebuffer = [];
            for (let i = 0; i < 6; i++) {
                renderTargetProperties.__webglFramebuffer[i] = this._gl.createFramebuffer();
            }
        } else {
            renderTargetProperties.__webglFramebuffer = this._gl.createFramebuffer();
        }
        // Setup color buffer
        if (isCube) {
            this.state.bindTexture(this._gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);
            this.setTextureParameters(this._gl.TEXTURE_CUBE_MAP, renderTarget.texture, isTargetPowerOfTwo);
            for (let i = 0; i < 6; i++) {
                this.setupFrameBufferTexture(renderTargetProperties.__webglFramebuffer[i], renderTarget, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_CUBE_MAP_POSITIVE_X + i);
            }
            if (this.textureNeedsGenerateMipmaps(renderTarget.texture, isTargetPowerOfTwo)) {
                this.generateMipmap(this._gl.TEXTURE_CUBE_MAP, renderTarget.texture, renderTarget.width, renderTarget.height);
            }
            this.state.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
        } else {
            this.state.bindTexture(this._gl.TEXTURE_2D, textureProperties.__webglTexture);
            this.setTextureParameters(this._gl.TEXTURE_2D, renderTarget.texture, isTargetPowerOfTwo);
            this.setupFrameBufferTexture(renderTargetProperties.__webglFramebuffer, renderTarget, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D);
            if (this.textureNeedsGenerateMipmaps(renderTarget.texture, isTargetPowerOfTwo)) {
                this.generateMipmap(this._gl.TEXTURE_2D, renderTarget.texture, renderTarget.width, renderTarget.height);
            }
            this.state.bindTexture(this._gl.TEXTURE_2D, null);
        }
        // Setup depth and stencil buffers
        if (renderTarget.depthBuffer) {
            this.setupDepthRenderbuffer(renderTarget);
        }
    }

    updateRenderTargetMipmap(renderTarget) {
        let texture = renderTarget.texture;
        let isTargetPowerOfTwo = this.isPowerOfTwo(renderTarget);
        if (this.textureNeedsGenerateMipmaps(texture, isTargetPowerOfTwo)) {
            let target = renderTarget.isWebGLRenderTargetCube ? this._gl.TEXTURE_CUBE_MAP : this._gl.TEXTURE_2D;
            let webglTexture = this.properties.get(texture).__webglTexture;
            this.state.bindTexture(target, webglTexture);
            this.generateMipmap(target, texture, renderTarget.width, renderTarget.height);
            this.state.bindTexture(target, null);
        }

    }

    updateVideoTexture(texture) {
        let id = texture.id;
        let frame = this.info.render.frame;
        // Check the last frame we updated the VideoTexture
        if (this._videoTextures[id] !== frame) {
            this._videoTextures[id] = frame;
            texture.update();
        }
    }
}


export {WebGLTextures};
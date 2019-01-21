/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

class WebGLAttributes {

    constructor(gl) {
        this.buffers = new WeakMap();
        this.gl = gl;
    }

    createBuffer(attribute, bufferType) {
        let array = attribute.array;
        let usage = attribute.dynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW;
        let buffer = this.gl.createBuffer();
        this.gl.bindBuffer(bufferType, buffer);
        this.gl.bufferData(bufferType, array, usage);
        attribute.onUploadCallback();
        let type = this.gl.FLOAT;
        if (array instanceof Float32Array) {
            type = this.gl.FLOAT;
        } else if (array instanceof Float64Array) {
            console.warn('Speed3DEngine.WebGLAttributes: Unsupported data buffer format: Float64Array.');
        } else if (array instanceof Uint16Array) {
            type = this.gl.UNSIGNED_SHORT;
        } else if (array instanceof Int16Array) {
            type = this.gl.SHORT;
        } else if (array instanceof Uint32Array) {
            type = this.gl.UNSIGNED_INT;
        } else if (array instanceof Int32Array) {
            type = this.gl.INT;
        } else if (array instanceof Int8Array) {
            type = this.gl.BYTE;
        } else if (array instanceof Uint8Array) {
            type = this.gl.UNSIGNED_BYTE;
        }
        return {
            buffer: buffer,
            type: type,
            bytesPerElement: array.BYTES_PER_ELEMENT,
            version: attribute.version
        };
    }

    updateBuffer(buffer, attribute, bufferType) {
        let array = attribute.array;
        let updateRange = attribute.updateRange;
        this.gl.bindBuffer(bufferType, buffer);
        if (attribute.dynamic === false) {
            this.gl.bufferData(bufferType, array, this.gl.STATIC_DRAW);
        } else if (updateRange.count === -1) {
            // Not using update ranges
            this.gl.bufferSubData(bufferType, 0, array);
        } else if (updateRange.count === 0) {
            console.error('Speed3DEngine.WebGLObjects.updateBuffer: dynamic Speed3DEngine.BufferAttribute marked as needsUpdate but updateRange.count is 0, ensure you are using set methods or updating manually.');
        } else {
            this.gl.bufferSubData(bufferType, updateRange.offset * array.BYTES_PER_ELEMENT,
                array.subarray(updateRange.offset, updateRange.offset + updateRange.count));
            updateRange.count = -1; // reset range
        }
    }

    get(attribute) {
        if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;
        return this.buffers.get(attribute);
    }

    remove(attribute) {
        if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;
        let data = this.buffers.get(attribute);
        if (data) {
            this.gl.deleteBuffer(data.buffer);
            this.buffers.delete(attribute);
        }
    }

    update(attribute, bufferType) {
        if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;
        let data = this.buffers.get(attribute);
        if (data === undefined) {
            this.buffers.set(attribute, this.createBuffer(attribute, bufferType));
        } else if (data.version < attribute.version) {
            this.updateBuffer(data.buffer, attribute, bufferType);
            data.version = attribute.version;
        }
    }
}
export {WebGLAttributes};
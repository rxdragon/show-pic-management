/* eslint-disable */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Crc32 = /*#__PURE__*/function () {
  function Crc32() {
    _classCallCheck(this, Crc32);

    this.crc = -1;
  }

  _createClass(Crc32, [{
    key: "append",
    value: function append(data) {
      var crc = this.crc | 0;
      var table = this.table;

      for (var offset = 0, len = data.length | 0; offset < len; offset++) {
        crc = crc >>> 8 ^ table[(crc ^ data[offset]) & 0xFF];
      }

      this.crc = crc;
    }
  }, {
    key: "get",
    value: function get() {
      return ~this.crc;
    }
  }]);

  return Crc32;
}();

Crc32.prototype.table = function () {
  var i;
  var j;
  var t;
  var table = [];

  for (i = 0; i < 256; i++) {
    t = i;

    for (j = 0; j < 8; j++) {
      t = t & 1 ? t >>> 1 ^ 0xEDB88320 : t >>> 1;
    }

    table[i] = t;
  }

  return table;
}();

var getDataHelper = function getDataHelper(byteLength) {
  var uint8 = new Uint8Array(byteLength);
  return {
    array: uint8,
    view: new DataView(uint8.buffer)
  };
};

var pump = function pump(zipObj) {
  return zipObj.reader.read().then(function (chunk) {
    if (chunk.done) return zipObj.writeFooter();
    var outputData = chunk.value;
    zipObj.crc.append(outputData);
    zipObj.uncompressedLength += outputData.length;
    zipObj.compressedLength += outputData.length;
    zipObj.ctrl.enqueue(outputData);
  });
};
/**
 * [createWriter description]
 * @param  {Object} underlyingSource [description]
 * @return {Boolean}                  [description]
 */


function createWriter(underlyingSource) {
  var files = Object.create(null);
  var filenames = [];
  var encoder = new TextEncoder();
  var offset = 0;
  var activeZipIndex = 0;
  var ctrl;
  var activeZipObject, closed;

  function next() {
    activeZipIndex++;
    activeZipObject = files[filenames[activeZipIndex]];
    if (activeZipObject) processNextChunk();else if (closed) closeZip();
  }

  var zipWriter = {
    enqueue: function enqueue(fileLike) {
      if (closed) throw new TypeError('Cannot enqueue a chunk into a readable stream that is closed or has been requested to be closed');
      var name = fileLike.name.trim();
      var date = new Date(typeof fileLike.lastModified === 'undefined' ? Date.now() : fileLike.lastModified);
      if (fileLike.directory && !name.endsWith('/')) name += '/';
      if (files[name]) throw new Error('File already exists.');
      var nameBuf = encoder.encode(name);
      filenames.push(name);
      var zipObject = files[name] = {
        level: 0,
        ctrl: ctrl,
        directory: !!fileLike.directory,
        nameBuf: nameBuf,
        comment: encoder.encode(fileLike.comment || ''),
        compressedLength: 0,
        uncompressedLength: 0,
        writeHeader: function writeHeader() {
          var header = getDataHelper(26);
          var data = getDataHelper(30 + nameBuf.length);
          zipObject.offset = offset;
          zipObject.header = header;

          if (zipObject.level !== 0 && !zipObject.directory) {
            header.view.setUint16(4, 0x0800);
          }

          header.view.setUint32(0, 0x14000808);
          header.view.setUint16(6, (date.getHours() << 6 | date.getMinutes()) << 5 | date.getSeconds() / 2, true);
          header.view.setUint16(8, (date.getFullYear() - 1980 << 4 | date.getMonth() + 1) << 5 | date.getDate(), true);
          header.view.setUint16(22, nameBuf.length, true);
          data.view.setUint32(0, 0x504b0304);
          data.array.set(header.array, 4);
          data.array.set(nameBuf, 30);
          offset += data.array.length;
          ctrl.enqueue(data.array);
        },
        writeFooter: function writeFooter() {
          var footer = getDataHelper(16);
          footer.view.setUint32(0, 0x504b0708);

          if (zipObject.crc) {
            zipObject.header.view.setUint32(10, zipObject.crc.get(), true);
            zipObject.header.view.setUint32(14, zipObject.compressedLength, true);
            zipObject.header.view.setUint32(18, zipObject.uncompressedLength, true);
            footer.view.setUint32(4, zipObject.crc.get(), true);
            footer.view.setUint32(8, zipObject.compressedLength, true);
            footer.view.setUint32(12, zipObject.uncompressedLength, true);
          }

          ctrl.enqueue(footer.array);
          offset += zipObject.compressedLength + 16;
          next();
        },
        fileLike: fileLike
      };

      if (!activeZipObject) {
        activeZipObject = zipObject;
        processNextChunk();
      }
    },
    close: function close() {
      if (closed) throw new TypeError('Cannot close a readable stream that has already been requested to be closed');
      if (!activeZipObject) closeZip();
      closed = true;
    }
  };

  function closeZip() {
    var length = 0;
    var index = 0;
    var indexFilename, file;

    for (indexFilename = 0; indexFilename < filenames.length; indexFilename++) {
      file = files[filenames[indexFilename]];
      length += 46 + file.nameBuf.length + file.comment.length;
    }

    var data = getDataHelper(length + 22);

    for (indexFilename = 0; indexFilename < filenames.length; indexFilename++) {
      file = files[filenames[indexFilename]];
      data.view.setUint32(index, 0x504b0102);
      data.view.setUint16(index + 4, 0x1400);
      data.array.set(file.header.array, index + 6);
      data.view.setUint16(index + 32, file.comment.length, true);

      if (file.directory) {
        data.view.setUint8(index + 38, 0x10);
      }

      data.view.setUint32(index + 42, file.offset, true);
      data.array.set(file.nameBuf, index + 46);
      data.array.set(file.comment, index + 46 + file.nameBuf.length);
      index += 46 + file.nameBuf.length + file.comment.length;
    }

    data.view.setUint32(index, 0x504b0506);
    data.view.setUint16(index + 8, filenames.length, true);
    data.view.setUint16(index + 10, filenames.length, true);
    data.view.setUint32(index + 12, length, true);
    data.view.setUint32(index + 16, offset, true);
    ctrl.enqueue(data.array);
    ctrl.close();
  }

  function processNextChunk() {
    if (!activeZipObject) return;
    if (activeZipObject.directory) return activeZipObject.writeFooter(activeZipObject.writeHeader());
    if (activeZipObject.reader) return pump(activeZipObject);

    if (activeZipObject.fileLike.stream) {
      activeZipObject.crc = new Crc32();
      activeZipObject.reader = activeZipObject.fileLike.stream().getReader();
      activeZipObject.writeHeader();
    } else next();
  }

  return new ReadableStream({
    start: function start(c) {
      ctrl = c;
      underlyingSource.start && Promise.resolve(underlyingSource.start(zipWriter));
    },
    pull: function pull() {
      return processNextChunk() || underlyingSource.pull && Promise.resolve(underlyingSource.pull(zipWriter));
    }
  });
}

var _default = createWriter;
exports.default = _default;
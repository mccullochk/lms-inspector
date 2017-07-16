import fs from 'fs';
import path from 'path';
import { LMSInspector } from '../src/lms-inspector';

// zip
const buzzArrayBuffer = new Uint8Array(fs.readFileSync(path.resolve(__dirname, 'samples/buzz.zip'))).buffer;
const blackboardArrayBuffer = new Uint8Array(fs.readFileSync(path.resolve(__dirname, 'samples/blackboard.zip'))).buffer;
const canvasArrayBuffer = new Uint8Array(fs.readFileSync(path.resolve(__dirname, 'samples/canvas.imscc'))).buffer;
const d2lArrayBuffer = new Uint8Array(fs.readFileSync(path.resolve(__dirname, 'samples/d2l.zip'))).buffer;
const moodleZipArrayBuffer = new Uint8Array(fs.readFileSync(path.resolve(__dirname, 'samples/moodle.zip'))).buffer;
// gzip
const moodleArrayBuffer = new Uint8Array(fs.readFileSync(path.resolve(__dirname, 'samples/moodle.mbz'))).buffer;

it('converts a file to an ArrayBuffer', () => {
  const buffer = new ArrayBuffer(10);
  const file = new File([buffer], 'filename');
  LMSInspector.convertFileToArrayBuffer(file)
    .then(result => expect(buffer).toEqual(result));
});

it('can determine the kind of compression an ArrayBuffer has', () => {
  expect(LMSInspector.determineCompression(buzzArrayBuffer)).toEqual('zip');
  expect(LMSInspector.determineCompression(moodleArrayBuffer)).toEqual('gzip');
});

it('can uncompress a zip', () => {
  LMSInspector.uncompressZip(buzzArrayBuffer)
    .then(files => expect(files[0]).toEqual('brainhoneymanifest.xml'));
});

it('can uncompress a gzip', () => {
  LMSInspector.uncompressGzip(moodleArrayBuffer)
    .then(files => expect(files[0]).toEqual('activities/'));
});

it('can determine what kind of lms a list of files is for', () => {
  LMSInspector.uncompressZip(buzzArrayBuffer)
    .then(files => expect(LMSInspector.checkForLMS(files)).toEqual('buzz'));
  LMSInspector.uncompressZip(blackboardArrayBuffer)
    .then(files => expect(LMSInspector.checkForLMS(files)).toEqual('blackboard'));
  LMSInspector.uncompressZip(canvasArrayBuffer)
    .then(files => expect(LMSInspector.checkForLMS(files)).toEqual('canvas'));
  LMSInspector.uncompressZip(d2lArrayBuffer)
    .then(files => expect(LMSInspector.checkForLMS(files)).toEqual('d2l'));
  LMSInspector.uncompressZip(moodleZipArrayBuffer)
    .then(files => expect(LMSInspector.checkForLMS(files)).toEqual('moodle'));

  LMSInspector.uncompressGzip(moodleArrayBuffer)
  .then(files => expect(LMSInspector.checkForLMS(files)).toEqual('moodle'));
});

it('inspects a file', () => {
  LMSInspector.inspect(new File([buzzArrayBuffer], 'buzz.zip'))
    .then(type => expect(type).toEqual('buzz'));
});
const {assert} = require('chai');
const request = require('supertest');
const path = require('path');

const app = require('../app');


describe('Upload API [/api/upload]', () => {
    it('Should throw error with status code 400 when files are not uploaded',
        (done) => {
            request(app)
                .post('/api/upload')
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);

                    assert.equal(res.body.error, 'file1 and file2 fields are required.')
                    done();
                });
        });

    it('Should still throw error with status code 400 if only one of the 2 required files is uploaded',
        (done) => {
            const file2 = path.join(__dirname, './mock-files/clientmark.csv');
            request(app)
                .post('/api/upload')
                .attach('file2', file2)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);

                    assert.equal(res.body.error, 'file1 and file2 fields are required.')
                    done();
                });
        });

    it('Should throw error with status code 409 when unsupported file format is uploaded',
        (done) => {
            const file1 = path.join(__dirname, './mock-files/wrong_file.png');
            const file2 = path.join(__dirname, './mock-files/clientmark.csv');
            request(app)
                .post('/api/upload')
                .attach('file1', file1)
                .attach('file2', file2)
                .expect(409)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.body.error, 'Files must be in csv format.');
                    done();
                });
        });

    it('Should return the files reports object when both inputs are valid',
        (done) => {
            const file1 = path.join(__dirname, './mock-files/tutukamark.csv');
            const file2 = path.join(__dirname, './mock-files/clientmark.csv');

            const expectedResponse = {
                message: 'Upload successful',
                file1Report: {
                    totalRecords: 305,
                    totalMatchingRecords: 288,
                    totalUnmatchedRecords: 17,
                },
                file2Report: {
                    totalRecords: 306,
                    totalMatchingRecords: 290,
                    totalUnmatchedRecords: 16,
                }
            }

            request(app)
                .post('/api/upload')
                .attach('file1', file1)
                .attach('file2', file2)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.body.msg, expectedResponse.message);

                    // File1 report assertions
                    assert.equal(res.body.file1Report.totalRecords, expectedResponse.file1Report.totalRecords);
                    assert.equal(res.body.file1Report.totalMatchingRecords, expectedResponse.file1Report.totalMatchingRecords);
                    assert.equal(res.body.file1Report.totalUnmatchedRecords, expectedResponse.file1Report.totalUnmatchedRecords);

                    // File2 report assertions
                    assert.equal(res.body.file2Report.totalRecords, expectedResponse.file2Report.totalRecords);
                    assert.equal(res.body.file2Report.totalMatchingRecords, expectedResponse.file2Report.totalMatchingRecords);
                    assert.equal(res.body.file2Report.totalUnmatchedRecords, expectedResponse.file2Report.totalUnmatchedRecords);

                    done();
                });
        });
})

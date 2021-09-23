const path = require('path');
const formidable = require('formidable');

const fileService = require('../services/FileService');

class FileController {

    handleUpload = async (req, res) => {
        try {

            const uploadedFiles = await this.parseUploadedFiles(req);

            const reports = await fileService.getFilesMatchingReports(uploadedFiles.file1.path, uploadedFiles.file2.path);

            return res.status(200).json({
                msg: 'Upload successful',
                ...reports
            });
        } catch (err) {
            return res.status(err.status ? err.status : 500).json({
                msg: 'Upload not successful',
                error: err.error ? err.error : err
            });
        }
    }

    parseUploadedFiles = async (req) => {
        return new Promise((resolve, reject) => {
            const uploadPath = path.join(__dirname, '../uploads');
            const form = formidable.IncomingForm();
            form.uploadDir = uploadPath;
            form.keepExtensions = true;

            form.parse(req, (err, fields, files) => {
                if (err) reject({status: 500, error: err});

                if (files.file1 && files.file2) {
                    const file1Ext = files.file1.name.split('.').pop().toLowerCase();
                    const file2Ext = files.file2.name.split('.').pop().toLowerCase();
                    if (file1Ext !== 'csv' || file2Ext !== 'csv') {

                        fileService.removeFiles(files.file1.path, files.file2.path);

                        return reject({status: 409, error: 'Files must be in csv format.'});
                    }

                    return resolve(files);
                }

                fileService.removeFiles(files.file1 && files.file1.path, files.file2 && files.file2.path);
                return reject({status: 400, error: 'file1 and file2 fields are required.'});
            });
        });
    }
}

module.exports = new FileController();

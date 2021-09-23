const fs = require('fs');

class FileService {

    /**
     * service method that reads file using the fs module
     *
     * @method readFile
     * @param {string} filePath - filePath parameter
     * @return {object} promise
     */
    readFile(filePath) {
        return new Promise((resolve, reject) => {
            let fileContent = '';
            fs.createReadStream(filePath)
                .on('data', (chunk) => {
                    fileContent += chunk;
                })
                .on('error', (err) => {
                    reject(err);
                })
                .on('end', () => {
                    resolve(fileContent);
                })
        })
    }

    /**
     * service method that formats the content of a file into object by matching the headers to the content
     * e.g
     * {
     *     ProfileName": "Card Campaign",
     *     "TransactionDate": "2014-01-12 05:33:22",
     *     "TransactionAmount": "-32400",
     * }
     *
     * @method formatFileContent
     * @param {string} content - file content parameter
     * @param {string} header - header parameter
     * @return {object} formatted object
     */
    formatFileContent(content, header) {
        const contentList = content.replace('\r', '').split(',')
        const headerList = header.replace('\r', '').split(',')

        return headerList.reduce((prev, headerItem, index) => {
            prev[headerItem] = contentList[index];
            return prev;
        }, {});
    }

    /**
     * service method that compares the two files and generates their reports
     *
     * @method generateMatchingReport
     * @param {array} reportFileList - base file to compare
     * @param {array} comparisonFileList - file to compare with the base file
     * @return {object} report object
     */
    generateMatchingReport(reportFileList, comparisonFileList) {
        if(!Array.isArray(reportFileList) || !Array.isArray(comparisonFileList)) {
            throw new Error('Both arguments must be arrays');
        }

        const reportFileHeader = reportFileList[0];

        // Creating a lookup comparison object to compare report file against it
        const comparisonLookup = comparisonFileList.reduce((prev, item) => {
            if (item) prev[item] = true;
            return prev;
        }, {});

        let unmatchedReports = [];

        reportFileList
            .forEach((item, index) => {
                if (index === 0 || !item) {
                    reportFileList.splice(index, 1);
                    return;
                }

                if(!comparisonLookup[item]) {
                    unmatchedReports.push(
                        this.formatFileContent(item, reportFileHeader)
                    );
                }
            })
        ;

        return {
            totalRecords: reportFileList.length,
            totalMatchingRecords: reportFileList.length - unmatchedReports.length,
            totalUnmatchedRecords: unmatchedReports.length,
            unmatchedRecords: unmatchedReports
        }
    }

    /**
     * service method that gets the matching reports
     *
     * @method getFilesMatchingReports
     * @param {string} file1Path - base file to compare
     * @param {string} file2Path - file to compare with the base file
     * @return {object} matching reports object
     */
    async getFilesMatchingReports(file1Path, file2Path) {
        const file1 = await this.readFile(file1Path);
        const file2 = await this.readFile(file2Path);

        const file1ContentList = file1.toString().split('\n');
        const file2ContentList = file2.toString().split('\n');

        const file1Report = this.generateMatchingReport(file1ContentList, file2ContentList);
        const file2Report = this.generateMatchingReport(file2ContentList, file1ContentList);

        this.removeFiles(file1Path, file2Path);

        return {
            file1Report,
            file2Report
        }
    }

    /**
     * service method that removes uploaded files
     *
     * @method removeFiles
     * @param {string} file1Path - base file to compare
     * @param {string} file2Path - file to compare with the base file
     * @return {void}
     */
    removeFiles(file1Path, file2Path) {
        if(file1Path) {
            fs.unlink(file1Path, err => {
                if (err) console.error(err)
            });
        }
        if(file2Path) {
            fs.unlink(file2Path, err => {
                if (err) console.error(err)
            });
        }
    }
}

module.exports = new FileService();

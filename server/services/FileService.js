const fs = require('fs');

class FileService {

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

    formatFileContent(content, header) {
        const contentList = content.replace('\r', '').split(',')
        const headerList = header.replace('\r', '').split(',')

        return headerList.reduce((prev, headerItem, index) => {
            prev[headerItem] = contentList[index];
            return prev;
        }, {});
    }

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
            header: reportFileHeader,
            unmatchedRecords: unmatchedReports
        }
    }

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

    removeFiles(file1Path, file2Path) {
        fs.unlink(file1Path, err => {
            if (err) console.error(err)
        });
        fs.unlink(file2Path, err => {
            if (err) console.error(err)
        });
    }
}

module.exports = new FileService();

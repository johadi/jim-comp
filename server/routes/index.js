const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/upload', async (req, res) => {
    try {
        const docPath = path.join(__dirname, '../uploads/');

        const clientFile = await readFile(docPath + 'clientmark.csv');
        const tutukaFile = await readFile(docPath + 'tutukamark.csv');

        let clientFileDataList = clientFile.toString().split('\n');
        let tutukaFileDataList = tutukaFile.toString().split('\n');

        const clientHeader = clientFileDataList[0].replace('\r', '').split(',');
        const tutukaHeader = tutukaFileDataList[0].replace('\r', '').split(',');

        // Remove the header from the array
        //clientFileDataList.splice(0, 1);
        //tutukaFileDataList.splice(0, 1);

        const clientFileLookup = clientFileDataList.reduce((prev, item) => {
            if (item) prev[item] = true;
            return prev;
        }, {});

        let unmatchedTutuka = [];

        tutukaFileDataList
            .forEach((item, index) => {
                if (index === 0 || !item) {
                    tutukaFileDataList.splice(index, 1);
                    return;
                }

                if(!clientFileLookup[item]) {
                    unmatchedTutuka.push(formatItem(
                        item.replace('\r', '').split(','),
                        tutukaHeader
                    ));
                }
            })
        ;

        const tutukaData = {
            totalRecords: tutukaFileDataList.length,
            totalMatchedRecords: tutukaFileDataList.length - unmatchedTutuka.length,
            unmatchedRecords: unmatchedTutuka,
            header: tutukaHeader
        }

        console.log('unmatched Tutuka=>', unmatchedTutuka);
        console.log('unmatched Tutuka Length =>', unmatchedTutuka.length);

        const tutukaFileLookup = tutukaFileDataList.reduce((prev, item) => {
            if (item) prev[item] = true;
            return prev;
        }, {});

        let unmatchedClient = [];
        clientFileDataList
            .forEach((item, index) => {
                if (index === 0 || !item) {
                    clientFileDataList.splice(index, 1);
                    return;
                }

                if(!tutukaFileLookup[item]) {
                    unmatchedClient.push(formatItem(
                        item.replace('\r', '').split(','),
                        clientHeader
                    ));
                }
            });

        const clientData = {
            totalRecords: clientFileDataList.length,
            totalMatchedRecords: clientFileDataList.length - unmatchedClient.length,
            unmatchedRecords: unmatchedClient,
            header: clientHeader
        }

        console.log('unmatched Client =>', unmatchedClient);
        console.log('unmatched Client Length =>', unmatchedClient.length);

        //console.log('======>', clientFileLookup);

        return res.status(200).json({
            msg: 'Upload successful',
            file1: clientData,
            file2: tutukaData
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Upload not successful'
        });
    }
})

module.exports = router;

function readFile(filePath) {
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

function formatItem(item, header) {
    return header.reduce((prev, currentItem, index) => {
        prev[currentItem] = item[index];
        return prev;
    }, {});
}

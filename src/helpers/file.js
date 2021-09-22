const EXTRA_SMALL_DEVICE_WIDTH = 320;

export const formatFileName = (fileName, windowWidth) => {
    const fileNameSplit = fileName.split('.');
    const extension  = fileNameSplit.pop();
    const formattedFileName  = fileNameSplit.join('').replace('.');

    if(
        (windowWidth > EXTRA_SMALL_DEVICE_WIDTH && formattedFileName.length < 30) ||
        (windowWidth <=EXTRA_SMALL_DEVICE_WIDTH && formattedFileName.length <= 24))
    {
        return fileName;
    }

    const charLength = windowWidth <= EXTRA_SMALL_DEVICE_WIDTH ? 15 : 20;
    const actualFileName = formattedFileName.substr(0, charLength) +'...'+ formattedFileName.substr(-3);

    return actualFileName+'.'+extension;
}

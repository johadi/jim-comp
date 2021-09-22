import './styles/ComparisonResult.css';
import {Card, Button} from "../shared";
import {formatFileName} from "../helpers";
import {useWindowSize} from "../hooks";

const ComparisonResult = ({report, fileNames, handleUnmatchedReports, showUnmatchedReport}) => {
    const windowSize = useWindowSize();

    return (
        <Card>
            <section className="result-section">
                <h3 className="text-success">Comparison results</h3>
                <div className="result-wrapper">
                    <div className="report">
                        <h3 className="text-filename">{formatFileName(fileNames.file1, windowSize[0])}</h3>
                        <p>Total Records: {report.file1Report.totalRecords}</p>
                        <p>Matching Records: {report.file1Report.totalMatchingRecords}</p>
                        <p>Unmatched Records: {report.file1Report.totalUnmatchedRecords}</p>
                    </div>
                    <div className="report">
                        <h3 className="text-filename">{formatFileName(fileNames.file2, windowSize[0])}</h3>
                        <p>Total Records: {report.file2Report.totalRecords}</p>
                        <p>Matching Records: {report.file2Report.totalMatchingRecords}</p>
                        <p>Unmatched Records: {report.file2Report.totalUnmatchedRecords}</p>
                    </div>
                </div>
                <div className="button-wrapper">
                    <Button className={showUnmatchedReport ? 'btn-hide' : ''} onClick={handleUnmatchedReports}>
                        {showUnmatchedReport ? 'Hide' : 'View'} Unmatched Reports
                    </Button>
                </div>
            </section>
        </Card>
    )
}

export default ComparisonResult;

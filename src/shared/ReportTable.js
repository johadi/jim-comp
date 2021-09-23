import './styles/ReportTable.css';
import {Button} from "./index";
import {v4 as uuidv4} from "uuid";

const ReportTable = ({fileName, fileReport, openModal, isFile1, headers}) => {

    if(fileReport.unmatchedRecords.length === 0) {
        return (
            <div>
                <h3 className="report-title">{fileName}</h3>
                <p>No unmatched records</p>
            </div>
        )
    }

    return (
        <div className="file-report">
            <div className="report-title-wrapper">
                <h3 className="report-title">{fileName}</h3>
                <Button onClick={() => openModal(fileReport.unmatchedRecords, isFile1)}>
                    View full table
                </Button>
            </div>
            <table className="report-table">
                <thead>
                <tr>
                    {
                        headers.slice(0, 3)
                            .map(record => <th key={uuidv4()}>{record}</th>)
                    }
                </tr>
                </thead>
                <tbody>
                {
                    fileReport.unmatchedRecords.map(record => (
                        <tr key={uuidv4()}>
                            {
                                Object.keys(record).slice(0, 3).map(r => <td key={uuidv4()}>{record[r]}</td>)
                            }
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    )
}

export default ReportTable;

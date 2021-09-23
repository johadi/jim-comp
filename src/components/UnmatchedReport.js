import {useState} from 'react';
import { v4 as uuidv4 } from 'uuid';


import './styles/UnmatchedReport.css';
import {Card, Button, Modal, ReportTable} from "../shared";

const UnmatchedReport = ({report, fileNames}) => {
    const [isOpen, toggleOpen] = useState(false);
    const [modalTableReport, setModalTableReport] = useState([]);
    const [isFile1, toggleFile1] = useState(true);

    const openModal = (modalReport, isFile1 = true) => {
        toggleFile1(isFile1);
        setModalTableReport(modalReport);
        toggleOpen(true);
    }

    const closeModal = () => {
        setModalTableReport([]);
        toggleOpen(false);
    }

    const getHeaders = (item) => {
        return item && item.length > 0 ? Object.keys(item[0]) : [];
    }

    return (
        <Card>
            <section className="unmatched-section">
                <h3 className="text-success">Unmatched reports</h3>
                <div className="table-wrapper">
                    <ReportTable
                        fileReport={report.file1Report}
                        fileName={fileNames.file1}
                        isFile1={true}
                        openModal={openModal}
                        headers={getHeaders(report.file1Report.unmatchedRecords)}
                    />
                    <ReportTable
                        fileReport={report.file2Report}
                        fileName={fileNames.file2}
                        isFile1={false}
                        openModal={openModal}
                        headers={getHeaders(report.file2Report.unmatchedRecords)}
                    />
                </div>
            </section>
            <Modal isOpen={isOpen} handleClose={closeModal} title={(isFile1 ? fileNames.file1 : fileNames.file2) + ' unmatched report'}>
                {
                    modalTableReport.length > 0 && (
                        <table className="report-table modal-report-table">
                            <thead>
                            <tr>
                                {
                                    getHeaders(modalTableReport).map(record => <th key={uuidv4()}>{record}</th>)
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {
                                modalTableReport.map(record => (
                                    <tr key={uuidv4()}>
                                        {
                                            Object.keys(record).map(r => <td key={uuidv4()}>{record[r]}</td>)
                                        }
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    )
                }
            </Modal>
        </Card>
    )
}

export default UnmatchedReport;

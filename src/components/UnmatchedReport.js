import {useState} from 'react';
import { v4 as uuidv4 } from 'uuid';


import './styles/UnmatchedReport.css';
import {Card, Button, Modal} from "../shared";

const UnmatchedReport = ({report, fileNames}) => {
    const [isOpen, toggleOpen] = useState(false);
    const [modalTableReport, setModalTableReport] = useState([]);
    const [isFile1, toggleFile1] = useState(true);

    const getHeaders = (item) => {
        return Object.keys(item);
    }

    const openModal = (modalReport, isFile1 = true) => {
        toggleFile1(isFile1);
        setModalTableReport(modalReport);
        toggleOpen(true);
    }

    const closeModal = () => {
        setModalTableReport([]);
        toggleOpen(false);
    }

    return (
        <Card>
            <section className="unmatched-section">
                <h3 className="text-success">Unmatched reports</h3>
                <div className="table-wrapper">
                    <div className="file1-report">
                        <div className="report-title-wrapper">
                            <h3 className="report-title">{fileNames.file1}</h3>
                            <Button onClick={() => openModal(report.file1Report.unmatchedRecords, true)}>View full table</Button>
                        </div>
                        <table className="report-table">
                            <thead>
                            <tr>
                                {
                                    getHeaders(report.file1Report.unmatchedRecords[0]).slice(0, 3)
                                        .map(record => <th key={uuidv4()}>{record}</th>)
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {
                                report.file1Report.unmatchedRecords.map(record => (
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
                    <div className="file2-report">
                        <div className="report-title-wrapper">
                            <h3 className="report-title">{fileNames.file2}</h3>
                            <Button onClick={() => openModal(report.file2Report.unmatchedRecords, false)}>View full table</Button>
                        </div>
                        <table className="report-table">
                            <thead>
                            <tr>
                                {
                                    getHeaders(report.file2Report.unmatchedRecords[0]).slice(0, 3)
                                        .map(record => <th key={uuidv4()}>{record}</th>)
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {
                                report.file2Report.unmatchedRecords.map(record => (
                                    <tr key={uuidv4()}>
                                        {
                                            Object.keys(record).slice(0,3).map(r => <td key={uuidv4()}>{record[r]}</td>)
                                        }
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            <Modal isOpen={isOpen} handleClose={closeModal} title={(isFile1 ? fileNames.file1 : fileNames.file2) + ' unmatched report'}>
                {
                    modalTableReport.length > 0 && (
                        <table className="report-table modal-report-table">
                            <thead>
                            <tr>
                                {
                                    getHeaders(modalTableReport[0]).map(record => <th key={uuidv4()}>{record}</th>)
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

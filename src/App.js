import {useState, useRef} from 'react';
import {ComparisonResult, UnmatchedReport, FilesUpload} from "./components";
import './styles/App.css';

function App() {
    const elementRef = useRef(null);
    const prevViewHeight = useRef(0);

    const scrollToReportTable = () => {
        if(elementRef.current) {
            setTimeout(() => {
                window.scrollTo({ behavior: "smooth", top: prevViewHeight.current });
            }, 0)
        }
    }

    const [fileNames, setFileNames] = useState(null);
    const [report, setReport] = useState(null);
    const [showUnmatchedReport, setShowUnmatchedReport] = useState(false);

    const updateReport = (file1Name, file2Name, filesReport) => {
        prevViewHeight.current = elementRef.current.clientHeight;
        setFileNames({file1: file1Name, file2: file2Name});
        setReport(filesReport);
        if(!filesReport) {
            setShowUnmatchedReport(false);
        }
    }

    const handleUnmatchedReports = () => {
        // setShowUnmatchedReport(true);
        setShowUnmatchedReport(!showUnmatchedReport);
        scrollToReportTable();
    }

    return (
        <div className="App" ref={elementRef}>
            <header className="App-header">
                <h2>Files Comparison</h2>
            </header>
            <main className="container">
                <div className="text-success text-title">Application that compares two files and generates their reports</div>
                <FilesUpload updateReport={updateReport}/>
                {
                    report && (
                        <ComparisonResult
                            report={report}
                            fileNames={fileNames}
                            showUnmatchedReport={showUnmatchedReport}
                            handleUnmatchedReports={handleUnmatchedReports}
                        />
                    )
                }

                {
                    report && showUnmatchedReport && (
                        <UnmatchedReport
                            fileNames={fileNames}
                            report={report}
                        />
                    )
                }
            </main>
        </div>
    );
}

export default App;

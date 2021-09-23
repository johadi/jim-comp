import {useRef, useState} from 'react';
import './styles/FilesUpload.css';
import {Button, Card} from "../shared";
import axios from "axios";
import {API_BASE_URL} from "../constants";

const FilesUpload = ({updateReport}) => {
    const file1Ref = useRef(null);
    const file2Ref = useRef(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCompare = async () => {
        setLoading(true);
        const file1 = file1Ref.current.files[0];
        const file2 = file2Ref.current.files[0];
        if(!file1 || !file2) {
            setError('You must select both files for comparison.');
            updateReport('', '', null);
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file1', file1);
        formData.append('file2', file2);

        try {
            const response = await axios.post(`${API_BASE_URL}api/upload`, formData);
            setError(null);
            updateReport(file1.name, file2.name, response.data);
        } catch (error) {
            updateReport('', '', null);
            if(error.response && error.response.data && error.response.data.error && typeof error.response.data.error === 'string') {
                setError(error.response.data.error);
                return;
            }

            setError('Something went wrong. Try again.')
        } finally {
            setLoading(false);
        }

    }

    return (
        <Card>
            <section className="upload-section">
                <div className="upload-wrapper">
                    <h3 className="text-success">Select files to compare</h3>
                    {error && <div className="dialog-error">{error}</div>}
                    <div className="form-input-wrapper">
                        <label htmlFor="file1">Select file 1:</label>
                        <input id="file1" name="file1" type="file" ref={file1Ref} />
                    </div>
                    <div className="form-input-wrapper">
                        <label htmlFor="file2">Select file 2:</label>
                        <input id="file2" name="file2" type="file" ref={file2Ref} />
                    </div>
                    <div className="button-wrapper">
                        <Button disabled={loading} large="true" onClick={handleCompare}>
                            {loading ? 'Comparing files...': 'Compare files'}
                        </Button>
                    </div>
                </div>
            </section>
        </Card>
    )
}

export default FilesUpload;

import "./style/Note.css";
import { FaInfoCircle } from "react-icons/fa";
import {useState} from "react"

function Note({ note }) {

    const [infoClick, setInfoClick] = useState(false);
    const handleInfoClick = () => {
        setInfoClick(prevState => !prevState);
    }

    const handleDescription = (desc) => {
        alert(desc)
    }

    return (
        <div className="note">
            <div className="note_detail">
                <div className="faculty_name">Faculty: {note.facultyName}</div>
                <div className="description" onClick={() => {
                    handleDescription(note.description)
                }}>{note.description}</div>
                <div className="pdf_url">
                    <a href={note.pdfURL} target="_blank" rel="noopener noreferrer">View PDF</a>
                </div>
                <div className="info-toggle" onClick={handleInfoClick}>
                    <FaInfoCircle />
                </div>   
            </div>
            {infoClick && 
                <div className="info">
                    <div className="user_name">{note.user.name}</div>
                    <div className="email">{note.user.email}</div>
                    <div>Upload Time: {new Date(note.uploadTime.seconds * 1000).toLocaleString()}</div>
                </div>
            }
        </div>
    );
}

export default Note;

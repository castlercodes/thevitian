import "./style/Note.css";
import { FaInfoCircle } from "react-icons/fa";
import { useState } from "react";
import { useUser } from "../store/UserProvider";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

function Note({ note }) {
    const { currUser, setCurrUser } = useUser();
    const [infoClick, setInfoClick] = useState(false);

    const handleInfoClick = () => {
        setInfoClick((prevState) => !prevState);
    };

    const handleDescription = (desc) => {
        alert(desc);
    };

    const handlePdfView = async () => {
        const reply = window.prompt("Viewing this PDF will reduce 10 points. Type yes if you want to view the PDF");

        if (reply?.toLowerCase() === "yes") {
            const newPoints = currUser.points - 10;

            if (newPoints < 0) {
                alert("Not enough points to view the PDF.");
                return;
            }

            // Open the PDF link immediately in a new tab
            const pdfWindow = window.open(note.fileURL, "_blank");

            try {
                const userRef = doc(db, "users", currUser.id);
                await updateDoc(userRef, { points: newPoints });

                const updatedUser = {
                    ...currUser,
                    points: newPoints,
                };

                sessionStorage.setItem("user", JSON.stringify(updatedUser));
                setCurrUser(updatedUser);

                // Focus the new window (if it was created)
                if (pdfWindow) {
                    pdfWindow.focus();
                } else {
                    alert("Pop-up blocked. Please allow pop-ups for this site.");
                }
            } catch (error) {
                console.error("Error updating user points: ", error);
                alert("Error processing the request.");
            }
        }
    };

    return (
        <div className="note">
            <div className="note_detail">
                <div className="faculty_name">Faculty: {note.facultyName}</div>
                <div className="description" onClick={() => handleDescription(note.description)}>
                    {note.description}
                </div>
                <div className="pdf_url" onClick={handlePdfView}>
                    View PDF
                </div>
                <div className="info-toggle" onClick={handleInfoClick}>
                    <FaInfoCircle />
                </div>
            </div>
            {infoClick && (
                <div className="info">
                    <div className="user_name">{note.user.name}</div>
                    <div className="email">{note.user.email}</div>
                    <div>Upload Time: {new Date(note.uploadTime.seconds * 1000).toLocaleString()}</div>
                </div>
            )}
        </div>
    );
}

export default Note;

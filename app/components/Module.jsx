"use client"
import "./style/Module.css"
import { useState, useEffect } from "react";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import { collection, addDoc, doc, updateDoc, getDocs, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUser } from "../store/UserProvider"; // Adjust the import based on your project structure
import { usePathname } from 'next/navigation';
import { db } from "@/lib/firebase";
import Note from "./Note";



function Module({ module_number, module_name}) {
  const [window_display, setWindowDisplay] = useState("none");
  const [showPreview, setShowPreview] = useState(false);
  const [notes, setNotes] = useState([]); // State to store retrieved notes

  const { currUser, setCurrUser } = useUser();
  const pathname = usePathname();
  const courseCode = pathname.split('/').pop();  // This will give you the course code
  

  const handleWindowClick = async() => {
    setWindowDisplay(window_display === "" ? "none" : "");

    if(window_display === "none"){
      try {
        const q = query(
          collection(db, "notes"),
          where("courseCode", "==", courseCode),
          where("moduleNumber", "==", module_number)
        );
        const querySnapshot = await getDocs(q);
        const notesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(notesList)
        setNotes(notesList);
      } catch (error) {
        console.error("Error fetching notes: ", error);
      }
    }
  };

  return (
    <div className="module">
      <div className="module_heading" onClick={handleWindowClick}>
        <div>Module {module_number}: {module_name}</div>
        <div style={{ display: `${window_display}` }} className="circle_down"><FaChevronCircleDown /></div>
        <div style={{ display: `${window_display === "none" ? "" : "none"}` }} className="circle_down"><FaChevronCircleUp /></div>
      </div>
      <div style={{ display: `${window_display}` }}>
        <div className="notes-list">
          {notes.length > 0 ? (
            notes.map(note => (
              <Note key={note.id} note={note}/>
            ))
          ) : (
            <p>No notes uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Module;

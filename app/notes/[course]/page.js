"use client"
import { useState, useEffect } from 'react'
import Module from '@/app/components/Module.jsx'
import styles from "./page.module.css"
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { PDFDocument } from 'pdf-lib'; // Import pdf-lib for PDF manipulation
import { useUser } from "@/app/store/UserProvider"; // Adjust the import based on your project structure
import { usePathname } from 'next/navigation';
import { db } from "@/lib/firebase";

const schema = z.object({
  facultyName: z.string().min(1, 'Faculty Name is required'),
  description: z.string().optional(),
  pdf: z.any().refine((file) => file && file[0]?.type === 'application/pdf', 'PDF file is required'),
});

function Page() {
  const [moduleNames, setModuleNames] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [notes, setNotes] = useState([]); // State to store retrieved notes
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    setModuleNames(JSON.parse(localStorage.getItem('moduleNames')));
  }, [])

  const { currUser, setCurrUser } = useUser();
  const pathname = usePathname();
  const courseCode = pathname.split('/').pop();  // This will give you the course code

  const { control, handleSubmit, formState: { errors }, register, getValues } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      facultyName: '',
      description: '',
      pdf: null,
    },
  });

  const compressPdfFile = async (file) => {
    const fileArrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileArrayBuffer);
    // Perform any necessary operations on the PDF here
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  };

  const onSubmit = async (data) => {
    if (Object.keys(currUser).length > 0) {
      setLoading(true); // Start loading

      let moduleNumber = window.prompt("Please Enter the module Number for this notes (Enter 0 if it contains notes for multiple modules): ");
      moduleNumber = parseInt(moduleNumber, 10);

      const storage = getStorage();
      const storageRef = ref(storage, `notes/${courseCode}_${Date.now()}.pdf`);

      try {
        const compressedPdf = await compressPdfFile(data.pdf[0]);
        await uploadBytes(storageRef, compressedPdf);

        const downloadURL = await getDownloadURL(storageRef);

        const docData = {
          facultyName: data.facultyName,
          description: data.description,
          pdfURL: downloadURL,
          courseCode: courseCode,
          moduleNumber: moduleNumber,
          user: {
            id: currUser.id,
            name: currUser.displayName,
            email: currUser.email,
          },
          uploadTime: new Date(),
          likes: 0,
          dislikes: 0,
        };

        const docRef = await addDoc(collection(db, "notes"), docData);
        console.log("Document written with ID: ", docRef.id);
        alert("Course added successfully!");

        const newPoints = currUser.points + 40;
        const userRef = doc(db, "users", currUser.id);

        await updateDoc(userRef, {
          points: newPoints
        });

        const updatedUser = {
          ...currUser,
          points: newPoints
        };

        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrUser(updatedUser);

        console.log("User points updated successfully in Firestore");
      } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error adding course: " + error.message);
      } finally {
        setLoading(false); // End loading
        setShowPreview(false);
      }
    } else {
      alert("Please Login with VIT Email ID");
    }
  };

  return (
    <div className={styles.course_page}>
      {loading && <div className={styles.upload_status}>Uploading...</div>} {/* Show upload status */}
      <div className={styles.notes_upload}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.notes}>
            <div className={styles.notes_detail}>
              <div className={styles.details_input}>
                <input {...register('facultyName')} placeholder="Faculty Name" />
                {errors.facultyName && <p>{errors.facultyName.message}</p>}
              </div>
              <div className={styles.details_input}>
                <input {...register('description')} placeholder="Short Description" />
                {errors.description && <p>{errors.description.message}</p>}
              </div>
            </div>
            <div className={styles.notes_upload_option}>
              <div className={styles.notes_input}>
                <input type="file" accept="application/pdf" {...register('pdf')} />
                {errors.pdf && <p>{errors.pdf.message}</p>}
              </div>
              <button type="submit" disabled={loading}>Submit</button> {/* Disable submit button while loading */}
            </div>
          </div>
        </form>
      </div>
      <Module module_number={0} module_name="General Notes" />
      {moduleNames && moduleNames.map((moduleName, idx) => (
        <Module key={idx} module_number={idx + 1} module_name={moduleName} />
      ))}
    </div>
  )
}

export default Page;

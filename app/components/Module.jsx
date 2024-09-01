"use client"
import "./style/Module.css"
import { useState } from "react";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { compressAccurately } from 'image-conversion'; // Import compression library
import { PDFDocument } from 'pdf-lib'; // Import pdf-lib for PDF manipulation

const schema = z.object({
  facultyName: z.string().min(1, 'Faculty Name is required'),
  description: z.string().min(5, 'Description should be at least 5 characters'),
  pdf: z.any().refine((file) => file && file[0]?.type === 'application/pdf', 'PDF file is required'),
});

function Module({ module_number, module_name, db, currUser, setCurrUser }) {
  const [window_display, setWindowDisplay] = useState("none");
  const [showPreview, setShowPreview] = useState(false);

  const { control, handleSubmit, formState: { errors }, register, getValues } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      facultyName: '',
      description: '',
      pdf: null,
    },
  });

  const handleWindowClick = () => {
    setWindowDisplay(window_display === "" ? "none" : "");
  };

  const compressPdfFile = async (file) => {
    const fileArrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileArrayBuffer);
    const pdfBytes = await pdfDoc.save();

    // Compress the PDF file
    const compressedPdfBlob = await compressAccurately(new Blob([pdfBytes]), 0.5); // 0.5 for medium compression, adjust as needed
    return compressedPdfBlob;
  };

  const onSubmit = async (data) => {
    setShowPreview(true);
    const storage = getStorage();
    const storageRef = ref(storage, `notes/${data.facultyName}_${Date.now()}.pdf`);

    try {
      const compressedPdf = await compressPdfFile(data.pdf[0]);
      await uploadBytes(storageRef, compressedPdf);

      const downloadURL = await getDownloadURL(storageRef);

      const docData = {
        facultyName: data.facultyName,
        description: data.description,
        pdfURL: downloadURL,
      };

      const docRef = await addDoc(collection(db, "notes"), docData);
      console.log("Document written with ID: ", docRef.id);
      alert("Course added successfully!");

      const newPoints = currUser.points + 10;
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
    }

    setShowPreview(false);
  };

  return (
    <div className="module">
      <div className="module_heading" onClick={handleWindowClick}>
        <div>Module {module_number + 1}: {module_name}</div>
        <div style={{ display: `${window_display}` }} className="circle_down"><FaChevronCircleDown /></div>
        <div style={{ display: `${window_display === "none" ? "" : "none"}` }} className="circle_up"><FaChevronCircleUp /></div>
      </div>
      <div style={{ display: `${window_display}` }}>
        <div className="notes-upload">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="notes">
              <div className="notes-detail">
                <div>
                  <input {...register('facultyName')} placeholder="Faculty Name"/>
                  {errors.facultyName && <p>{errors.facultyName.message}</p>}
                </div>
                <div>
                  <input {...register('description')} placeholder="Short Description"/>
                  {errors.description && <p>{errors.description.message}</p>}
                </div>
              </div>
              <div className="notes-upload-option">
                <div>
                  <input type="file" accept="application/pdf" {...register('pdf')} />
                  {errors.pdf && <p>{errors.pdf.message}</p>}
                </div>
                <button type="submit">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Module;

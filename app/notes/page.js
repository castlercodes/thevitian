"use client";
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import styles from "./page.module.css";
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { db } from '@/lib/firebase'; 
import { collection, addDoc, getDocs, getDoc, doc, updateDoc } from "firebase/firestore"; 
import CourseCard from '../components/CourseCard';
import { useUser } from '../store/UserProvider';

const schema = z.object({
  courseName: z.string().min(5, 'Course Name should be at least 5 characters long'),
  courseCode: z.string().min(5, 'Course Code should be at least 5 characters long'),
  moduleNames: z.array(z.string().min(5, 'Module Name should be at least 5 characters long')).length(7, 'Please provide exactly 7 module names'),
});

function Page() {
  const [moveCounter, setMoveCounter] = useState(7);
  const [showPreview, setShowPreview] = useState(false);
  const [courses, setCourses] = useState([]); 
  const {currUser, setCurrUser} = useUser();

  const { control, handleSubmit, formState: { errors }, watch, getValues, trigger } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      courseName: '',
      courseCode: '',
      moduleNames: Array(7).fill(''), 
      uploadedUser: currUser,
    },
  });

  const courseCode = watch('courseCode');
  const courseName = watch('courseName');
  const moduleNames = watch('moduleNames');

  useEffect(() => {

    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const coursesData = querySnapshot.docs.map(doc => doc.data());
        setCourses(coursesData);
      } catch (e) {
        console.error("Error fetching documents: ", e);
      }
    };

    fetchCourses();
  }, []);

  const onSubmit = async (data) => {
    
    setShowPreview(true);
    console.log("Form data:", data);
  };

  const handleFinalSubmit = async () => {
    if (Object.keys(currUser).length > 0) {
      const data = getValues();

      try {
        const docRef = await addDoc(collection(db, "courses"), data);
        console.log("Document written with ID: ", docRef.id);
        alert("Course added successfully!");
      } catch (e) {
        console.error("Error adding document: ", e);
        alert("Error adding course: " + e.message);
      }
      const newPoints = currUser.points + 10;

      const userRef = doc(db, "users", currUser.id);
  
      try {
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
      } catch (e) {
        console.error("Error updating user points in Firestore: ", e);
        alert("Error updating user points: " + e.message);
      }

      setShowPreview(false);
    }

    else{
      alert("Please Login with VIT email ID");
    }

  };

  const closePreview = () => {
    setShowPreview(false);
  }

  const handleMove = () => {
    setMoveCounter((moveCounter + 1) % 9);
  };

  const handleMoveBack = () => {
    setMoveCounter((moveCounter - 1 + 9) % 9);
  };

  return (
    <div className={styles.notes}>
      <div className={styles.add_course}>
        {!showPreview ? (
          <>
          <div className="add_course_text">Earn 10 points by adding a course to the List</div>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.form_input}>
              <div style={{ display: `${moveCounter !== 7 ? "" : "none"}`}} className={styles.navigate_arrow} onClick={handleMoveBack}><FaRegArrowAltCircleLeft /></div>
              <div style={{ display: `${moveCounter === 7 ? "" : "none"}` }} className={styles.form_content}>
                <label htmlFor="courseCode">Course Code</label>
                <Controller
                  name="courseCode"
                  control={control}
                  render={({ field }) => (
                    <input id="courseCode" {...field} />
                  )}
                />
              </div>

              <div style={{ display: `${moveCounter === 8 ? "" : "none"}` }}>
                <label htmlFor="courseName">Course Name</label>
                <Controller
                  name="courseName"
                  control={control}
                  render={({ field }) => (
                    <input id="courseName" {...field} />
                  )}
                />
              </div>

              {[...Array(7)].map((_, index) => (
                <div key={index} style={{ display: `${moveCounter === index ? "" : "none"}` }}>
                  <label htmlFor={`moduleName${index + 1}`}>Module {index + 1} Name</label>
                  <Controller
                    name={`moduleNames.${index}`}
                    control={control}
                    render={({ field }) => (
                      <input id={`moduleName${index + 1}`} {...field} />
                    )}
                  />
                </div>
              ))}
              <div style={{ display: `${moveCounter === 6 ? "none" : ""}`}} className={styles.navigate_arrow}  onClick={handleMove}><FaRegArrowAltCircleRight /></div>
              <button style={{ display: `${moveCounter === 6 ? "" : "none"}` }} type="submit">Submit</button>
            </div>
            {(errors.courseCode || errors.courseName || errors.moduleNames) && <div className={styles.error_message}>Fill all the fields correctly</div>}
          </form>
          </>
        ) : (
          <div className={styles.preview}>
            <div>Preview Your Submission</div>
            <div>Course Code: {getValues().courseCode}</div>
            <div>Course Name: {getValues().courseName}</div>
            {getValues().moduleNames.map((moduleName, index) => (
              <div key={index}>Module {index + 1}: {moduleName}</div>
            ))}
            <div className={styles.preview_buttons}>
              <button onClick={closePreview}>Continue Editing</button>
              <button onClick={handleFinalSubmit}>Confirm</button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.course_list}>
        {courses.length > 0 ? (
            courses.map((course, index) => (
                <CourseCard key={index} course={course}/>
            ))
        ) : (
          <p>Loading Courses</p>
        )}
      </div>
    </div>
  );
}

export default Page;

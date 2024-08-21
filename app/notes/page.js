"use client";
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import styles from "./page.module.css";
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { db } from '@/lib/firebase'; 
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import CourseCard from '../components/CourseCard';

const schema = z.object({
  courseName: z.string().min(5, 'Course Name should be at least 5 characters long'),
  courseCode: z.string().min(5, 'Course Code should be at least 5 characters long'),
  moduleNames: z.array(z.string().min(5, 'Module Name should be at least 5 characters long')).length(7, 'Please provide exactly 7 module names'),
});

function Page() {
  const [moveCounter, setMoveCounter] = useState(7);
  const [showPreview, setShowPreview] = useState(false);
  const [courses, setCourses] = useState([]); // State to store fetched courses
  const { control, handleSubmit, formState: { errors }, getValues, trigger } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      courseName: '',
      courseCode: '',
      moduleNames: Array(7).fill(''), 
    },
  });

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
    const data = getValues();

    try {
      const docRef = await addDoc(collection(db, "courses"), data);
      console.log("Document written with ID: ", docRef.id);
      alert("Course added successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error adding course: " + e.message);
    }
  };

  const handleMove = () => {
    setMoveCounter((moveCounter + 1) % 9);
  };

  const handleMoveBack = () => {
    setMoveCounter((moveCounter - 1 + 9) % 9);
  };

  return (
    <div className={styles.notes}>
      <div className={styles.add_course}>
        <div className="add_course_text">Earn 10 points by adding a course to the List</div>
        {!showPreview ? (
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.form_input}>
              <div style={{ display: `${moveCounter !== 7 ? "" : "none"}` }} onClick={handleMoveBack}><FaRegArrowAltCircleLeft /></div>
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
              <div style={{ display: `${moveCounter === 6 ? "none" : ""}` }} onClick={handleMove}><FaRegArrowAltCircleRight /></div>
              <button style={{ display: `${moveCounter === 6 ? "" : "none"}` }} type="submit">Submit</button>
            </div>
            {(errors.courseCode || errors.courseName || errors.moduleNames) && <div className={styles.error_message}>Fill all the fields correctly</div>}
          </form>
        ) : (
          <div className={styles.preview}>
            <div>Preview Your Submission</div>
            <div><strong>Course Code:</strong> {getValues().courseCode}</div>
            <div><strong>Course Name:</strong> {getValues().courseName}</div>
            <ul>
              {getValues().moduleNames.map((moduleName, index) => (
                <li key={index}><strong>Module {index + 1}:</strong> {moduleName}</li>
              ))}
            </ul>
            <button onClick={handleFinalSubmit}>Confirm & Submit to Firestore</button>
          </div>
        )}
      </div>

      <div className={styles.course_list}>
        {courses.length > 0 ? (
          <ul>
            {courses.map((course, index) => (
                <CourseCard key={index} course={course}/>
            ))}
          </ul>
        ) : (
          <p>Loading Courses</p>
        )}
      </div>
    </div>
  );
}

export default Page;

"use client";
import {useState} from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import styles from "./page.module.css"
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft} from "react-icons/fa";


const schema = z.object({
  courseName: z.string().min(5, 'Course Name should be at least 5 characters long'),
  courseCode: z.string().min(5, 'Course Code should be at least 5 characters long'),
  moduleNames: z.array(z.string().min(5, 'Module Name should be at least 5 characters long')).length(7, 'Please provide exactly 7 module names'),
});

function Page() {
  const [moveCounter, setMoveCounter] = useState(7);
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      courseName: '',
      courseCode: '',
      moduleNames: Array(7).fill(''), // Initialize with empty strings
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission logic here
  };

  const handleMove = () => {
    setMoveCounter((moveCounter + 1) % 9);
  }

  const handleMoveBack = () => {
    setMoveCounter((moveCounter - 1 + 9) % 9);
  }

  return (
    <div className={styles.notes}>
      <div className={styles.add_course}>
        <div className="add_course_text">Earn 10 points by add a course to the List</div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div style={{display:`${moveCounter != 7 ?"":"none"}`}} onClick={handleMoveBack}><FaRegArrowAltCircleLeft /></div>
          <div style={{display:`${moveCounter == 7 ? "" : "none"}`}} className={styles.form_content}>
            <label htmlFor="courseCode">Course Code</label>
            <Controller
              name="courseCode"
              control={control}
              render={({ field }) => (
                <input id="courseCode" {...field} />
              )}
            />
            {/* {errors.courseCode && <p>{errors.courseCode.message}</p>} */}
          </div>

          <div style={{display:`${moveCounter == 8 ? "" : "none"}`}}>
            <label htmlFor="courseName">Course Name</label>
            <Controller
              name="courseName"
              control={control}
              render={({ field }) => (
                <input id="courseName" {...field} />
              )}
            />
            {/* {errors.courseName && <p>{errors.courseName.message}</p>} */}
          </div>

          {[...Array(7)].map((_, index) => (
            <div key={index} style={{display:`${moveCounter == index ? "" : "none"}`}}>
              <label htmlFor={`moduleName${index + 1}`}>Module {index + 1} Name</label>
              <Controller
                name={`moduleNames.${index}`}
                control={control}
                render={({ field }) => (
                  <input id={`moduleName${index + 1}`} {...field} />
                )}
              />
              {/* {errors.moduleNames?.[index] && <p>{errors.moduleNames[index].message}</p>} */}
            </div>
          ))}
          <div style={{display:`${moveCounter==6?"none":""}`}} onClick={handleMove}><FaRegArrowAltCircleRight /></div>
          <button style={{display:`${moveCounter==6?"":"none"}`}} type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Page;

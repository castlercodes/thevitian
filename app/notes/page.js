"use client"
import React from 'react'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

const schema = z.object({
  courseName: z.string().min(5, 'Course Name should be of at least 5 characters'),
  courseCode: z.string().min(5, 'Course Code should be of at least 5 characters'),
  moduleName: z.string().min(5, 'Module Name should be of at least 5 characters'),
});

function page() {

  const { control, handleSubmit, formState: { errors }, register, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      courseName: '',
      courseCode: '',
      content: '',
      photo: null,
    },
  });

  const onSubmit = () => {

  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="courseCode">Course Code*</label>
          <Controller
            name="courseCode"
            control={control}
            render={({ field }) => (
              <input id="courseCode" {...field} />
            )}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="courseName">Course Name*</label>
          <Controller
            name="courseName"
            control={control}
            render={({ field }) => (
              <input id="courseName" {...field} />
            )}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="moduleName1">Module 1 Name*</label>
          <Controller
            name="moduleName1"
            control={control}
            render={({ field }) => (
              <input id="moduleName1" {...field} />
            )}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="moduleName2">Module 2 Name*</label>
          <Controller
            name="moduleName2"
            control={control}
            render={({ field }) => (
              <input id="moduleName2" {...field} />
            )}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="moduleName3">Module 3 Name*</label>
          <Controller
            name="moduleName3"
            control={control}
            render={({ field }) => (
              <input id="moduleName3" {...field} />
            )}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="moduleName4">Module 4 Name*</label>
          <Controller
            name="moduleName4"
            control={control}
            render={({ field }) => (
              <input id="moduleName4" {...field} />
            )}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="moduleName5">Module 5 Name*</label>
          <Controller
            name="moduleName5"
            control={control}
            render={({ field }) => (
              <input id="moduleName5" {...field} />
            )}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="moduleName6">Module 6 Name*</label>
          <Controller
            name="moduleName6"
            control={control}
            render={({ field }) => (
              <input id="moduleName6" {...field} />
            )}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="moduleName7">Module 7 Name*</label>
          <Controller
            name="moduleName7"
            control={control}
            render={({ field }) => (
              <input id="moduleName7" {...field} />
            )}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </div>

        <button type="submit" >
          Submit
        </button>
      </form>
    </div>
  )
}

export default page

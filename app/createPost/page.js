"use client";
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TipTap from '../components/TipTap';
import styles from './page.module.css';

const schema = z.object({
  title: z.string().min(3, 'Title should be of atleast three characters'),
  description: z.string().min(0, 'Description is required'),
  content: z.string().min(20, 'Content should be of atleast 20 characters'),
  photo: z.any().optional(),
});

const BlogForm = () => {
  const [photo, setPhoto] = useState(null); // State to handle photo preview
  const { control, handleSubmit, formState: { errors }, register, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      photo: null,
    },
  });

  const onSubmit = data => {
    console.log(data);
  };

  const photoInput = watch('photo');

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file)); // Create a URL for the file
    }
  };

  return (
    <div className={styles["blog-page"]}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles['blog-form']}>
        <div className={styles['form-group']}>
          <label htmlFor="title">Title*</label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input id="title" {...field} className={styles['form-control']} />
            )}
          />
          {errors.title && <p className={styles['error-text']}>{errors.title.message}</p>}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="description">Short Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <input id="description" {...field} rows="4" className={styles['form-control']} />
            )}
          />
          {errors.description && <p className={styles['error-text']}>{errors.description.message}</p>}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="content">Content*</label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TipTap content={field.value} onUpdate={field.onChange} />
            )}
          />
          {errors.content && <p className={styles['error-text']}>{errors.content.message}</p>}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="photo">Upload Photo</label>
          <input
            id="photo"
            type="file"
            {...register('photo')}
            onChange={handlePhotoChange}
            className={styles['file-input']}
          />
          {photo && (
            <div className={styles['image-preview']}>
              <img src={photo} alt="Preview" />
            </div>
          )}
        </div>

        <button type="submit" className={styles['button']}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default BlogForm;

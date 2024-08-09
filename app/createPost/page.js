"use client";
import React, { useState, useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TipTap from '../components/TipTap';
import styles from './page.module.css';
import { db, storage } from '@/lib/firebase';  // Import your firebase config
import { collection, addDoc, query, getDocs, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from 'next/navigation';

const schema = z.object({
  title: z.string().min(3, 'Title should be of at least three characters'),
  description: z.string().min(0, 'Description is required'),
  content: z.string().min(20, 'Content should be of at least 20 characters'),
  photo: z.any().optional(),
});

const BlogForm = () => {
  const [photo, setPhoto] = useState(null);
  const [user, setUser] = useState("");
  const router = useRouter();
  const { control, handleSubmit, formState: { errors }, register, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      photo: null,
    },
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } 
    else{
      alert("Please Login Using Vit email id");
      router.push("/");
    }
  }, []);

  const onSubmit = async (data) => {
    let photoUrl = null;

    if (data.photo && data.photo[0]) {
      const photoFile = data.photo[0];
      const storageRef = ref(storage, `photos/${photoFile.name}`);
      const snapshot = await uploadBytes(storageRef, photoFile);
      photoUrl = await getDownloadURL(snapshot.ref);
    }

    try {
      const formattedTitle = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') .replace(/^-+|-+$/g, ''); 
      const q = query(collection(db, "posts"), where("formattedTitle", "==", formattedTitle));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert("Adding Post failed, a post with that title already exists");
      } else {
        const docRef = await addDoc(collection(db, "posts"), {
          uploader: user.displayName,
          uploader_email: user.email,
          title: data.title,
          formattedTitle: formattedTitle,
          description: data.description,
          content: data.content,
          photoUrl: photoUrl,  // Store the uploaded photo URL
          createdAt: new Date(),
          likes: 0,
          dislikes: 0,
          comments: [],
        });
        console.log("Document written with ID: ", docRef.id);
      }

    } catch (error) {
      alert("Error Adding Document")
      console.error("Error adding document: ", error);
    }
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

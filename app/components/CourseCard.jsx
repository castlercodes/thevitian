"use client"
import "./style/CourseCard.css";
import { useRouter } from "next/navigation";

function CourseCard({course}) {

    const router = useRouter();
    const handleClick = () => {
        localStorage.setItem('moduleNames', JSON.stringify(course.moduleNames));
        router.push(`/notes/${course.courseCode}`);
    }

  return (
    <div className="course_card" onClick={handleClick}>
      <div>{course.courseCode}</div>
      <div>{course.courseName}</div>
    </div>
  )
}

export default CourseCard

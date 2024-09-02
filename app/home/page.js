// No "use client" here, so it's a Server Component
import LanguageSwitcher from '../components/LanguageSwitcher';
import styles from './page.module.css';

export async function generateMetadata() {
  return {
    title: 'VITIAN - Your Hub for All Things VIT',
    description: 'VITIAN is the go-to platform for VIT students to share and access notes, interview experiences, and more. Join the community and earn points for contributing valuable content.',
    keywords: 'VITIAN, VIT, student notes, interview experiences, VIT Chennai, VIT Bhopal, VIT Amravati, student community',
    openGraph: {
      title: 'VITIAN - Your Hub for All Things VIT',
      description: 'VITIAN connects VIT students across campuses, allowing them to share notes and experiences while earning points that can be used to access other resources.',
    },
  };
}

function Page() {
  return (
    <div className={styles.pageContainer}>
      <LanguageSwitcher /> {/* This is the Client Component */}
      <div className={styles.description}>
        VITIAN is the premier platform where VIT students can share their interview experiences, daily life insights, and more. 
        Whether you're at VIT Vellore, Chennai, Bhopal, or Amravati, this is your space to connect with fellow students.
      </div>
      <div className={styles.imageContainer}>
        <img src="/images/groupPhoto.jpg" className={styles.image} alt="Group of students" />
      </div>
      <div className={styles.description}>
        Share your notes and access valuable resources from peers. 
        To incentivize note-sharing, we offer a unique points system. Earn points by uploading notes and use them to unlock content from others. Our goal is to create a comprehensive hub for everything related to VIT and transform our points system into a form of cryptocurrency for the VIT community.
      </div>
      <div className={styles.description}>
        Join us in building a vibrant community and make the most of your VIT experience!
      </div>
    </div>
  );
}

export default Page;

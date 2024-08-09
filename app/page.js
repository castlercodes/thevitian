import Image from "next/image";
import styles from "./page.module.css";
import Feed from "./components/Feed";
import CreatePostButton from "./components/CreatePostButton";

export default function Home() {
  return (
    <main className={styles.main}>
      <CreatePostButton />
      <div className={styles.main_home_section}>
        <div className={styles.feed}><Feed /></div>
        <div className={styles.profile}></div>
      </div>
    </main>
  );
}

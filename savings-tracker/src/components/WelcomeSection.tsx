import styles from "./WelcomeSection.module.css";

export default function WelcomeSection() {
  return (
    <div className={styles.welcomeSection}>
      <div className={styles.welcomeHeader}>
        <h1>Welcome to Savings Tracker</h1>
        <p className={styles.welcomeSubtitle}>
          Your personal AI-powered assistant to help you save money effectively
        </p>
      </div>
      <div className={styles.quickStartSection}>
        <div className={styles.guideHeader}>
          <i className="fas fa-rocket"></i>
          <h3>Quick Start Guide</h3>
          <p className={styles.guideSubtitle}>
            Three simple steps to start saving
          </p>
        </div>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <i className="fas fa-comments-dollar"></i>
            </div>
            <div className={styles.stepContent}>
              <h4>Tell Me Your Goal</h4>
              <p>
                Type or say something like "I want to save $1000 in 50 days" -
                I'll create your daily saving plan instantly!
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className={styles.stepContent}>
              <h4>Save Daily</h4>
              <p>
                Your grid will show how much to save each day. Just click a box
                to mark it as saved - it's that easy!
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <i className="fas fa-chart-line"></i>
            </div>
            <div className={styles.stepContent}>
              <h4>Watch Your Progress</h4>
              <p>
                See your savings grow in real-time with the progress bar.
                Customize colors to make it your own!
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <i className="fas fa-file-download"></i>
            </div>
            <div className={styles.stepContent}>
              <h4>Download Your Plan</h4>
              <p>
                Get a beautifully formatted PDF of your savings plan to track
                offline or share with others!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

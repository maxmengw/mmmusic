import HomeButton from '../common/nav/HomeButton';

export default function About() {
  return (
    <div className="about-page">
      <HomeButton />
      
      <div className="about-container">
        <h1 className="page-title">About MM Music</h1>
        <p className="about-intro">
          Discover Music Across Cultures • 让音乐连接世界 • 문화와 음악이 만나는 곳
        </p>

        <div className="about-content">
          <section className="about-section">
            <h2 className="section-title">What is MM Music?</h2>
            <p className="section-text">
              MM Music is a user-friendly music memo and playlist manager. It helps you quickly save and organize
              the songs you love. Paste a YouTube URL or video ID to attach a playable link and collect it into your
              personal playlist—simple, lightweight, and made for everyday use.
            </p>
          </section>

          <section className="about-section">
            <h2 className="section-title">What We Offer</h2>
            <div className="features-list">
              <div className="feature-item">
                <h3>Quick Manual Save</h3>
                <p>Paste a YouTube URL or video ID to save any song you like into your playlist in seconds.</p>
              </div>
              <div className="feature-item">
                <h3>Browse Music Categories</h3>
                <p>Explore curated music categories and add songs you like directly to your own list.</p>
              </div>
              <div className="feature-item">
                <h3>Open on YouTube</h3>
                <p>Preview songs on YouTube with one tap, then bring the link back and save it to your memo.</p>
              </div>
              <div className="feature-item">
                <h3>Your Personal Playlist</h3>
                <p>Collect your favorites in one place. We merge your picks with a few starter examples for easy playback.</p>
              </div>
              <div className="feature-item">
                <h3>Music Discovery</h3>
                <p>Browse diverse music selections and find new inspirations with an easy-to-use interface.</p>
              </div>
              <div className="feature-item">
                <h3>Lightweight Search</h3>
                <p>Find categories or examples quickly, then add your own link to turn it into your personal memo.</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2 className="section-title">Our Purpose</h2>
            <div className="purpose-list">
              <div className="purpose-item">
                <h4>Personal Music Memo</h4>
                <p>Help you remember, revisit, and organize songs you love—across cultures—without complexity.</p>
              </div>
              <div className="purpose-item">
                <h4>Easy Music Management</h4>
                <p>Make it effortless to collect, organize, and play your favorite music in one place.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
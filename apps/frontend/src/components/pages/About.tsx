import HomeButton from '../common/nav/HomeButton';

export default function About() {
  return (
    <div className="about-page">
      <HomeButton />
      
      <div className="about-container">
        <h1 className="page-title">About MMS Music</h1>
        <p className="about-intro">
          让音乐连接世界 • Iba't ibang Kultura, Isang Musika • 음악으로 문화를 연결하다
        </p>

        <div className="about-content">
          <section className="about-section">
            <h2 className="section-title">What is MMS Music?</h2>
            <p className="section-text">
              MMS Music is a user-friendly, cross‑cultural music memo. It helps you quickly save and organize the
              songs you love across Chinese, Korean, and Filipino music. Paste a YouTube URL or video ID to attach
              a playable link and collect it into your personal playlist—simple, lightweight, and made for everyday use.
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
                <h3>Add From Culture Pages</h3>
                <p>Add songs you like directly from the Chinese, Korean, or Filipino pages into your own list.</p>
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
                <h3>Cross‑culture Explorer</h3>
                <p>Browse sample categories across Chinese, Korean, and Filipino music to find new inspirations.</p>
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
                <h4>Cross‑cultural Listening</h4>
                <p>Make it effortless to collect and play music from Chinese, Korean, and Filipino traditions in one place.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
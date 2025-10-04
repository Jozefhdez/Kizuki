import "../styles/Landing.css";
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* Header */}
        <header className="landing-header">
          <div className="logo-container">
            <img src="/kizuki.svg" alt="Kizuki" className="logo" />
            <span className="logo-text">Kizuki</span>
          </div>
          <nav className="nav">
            <a href="#features" className="nav-link">Features</a>
            <button className="btn btn-outline" onClick={goToLogin}>Sign In</button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Write, plan, organize.
              <br />
              <span className="hero-subtitle">All in one place.</span>
            </h1>
            <p className="hero-description">
              Kizuki is your all-in-one workspace where you can write, plan, and organize your thoughts. 
              Create documents, manage projects, and collaborate with your team seamlessly.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={goToLogin}>Get Started</button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3h18v18H3V3z" stroke="#000000" strokeWidth="2" fill="none"/>
                  <path d="M7 7h10M7 11h10M7 15h7" stroke="#000000" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="feature-title">Rich Text Editor</h3>
              <p className="feature-description">
                Write with a powerful editor that supports formatting, blocks, and multimedia content.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" stroke="#000000" strokeWidth="2" fill="none"/>
                  <path d="M7 13h10M7 16h7" stroke="#000000" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="feature-title">Organize Everything</h3>
              <p className="feature-description">
                Keep your notes, documents, and projects organized with flexible hierarchies.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="#000000" strokeWidth="2"/>
                  <circle cx="9" cy="7" r="4" stroke="#000000" strokeWidth="2" fill="none"/>
                  <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#000000" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="feature-title">Team Collaboration</h3>
              <p className="feature-description">
                Share pages and keep everyone on the same page.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-logo">
              <img src="/kizuki.svg" alt="Kizuki" className="logo" />
              <span className="logo-text">Kizuki</span>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-text">Jozef Hernández</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Landing;
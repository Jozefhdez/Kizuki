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
            <img src="/src/assets/kizuki.svg" alt="Kizuki" className="logo" />
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
          <div className="hero-visual">
            <div className="demo-window">
              <div className="demo-header">
                <div className="demo-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
              <div className="demo-content">
                <div className="demo-line long"></div>
                <div className="demo-line medium"></div>
                <div className="demo-line short"></div>
                <div className="demo-line medium"></div>
                <div className="demo-line long"></div>
                <div className="demo-line short"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3 className="feature-title">Rich Text Editor</h3>
              <p className="feature-description">
                Write with a powerful editor that supports formatting, blocks, and multimedia content.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗂️</div>
              <h3 className="feature-title">Organize Everything</h3>
              <p className="feature-description">
                Keep your notes, documents, and projects organized with flexible hierarchies.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
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
              <img src="/src/assets/kizuki.svg" alt="Kizuki" className="logo" />
              <span className="logo-text">Kizuki</span>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-text">© 2025 Jozef Hernández. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Landing;
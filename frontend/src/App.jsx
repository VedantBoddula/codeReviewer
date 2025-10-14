import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // ✅ eye icons
import './App.css';

// ---------------- Navbar ----------------
function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // redirect to login page
  };

  return (
    <nav className="navbar">
      <h2>Code Reviewer</h2>
      <button className="logoutBtn" onClick={handleLogout}>Logout</button>
    </nav>
  );
}

// ---------------- Password Input Component ----------------
function PasswordInput({ password, setPassword }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ paddingRight: "2.5rem" }}
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: "0.5rem",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer"
        }}
      >
        
        {showPassword ?  <FaEye/> : <FaEyeSlash />}
      </span>
    </div>
  );
}

// ---------------- Login Page ----------------
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/user/login", { email, password });
      setMessage(res.data.message);
      if (res.data.message === "Login successful") {
        navigate('/reviewer');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <PasswordInput password={password} setPassword={setPassword} />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
}

// ---------------- Signup Page ----------------
function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/user/signup", { email, password });
      setMessage(res.data.message);
      navigate('/reviewer'); // go to code reviewer page after signup
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <PasswordInput password={password} setPassword={setPassword} />
        <button type="submit">Sign Up</button>
      </form>
      <p>{message}</p>
      <p>Already have an account? <Link to="/">Login</Link></p>
    </div>
  );
}

// ---------------- Code Reviewer ----------------
function CodeReviewer() {
  const [code, setCode] = useState(`//Write your code here`);
  const [review, setReview] = useState(``);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  async function reviewCode() {
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      setReview(response.data);
    } catch (err) {
      setReview("Error reviewing code");
    }
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => Prism.highlight(code, Prism.languages.js, 'js')}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 15,
                border: "1px solid black",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <div onClick={reviewCode} className="reviewBtn">Click Here for Review</div>
        </div>
        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        </div>
      </main>
    </>
  );
}

// ---------------- Main App ----------------
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reviewer" element={<CodeReviewer />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.min.css";
import { FaEye, FaEyeSlash, FaImage } from "react-icons/fa";
import './App.css';

// ---------------- Navbar ----------------
function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <nav className="navbar">
      <h2>Code Reviewer</h2>
      <button className="logoutBtn" onClick={handleLogout}>Logout</button>
    </nav>
  );
}

// ---------------- Password Input ----------------
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
        {showPassword ? <FaEye /> : <FaEyeSlash />}
      </span>
    </div>
  );
}

// ---------------- Login ----------------
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

// ---------------- Signup ----------------
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
      navigate('/reviewer');
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
  const [code, setCode] = useState(`// Write your code here`);
  const [review, setReview] = useState(``);

  const [images, setImages] = useState([]);  
  const [previews, setPreviews] = useState([]); 

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  // Handle selecting multiple images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 3) {
      alert("You can upload up to 3 images only.");
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));

    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  // Remove individual image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Send code + all images
  async function reviewCode() {
    try {
      const formData = new FormData();
      formData.append("code", code);

      images.forEach((img) => formData.append("images", img));

      const response = await axios.post(
        'http://localhost:3000/ai/get-review',
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

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

          {/* Button row */}
          <div className="button-row">
            <div onClick={reviewCode} className="reviewBtn">Click here for Review</div>

            <label htmlFor="imageUpload" className="upload-icon">
              <FaImage />
            </label>

            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          {/* Multiple Preview + X Buttons */}
          {previews.length > 0 && (
            <div className="multi-preview-container">
              {previews.map((src, index) => (
                <div key={index} className="image-preview-container">
                  <span
                    className="remove-image-btn"
                    onClick={() => removeImage(index)}
                  >
                    ✖
                  </span>
                  <img src={src} alt="Preview" className="image-preview" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        </div>
      </main>
    </>
  );
}

// ---------------- App ----------------
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

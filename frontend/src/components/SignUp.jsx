// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import bcrypt from 'bcryptjs';
// import './App.css';

// export default function Signup() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSignup = (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       alert('Enter email and password');
//       return;
//     }

//     const users = JSON.parse(localStorage.getItem('users') || '{}');
//     if (users[email]) {
//       alert('User already exists. Please login.');
//       return;
//     }

//     // Hash the password
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(password, salt);

//     users[email] = hashedPassword; // save hashed password
//     localStorage.setItem('users', JSON.stringify(users));

//     alert('Signup successful! Please login.');
//     navigate('/');
//   }

//   return (
//     <div className="auth-container">
//       <h2>Sign Up</h2>
//       <form onSubmit={handleSignup}>
//         <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//         <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
//         <button type="submit">Sign Up</button>
//       </form>
//       <p>Already have an account? <Link to="/">Login</Link></p>
//     </div>
//   )
// }

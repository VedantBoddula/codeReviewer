// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import bcrypt from 'bcryptjs';
// import './App.css';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     const users = JSON.parse(localStorage.getItem('users') || '{}');

//     if (users[email] && bcrypt.compareSync(password, users[email])) {
//       navigate('/reviewer'); // password correct
//     } else {
//       alert('Incorrect email or password');
//     }
//   }

//   return (
//     <div className="auth-container">
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//         <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
//         <button type="submit">Login</button>
//       </form>
//       <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
//     </div>
//   )
// }

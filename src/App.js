// import React from 'react';
// import BookingPage from './components/BookingPage';

// function App() {
//   return (
//     <div className="App bg-gray-100 min-h-screen">
//       <header className="bg-blue-600 text-white p-4">
//         <h1 className="text-2xl font-bold">Sports Booking System</h1>
//       </header>
//       <main className="container mx-auto px-4 py-8">
//         <BookingPage />
//       </main>
//     </div>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookingPage from './components/BookingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function App() {
  return (
    <Router>
      <div className="App bg-gray-100 min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<BookingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
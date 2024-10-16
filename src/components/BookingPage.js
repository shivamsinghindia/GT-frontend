import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function BookingPage() {
  const [centers, setCenters] = useState([]);
  const [sports, setSports] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedDate, setSelectedDate] = useState("");
  const [availableCourts, setAvailableCourts] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [newBooking, setNewBooking] = useState({ court: '', startTime: '', endTime: '' });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


//   useEffect(() => {
//     fetchCenters();
//   }, []);

useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      const decoded = jwtDecode(token);
      setUser(decoded.user); // Set user from token
    }
    fetchCenters();
  }, [navigate]);

  const fetchCenters = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/centers');
      setCenters(response.data);
    } catch (error) {
      console.error('Error fetching centers:', error);
    }
  };

  const fetchSports = async (centerId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/sports?center=${centerId}`);
      setSports(response.data);
      setSelectedSport(''); // Reset selected sport when center changes
      setAvailableCourts([]); // Reset available courts
      setAvailableSlots([]); // Reset available slots
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/bookings?center=${selectedCenter}&sport=${selectedSport}&date=${selectedDate}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchAvailableCourts = async (sportId) => {
    if (sportId) {
      try {
        const sport = sports.find(s => s._id === sportId);
        if (sport) {
          setAvailableCourts(sport.courts); // Assuming courts are stored in the sport object
          setNewBooking({ ...newBooking, court: sport.courts[0] }); // Set default court to the first available
          fetchAvailableSlots(sport.courts[0]); // Fetch available slots for the first court
        }
      } catch (error) {
        console.error('Error fetching available courts:', error);
      }
    }
  };

  const fetchAvailableSlots = async (court) => {
    console.log({selectedCenter,selectedSport,selectedDate})
    if (selectedCenter && selectedSport && selectedDate) {
      try {
        const response = await axios.get(`http://localhost:8000/api/bookings/available-slots`, {
          params: {
            center: selectedCenter,
            sport: selectedSport,
            court: court,
            date: selectedDate,
          },
        });
        setAvailableSlots(response.data);
      } catch (error) {
        console.error('Error fetching available slots:', error);
      }
    }
  };

  const handleCenterChange = (e) => {
    const centerId = e.target.value;
    setSelectedCenter(centerId);
    console.log(centerId);

    fetchSports(centerId);
    setAvailableCourts([]); // Reset available courts when center changes
    setAvailableSlots([]);
    
     // Reset available slots
  };
  

  const handleSportChange = (e) => {
    const sportId = e.target.value;
    setSelectedSport(sportId);
    console.log(selectedSport);
    fetchAvailableCourts(sportId); // Fetch available courts when sport changes
    fetchAvailableSlots(newBooking.court); // Fetch available slots for the selected court
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    fetchAvailableSlots(newBooking.court); // Fetch available slots when date changes
  };

  const handleNewBookingChange = (e) => {
    const { name, value } = e.target;
    
    let endTime = `${value.split(':')[0]}:59`
    
    setNewBooking({ ...newBooking, [name]: value, endTime });
    if (name === 'court') {
      fetchAvailableSlots(value); // Fetch available slots when court changes
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/bookings', {
        center: selectedCenter,
        sport: selectedSport,
        court: newBooking.court,
        date: selectedDate,
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
      });
      fetchBookings();
      setNewBooking({ court: '', startTime: '', endTime: '' });
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

//   return (
//     <div className="space-y-6">
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4">Select Booking Details</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <select value={selectedCenter} onChange={handleCenterChange} className="border p-2 rounded">
//             <option value="">Select Center</option>
//             {centers.map(center => (
//               <option key={center._id} value={center._id}>{center.name}</option>
//             ))}
//           </select>
//           <select value={selectedSport} onChange={handleSportChange} className="border p-2 rounded">
//             <option value="">Select Sport</option>
//             {sports.map(sport => (
//               <option key={sport._id} value={sport._id}>{sport.name}</option>
//             ))}
//           </select>
//           <input type="date" value={selectedDate} onChange={handleDateChange} className="border p-2 rounded" />
//         </div>
//         <button onClick={fetchBookings} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//           View Bookings
//         </button>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4">Current Bookings</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {bookings.map(booking => (
//             <div key={booking._id} className="border p-4 rounded">
//               <p><strong>Court:</strong> {booking.court}</p>
//               <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4">Create New Booking</h2>
//         <form onSubmit={handleCreateBooking} className="space-y-4">
//           <select
//             name="court"
//             value={newBooking.court}
//             onChange={handleNewBookingChange}
//             className="border p-2 rounded w-full"
//             required
//           >
//             <option value="">Select Court</option>
//             {availableCourts.map((court, index) => (
//               <option key={index} value={court}>{court}</option>
//             ))}
//           </select>
//           <select
//             name="startTime"
//             value={newBooking.startTime}
//             onChange={handleNewBookingChange}
//             className="border p-2 rounded w-full"
//             required
//           >
//             <option value="">Select Start Time</option>
//             {availableSlots.map((slot, index) => (
//               <option key={index} value={slot.startTime}>{slot.startTime}</option>
//             ))}
//           </select>
//           {/* <select
//             name="endTime"
//             value={newBooking.endTime}
//             onChange={handleNewBookingChange}
//             className="border p-2 rounded w-full"
//             required
//           >
//             <option value="">Select End Time</option>
//             {availableSlots.map((slot, index) => (
//               <option key={index} value={slot.endTime}>{slot.endTime}</option>
//             ))}
//           </select> */}
//           <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//             Create Booking
//           </button>
//         </form>
//       </div>
//     </div>
//   );

return (
    <div className="flex flex-col md:flex-row items-start space-y-8 md:space-y-0 md:space-x-8 p-6 bg-gradient-to-r from-purple-200 to-orange-200 min-h-screen">
      {/* Left Column: Booking Details and Create New Booking */}
      <div className="flex flex-col space-y-8 w-full md:w-1/2">
        {/* Booking Details Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Select Booking Details</h2>
          <div className="grid grid-cols-1 gap-4">
            <select value={selectedCenter} onChange={handleCenterChange} className="border p-3 rounded-lg transition duration-200 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="">Select Center</option>
              {centers.map(center => (
                <option key={center._id} value={center._id}>{center.name}</option>
              ))}
            </select>
            <select value={selectedSport} onChange={handleSportChange} className="border p-3 rounded-lg transition duration-200 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="">Select Sport</option>
              {sports.map(sport => (
                <option key={sport._id} value={sport._id}>{sport.name}</option>
              ))}
            </select>
            <input type="date" value={selectedDate} onChange={handleDateChange} className="border p-3 rounded-lg transition duration-200 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <button onClick={fetchBookings} className="mt-6 bg-teal-600 text-white px-6 py-3 rounded-lg transition duration-300 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
            View Bookings
          </button>
        </div>
  
        {/* Create New Booking Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Create New Booking</h2>
          <form onSubmit={handleCreateBooking} className="space-y-4">
            <select
              name="court"
              value={newBooking.court}
              onChange={handleNewBookingChange}
              className="border p-3 rounded-lg w-full transition duration-200 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select Court</option>
              {availableCourts.map((court, index) => (
                <option key={index} value={court}>{court}</option>
              ))}
            </select>
            <select
              name="startTime"
              value={newBooking.startTime}
              onChange={handleNewBookingChange}
              className="border p-3 rounded-lg w-full transition duration-200 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select Start Time</option>
              {availableSlots.map((slot, index) => (
                <option key={index} value={slot.startTime}>{slot.startTime}</option>
              ))}
            </select>
            {/* Uncomment if you want to add end time selection */}
            {/* <select
              name="endTime"
              value={newBooking.endTime}
              onChange={handleNewBookingChange}
              className="border p-3 rounded-lg w-full transition duration-200 hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select End Time</option>
              {availableSlots.map((slot, index) => (
                <option key={index} value={slot.endTime}>{slot.endTime}</option>
              ))}
            </select> */}
            <button type="submit" className="bg-teal-600 text-white px-6 py-3 rounded-lg transition duration-300 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
              Create Booking
            </button>
          </form>
        </div>
      </div>
  
      {/* Right Column: Current Bookings */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-1/2 transition-shadow duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Current Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-gradient-to-r from-coral-50 to-coral-100 border border-gray-200 p-4 rounded-lg shadow transition-shadow duration-300 hover:shadow-md">
              <p className="text-lg font-semibold text-slate-700">{booking.court}</p>
              <p className="text-gray-600">{booking.startTime} - {booking.endTime}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}

export default BookingPage;

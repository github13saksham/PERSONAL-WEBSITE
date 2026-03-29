import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockIcon, UnlockIcon, XIcon } from 'lucide-react';

const AdminLogin = () => {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
        setShowModal(false);
        setPassword('');
        setError('');
        window.location.reload(); // Refresh to show edit buttons
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    window.location.reload(); // Refresh to hide edit buttons
  };

  return (
    <>
      <button 
        onClick={() => isLoggedIn ? handleLogout() : setShowModal(true)}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all z-50 backdrop-blur-md"
        title={isLoggedIn ? "Logout Admin" : "Admin Login"}
      >
        {isLoggedIn ? <UnlockIcon size={20} className="text-primary-main" /> : <LockIcon size={20} />}
      </button>

      <AnimatePresence>
        {showModal && !isLoggedIn && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-sm relative"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
                <XIcon size={24} />
              </button>
              <h3 className="text-2xl font-bold text-white mb-6">Admin Login</h3>
              
              <div className="space-y-4">
                <div>
                  <input 
                    type="password" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" 
                    placeholder="Enter admin password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  />
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
                <button 
                  onClick={handleLogin} 
                  className="w-full py-3 bg-primary-main hover:bg-primary-dark text-white font-bold rounded-xl transition-colors mt-2"
                >
                  Login
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminLogin;

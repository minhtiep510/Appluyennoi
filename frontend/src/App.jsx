import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/status');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setApiData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testApi();
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center' }}>
      <h1>React + Vite + Express.js</h1>
      <p>Khung dự án Fullstack cơ bản sẵn sàng phát triển.</p>

      <div style={{ margin: '1.5rem 0' }}>
        <button onClick={() => setCount((c) => c + 1)}>
          Count: {count}
        </button>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
        <h3>Kết nối Backend (Express.js):</h3>
        {loading && <p>Đang tải dữ liệu từ API...</p>}
        {error && (
          <p style={{ color: 'red' }}>
            Lỗi kết nối Backend: {error} (Hãy chắc chắn backend đang chạy tại port 5000)
          </p>
        )}
        {apiData && (
          <div style={{ background: '#f5f5f5', color: '#333', padding: '10px', borderRadius: '4px' }}>
            <pre style={{ margin: 0 }}>{JSON.stringify(apiData, null, 2)}</pre>
          </div>
        )}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button onClick={testApi}>Gọi lại API</button>
        </div>
      </div>
    </div>
  );
}

export default App;

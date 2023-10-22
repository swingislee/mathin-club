'use client'
import { useState, useEffect } from 'react';

export default function AddPoint(lng) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [main_line, setMainLine] = useState('');
  const [upstreamPoint, setUpstreamPoint] = useState(''); // 上游知识点的状态
  const [allPoints, setAllPoints] = useState([]); // 所有的知识点列表
  const [upstreamPoints, setUpstreamPoints] = useState([{ id: '', weight: 1 }]);

  useEffect(() => {
    const fetchAllPoints = async () => {
      const response = await fetch('terms/points');
      const data = await response.json();
      setAllPoints(data);
    }
    
    fetchAllPoints();
  }, []);

  const handleAddUpstreamPoint = () => {
    setUpstreamPoints([...upstreamPoints, { id: '', weight: 1 }]);
  };

  const handleUpstreamPointChange = (index, key, value) => {
    const updatedPoints = [...upstreamPoints];
    updatedPoints[index][key] = value;
    setUpstreamPoints(updatedPoints);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`terms/points/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, main_line }),
    });
    const data = await response.json();
    if (data.id) {
      for (let point of upstreamPoints) {
        if (point.id) {
          await fetch('terms/links/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              upstream_id: point.id, 
              downstream_id: data.id,
              weight: point.weight
            }),
          });
        }
      }
      alert('Knowledge point added successfully!');

      // 重置所有输入状态的值
      setTitle('');
      setDescription('');
      setMainLine('');
      setUpstreamPoints([{ id: '', weight: 1 }]);
  
      // 重新获取所有的知识点
      const fetchAllPoints = async () => {
        const response = await fetch('terms/points');
        const data = await response.json();
        setAllPoints(data);
      }
      fetchAllPoints();
    }
  };

  return (
    <div>
      <h1>Add Point</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Description:</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Main Line:</label>
          <input value={main_line} onChange={(e) => setMainLine(e.target.value)} />
        </div>
        {upstreamPoints.map((point, index) => (
          <div key={index}>
            <label>Upstream Point:</label>
            <select 
              value={point.id} 
              onChange={(e) => handleUpstreamPointChange(index, 'id', e.target.value)}>
              <option value=''>Select an upstream knowledge point</option>
              {allPoints.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
            <label>Weight:</label>
            <input 
              type="number" 
              value={point.weight} 
              onChange={(e) => handleUpstreamPointChange(index, 'weight', Number(e.target.value))} 
              min="1"
            />
          </div>
        ))}
        <button type="button" onClick={handleAddUpstreamPoint}>+ Add Another Upstream Point</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

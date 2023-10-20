'use client'
import { useState } from 'react';

export default function AddPoint(lng) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [main_line, setMainLine] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`points/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, main_line }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

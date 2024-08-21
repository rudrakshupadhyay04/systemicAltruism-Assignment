import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [content, setContent] = useState([]);
  const [user, setUser] = useState({});
  const [chatMessage, setChatMessage] = useState('');
  const [watermarkedVideoUrl, setWatermarkedVideoUrl] = useState('');
  const [gifUrl, setGifUrl] = useState('');

  useEffect(() => {
    axios.get('/content')
      .then((response) => {
        setContent(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error(error);
        setContent([]); 
      });

    axios.get('/user')
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleChatMessage = (message) => {
    axios.post('/youtube-chat', { message })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleWatermark = (videoUrl) => {
    axios.post('/watermark', { videoUrl })
      .then((response) => {
        setWatermarkedVideoUrl(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleGif = (mediaUrl) => {
    axios.post('/harjo', { mediaUrl })
      .then((response) => {
        setGifUrl(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
      <h1 className="text-3xl font-bold mb-4">Interdimensional Comedy</h1>
      <ul className="list-none mb-4">
        {content.map((item) => (
          <li key={item._id} className="mb-4">
            <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
            <p className="text-lg mb-2">{item.lyrics}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleWatermark(item.videoUrl)}
            >
              Watermark
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleGif(item.mediaUrl)}
            >
              Gif
            </button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
        placeholder="Type a message"
        className="w-full p-2 pl-10 text-sm text-gray-700"
      />
      <button
        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleChatMessage(chatMessage)}
      >
        Send
      </button>
      <p className="text-lg mb-2">Watermarked Video URL: {watermarkedVideoUrl}</p>
      <p className="text-lg mb-2">Gif URL: {gifUrl}</p>
    </div>
  );
}

export default App;
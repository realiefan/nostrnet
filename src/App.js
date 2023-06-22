import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const initialEmbedsData = localStorage.getItem('embedsData');
  const embedsData = initialEmbedsData
    ? JSON.parse(initialEmbedsData)
    : [
        { id: 'zaplife-embed', url: 'https://zaplife.lol/', title: 'Zaplife', active: false },
        { id: 'nostrnests-embed', url: 'https://nostrnests.com', title: 'Nostr Nests', active: false },
        {
          id: 'nostrchat-embed',
          url: 'https://www.nostrchat.io/channel/cdc0e8a2dc577b19fe1d59214c1ad41ebe37a8589d5c66c743c1e904aed4ed35',
          title: 'Nostr Chat',
          active: false,
        },
      ];

  const [embeds, setEmbeds] = useState(embedsData);
  const [customEmbeds, setCustomEmbeds] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const toggleEmbed = (embedId) => {
    setEmbeds((prevEmbeds) => {
      return prevEmbeds.map((embed) => {
        if (embed.id === embedId) {
          return { ...embed, active: true };
        } else {
          return { ...embed, active: false };
        }
      });
    });
    setButtonClicked(true);
  };

  const addCustomEmbed = (url, title) => {
    const newEmbed = {
      id: `custom-${Date.now()}`,
      url,
      title,
      active: false,
    };

    setEmbeds((prevEmbeds) => [...prevEmbeds, newEmbed]);
    setCustomEmbeds((prevCustomEmbeds) => [...prevCustomEmbeds, newEmbed]);

    localStorage.setItem('embedsData', JSON.stringify([...embeds, newEmbed]));
  };

  useEffect(() => {
    // Store updated embeds data in local storage
    localStorage.setItem('embedsData', JSON.stringify(embeds));

    // Add event listener to unload iframes on page refresh/reload
    window.addEventListener('beforeunload', handlePageUnload);

    return () => {
      // Remove event listener on component unmount
      window.removeEventListener('beforeunload', handlePageUnload);
    };
  }, [embeds]);

  const handlePageUnload = () => {
    setEmbeds((prevEmbeds) =>
      prevEmbeds.map((embed) => {
        return { ...embed, active: false };
      })
    );
    setButtonClicked(false);
  };

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleSaveClick = () => {
    if (url && title) {
      addCustomEmbed(url, title);
      setShowModal(false);
      setUrl('');
      setTitle('');
    }
  };

  const Modal = () => {
    if (!showModal) {
      return null;
    }

    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Add Custom Embed</h2>
          <input
            type="text"
            className="input"
            placeholder="Website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            type="text"
            className="input"
            placeholder="Website Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="modal-buttons">
            <button className="button" onClick={handleSaveClick}>
              Save
            </button>
            <button className="button button-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col justify-center items-center">
      {!buttonClicked && (
        <div style={{ "position": "fixed", "top": "0" }}>
          <h1 className="text-4xl font-bold mt-4 mb-4">NostrNet.work</h1>
          <h2 className="text-l font-bold mr-8 mb-4">Dashboard For Micro-App & use any website as PWA.</h2>
        </div>
      )}
      <div className={`flex justify-center mb-0 ${buttonClicked ? 'max-h-96 overflow-y-auto' : ''}`}>
        <div className="grid grid-cols-3 gap-4">
          {embeds.map((embed) => (
            <button 
              key={embed.id}
              className={`px-4 py-2 text-m rounded ${
                embed.active ? 'bg-blue-600' : 'bg-gray-800 font-bold hover:bg-gray-700'
              } ${buttonClicked ? 'text-sm' : ''}`}
              onClick={() => toggleEmbed(embed.id)}
              aria-label={`${embed.active ? 'Hide' : 'Show'} ${embed.title}`}
            >
              {embed.title}
            </button>
          ))}
          {!embeds.some((embed) => embed.active) && (
            <button
              className={`px-4 py-2 text-lg rounded bg-purple-600 text-white ${
                buttonClicked ? 'text-sm' : ''
              }`}
              onClick={handleAddClick}
            >
              Add
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center mt-8">
        {embeds.map((embed) => (
          <div
            key={embed.id}
            id={embed.id}
            className={`embed-container ${embed.active ? 'active' : ''}`}
          >
            {embed.active ? (
              <iframe
                src={embed.url}
                frameBorder="0"
                scrolling="yes"
                className="embed-iframe"
                title={embed.title}
                aria-label={embed.title}
              ></iframe>
            ) : (
              <div className="embed-placeholder">Click to activate</div>
            )}
          </div>
        ))}
      </div>

      <Modal />
    </div>
  );
};

export default App;

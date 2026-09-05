import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const NotFound = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div 
      id="error-page"
      style={{ 
        position: 'fixed', inset: 0, zIndex: 100, background: '#f1f1f1',
        font: '12px "YouTube Noto", Roboto, arial, sans-serif',
        textAlign: 'center', height: '100%', whiteSpace: 'nowrap', wordBreak: 'normal'
      }}
    >
      <div 
        id="error-page-content" 
        style={{ verticalAlign: 'middle', display: 'inline-block', whiteSpace: 'normal' }}
      >
        <img 
          id="error-page-hh-illustration" 
          src="https://www.gstatic.com/youtube/src/web/htdocs/img/monkey.png" 
          alt="" 
          style={{ marginBottom: '10px', display: 'inline-block' }}
        />
        <p style={{ width: '500px', margin: 'auto', color: '#333', fontSize: '16px', textShadow: '0 0 0 transparent, 0 1px 1px #fff' }}>
          This page isn't available. Sorry about that.
        </p>
        <p style={{ width: '500px', margin: 'auto', color: '#333', fontSize: '16px', textShadow: '0 0 0 transparent, 0 1px 1px #fff' }}>
          Try searching for something else.
        </p>
        <div id="yt-masthead" style={{ margin: '25px auto 15px', width: '440px', overflow: 'hidden' }}>
          <Link 
            id="logo-container" 
            to="/" 
            title="YouTube Home" 
            style={{ marginRight: '5px', float: 'left', cursor: 'pointer', textDecoration: 'none' }}
          >
            <span 
              className="logo" 
              title="YouTube Home" 
              style={{ 
                background: '50%/contain no-repeat url(https://www.gstatic.com/youtube/img/branding/youtubelogo/2x/youtubelogo_50.png)',
                width: '128px', height: '30px', cursor: 'pointer', display: 'inline-block' 
              }}
            ></span>
          </Link>
          <form 
            id="masthead-search" 
            className="search-form" 
            onSubmit={handleSearch}
            style={{ display: 'flex', marginTop: '3px', maxWidth: '650px', overflow: 'hidden', padding: 0, position: 'relative' }}
          >
            <div 
              id="masthead-search-terms-border" 
              dir="ltr"
              style={{
                flex: '1 1 auto', border: '1px solid #ccc', boxShadow: 'inset 0 1px 2px #eee', backgroundColor: '#fff', 
                fontSize: '14px', height: '29px', lineHeight: '30px', margin: '0 0 2px', overflow: 'hidden', 
                position: 'relative', boxSizing: 'border-box', transition: 'border-color .2s ease'
              }}
            >
              <input 
                id="masthead-search-terms" 
                autoComplete="off" 
                name="search_query" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text" 
                placeholder="Search" 
                title="Search" 
                aria-label="Search"
                style={{
                  background: 'transparent', border: 0, fontSize: '16px', height: '100%', left: 0, margin: 0, 
                  outline: 'none', padding: '2px 6px', position: 'absolute', width: '100%', boxSizing: 'border-box'
                }}
              />
            </div>
            <button 
              id="masthead-search-button" 
              type="submit" 
              dir="ltr"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                borderLeft: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, float: 'right', height: '29px', 
                padding: 0, border: '1px solid', borderColor: isHovered ? '#c6c6c6' : '#d3d3d3', 
                background: isHovered ? '#f0f0f0' : '#f8f8f8', color: '#333', cursor: 'pointer',
                boxShadow: isHovered ? '0 1px 0 rgba(0,0,0,.1)' : 'none',
                boxSizing: 'content-box'
              }}
            >
              <span 
                style={{
                  border: 'none', display: 'block', opacity: .6, padding: 0, textIndent: '-10000px', 
                  background: 'no-repeat url(https://www.gstatic.com/youtube/src/web/htdocs/img/search.png)', 
                  backgroundSize: 'auto', width: '15px', height: '15px', boxShadow: 'none', margin: '0 25px'
                }}
              >
                Search
              </span>
            </button>
          </form>
        </div>
      </div>
      <span id="error-page-vertical-align" style={{ height: '100%', display: 'inline-block', verticalAlign: 'middle' }}></span>
    </div>
  );
};

export default NotFound;

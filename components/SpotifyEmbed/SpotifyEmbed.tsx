'use client';

export default function SpotifyEmbed() {
  return (
    <div
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      onMouseEnter={() => document.documentElement.setAttribute('data-hide-cursor', 'true')}
      onMouseLeave={() => document.documentElement.removeAttribute('data-hide-cursor')}
    >
      <iframe
        style={{ borderRadius: '12px', border: 'none', flex: 1, minHeight: '352px' }}
        src="https://open.spotify.com/embed/playlist/3QqQ0p6RjmxnI9oit5MLxP?utm_source=generator&theme=0"
        width="100%"
        height="100%"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}

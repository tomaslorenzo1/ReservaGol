import React from 'react';

interface RedesSocialesProps {
  redes: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    twitter?: string;
    whatsapp?: string;
  };
}

const RedesSociales: React.FC<RedesSocialesProps> = ({ redes }) => {
  const redesDisponibles = [
    {
      nombre: 'instagram',
      icono: 'fab fa-instagram',
      color: '#E4405F',
      gradiente: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
      url: redes.instagram
    },
    {
      nombre: 'facebook',
      icono: 'fab fa-facebook-f',
      color: '#1877F2',
      gradiente: 'linear-gradient(45deg, #1877F2, #42a5f5)',
      url: redes.facebook
    },
    {
      nombre: 'tiktok',
      icono: 'fab fa-tiktok',
      color: '#000000',
      gradiente: 'linear-gradient(45deg, #000000, #333333)',
      url: redes.tiktok
    },
    {
      nombre: 'twitter',
      icono: 'custom-x-logo',
      color: '#000000',
      gradiente: 'linear-gradient(45deg, #000000, #333333)',
      url: redes.twitter
    },
    {
      nombre: 'whatsapp',
      icono: 'fab fa-whatsapp',
      color: '#25D366',
      gradiente: 'linear-gradient(45deg, #25D366, #66bb6a)',
      url: redes.whatsapp ? `https://wa.me/${redes.whatsapp.replace(/[^0-9]/g, '')}` : undefined
    }
  ];

  const redesConUrl = redesDisponibles.filter(red => red.url);

  if (redesConUrl.length === 0) return null;

  return (
    <div style={{
      background: 'var(--bg-card)',
      padding: '1.5rem',
      borderRadius: '15px',
      border: '1px solid var(--border-color)',
      marginTop: '1.5rem'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        marginBottom: '1rem' 
      }}>
        <i className="fas fa-share-alt" style={{ color: 'var(--primary-color)' }} />
        <strong style={{ color: 'var(--text-primary)' }}>Síguenos en Redes</strong>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {redesConUrl.map((red) => (
          <a
            key={red.nombre}
            href={red.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: red.gradiente,
              color: 'white',
              fontSize: '1.5rem',
              textDecoration: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 4px 15px ${red.color}30`,
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${red.color}50`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = `0 4px 15px ${red.color}30`;
            }}
          >
            {/* Efecto de brillo */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              transition: 'left 0.5s ease'
            }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.left = '100%';
            }}
            />
            
            {red.icono === 'custom-x-logo' ? (
              <div style={{
                width: '20px',
                height: '20px',
                background: 'white',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="black">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
            ) : (
              <i className={red.icono} style={{ position: 'relative', zIndex: 1 }} />
            )}
          </a>
        ))}
      </div>
      
      <p style={{ 
        textAlign: 'center', 
        margin: '1rem 0 0 0', 
        fontSize: '0.9rem', 
        color: 'var(--text-secondary)' 
      }}>
        ¡Mantente conectado con nosotros!
      </p>
    </div>
  );
};

export default RedesSociales;
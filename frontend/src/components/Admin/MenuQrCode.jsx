import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const MenuQrCode = ({ adminId }) => {
  const [qrImage, setQrImage] = useState('');
  const [copied, setCopied] = useState(false);

  const menuUrl = adminId ? `${window.location.origin}/menu/${adminId}` : '';

  useEffect(() => {
    if (!menuUrl) {
      return;
    }

    QRCode.toDataURL(menuUrl, {
      width: 220,
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    }).then(setQrImage);
  }, [menuUrl]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!adminId) {
    return null;
  }

  return (
    <div className="food-card qr-card">
      <div>
        <h3>Menu QR Code</h3>
        <p className="qr-description">Scan this code to open this admin's public menu card.</p>
      </div>
      {qrImage && <img className="qr-image" src={qrImage} alt="Menu QR code" />}
      <div className="qr-link">{menuUrl}</div>
      <div className="qr-actions">
        <button type="button" className="btn" onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy Link'}
        </button>
        <a className="btn btn-secondary" href={qrImage} download="menu-qr-code.png">
          Download QR
        </a>
        <a className="btn btn-secondary" href={menuUrl} target="_blank" rel="noreferrer">
          Open Menu
        </a>
      </div>
    </div>
  );
};

export default MenuQrCode;

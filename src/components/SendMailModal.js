import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Das Standard-Theme

const SendMailModal = ({ isOpen, onClose }) => {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    if (!isOpen) return null;

    // Gmail-Sende-Funktion
    const handleSend = async () => {
        if (!to || !subject) {
            alert("Bitte Empfänger und Betreff angeben!");
            return;
        }

        // Wir schicken die Daten an den Electron Main-Prozess (main.js)
        window.electron.sendMail({ to, subject, body });
        alert("Nachricht wird gesendet...");
        onClose();
    };

    // Konfiguration für die Schriftauswahl und Toolbar
    const modules = {
        toolbar: [
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
        ],
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Neue Nachricht</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <input
                        type="text"
                        placeholder="An"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="modal-input"
                    />
                    <input
                        type="text"
                        placeholder="Betreff"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="modal-input"
                    />

                    {/* Der Rich-Text-Editor */}
                    <div className="editor-container">
                        <ReactQuill
                            theme="snow"
                            value={body}
                            onChange={setBody}
                            modules={modules}
                            placeholder="Schreibe deine Nachricht..."
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Abbrechen</button>
                    <button className="btn-primary" onClick={handleSend}>Senden</button>
                </div>
            </div>

            <style jsx>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.8); display: flex;
          justify-content: center; alignItems: center; z-index: 9999;
        }
        .modal-content {
          background: #1a1d21; width: 700px; border-radius: 12px;
          padding: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          border: 1px solid #333;
        }
        .modal-header { display: flex; justify-content: space-between; color: white; margin-bottom: 15px; }
        .modal-input {
          width: 100%; background: #262a30; border: 1px solid #3a3f47;
          color: white; padding: 10px; border-radius: 6px; margin-bottom: 10px;
        }
        .editor-container { background: white; border-radius: 6px; color: black; min-height: 300px; }
        .modal-footer { display: flex; justify-content: flex-end; margin-top: 15px; }
        .btn-primary { background: #3b82f6; color: white; border: none; padding: 10px 25px; border-radius: 6px; cursor: pointer; }
        .btn-secondary { background: transparent; color: #aaa; border: none; margin-right: 15px; cursor: pointer; }
        
        /* Quill Dark Mode Korrektur für die Toolbar */
        .ql-toolbar { background: #eee !important; border-top-left-radius: 6px; border-top-right-radius: 6px; }
        .ql-container { border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; font-size: 16px; }
      `}</style>
        </div>
    );
};

export default SendMailModal;
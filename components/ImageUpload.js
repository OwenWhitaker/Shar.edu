"use client";

import { useState, useCallback } from 'react';
import styles from './ImageUpload.module.css';

export default function ImageUpload({ name, multiple = false }) {
    const [dragActive, setDragActive] = useState(false);
    const [previews, setPreviews] = useState([]);
    const [base64Values, setBase64Values] = useState([]);

    const processFiles = useCallback((files) => {
        const newPreviews = [];
        const newBase64 = [];

        files.forEach(file => {
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onloadend = () => {
                newBase64.push(reader.result);
                if (newBase64.length === files.length) {
                    if (multiple) {
                        setBase64Values(prev => [...prev, ...newBase64]);
                        setPreviews(prev => [...prev, ...newBase64]);
                    } else {
                        setBase64Values([newBase64[0]]);
                        setPreviews([newBase64[0]]);
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    }, [multiple]);

    const handleFileChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        processFiles(files);
    }, [processFiles]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    }, [processFiles]);

    const removeImage = (index) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
        setBase64Values(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className={styles.container}>
            {/* Hidden inputs to send data in form submission */}
            {base64Values.map((value, index) => (
                <input key={index} type="hidden" name={name} value={value} />
            ))}

            <div
                className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <p>Drag & drop images here, or click to select</p>
                <input
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
            </div>

            <div className={styles.previewGrid}>
                {previews.map((src, index) => (
                    <div key={index} className={styles.previewContainer}>
                        <img src={src} alt="Preview" className={styles.previewImage} />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className={styles.removeBtn}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

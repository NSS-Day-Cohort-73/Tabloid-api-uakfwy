import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTag } from '../../managers/tagManager';

export default function CreateTag() {
    const [tagName, setTagName] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        let value = e.target.value;
    
        // Always ensure the first character is '#'
        if (!value.startsWith('#')) {
            value = '#' + value.replace(/^#/, '');
        }
    
        setTagName(value);
    };
    
    
    const handleSave = (e) => {
        e.preventDefault();
    
        if (tagName === '#' || tagName.trim() === '') {
            alert('Tag name cannot be empty.');
            return;
        }
    
        const newTag = { tagName: tagName.trim() };
    
        addTag(newTag)
            .then(() => navigate('/tags'))
            .catch(error => {
                console.error('Error creating tag:', error);
                alert('Failed to create tag. Please try again.');
            });
    };
    
    

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 mt-3">
                    <h2>Create Tag</h2>
                    <form>
                        <div className="form-group mt-4">
                            <label htmlFor="tagName">Tag Name:</label>
                            <input 
                                type="text"
                                className="form-control"
                                id="tagName"
                                name="tagName"
                                value={tagName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <button 
                                className="btn btn-primary me-2"
                                onClick={handleSave}
                                type="button"
                            >
                                Save
                            </button>
                            <button 
                                className="btn btn-secondary"
                                onClick={() => navigate('/tags')}
                                type="button"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
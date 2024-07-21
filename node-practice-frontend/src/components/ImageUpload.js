import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState(null);

  // clothing id
  const { id } = useParams();

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file); 

    try {
      const imageUri = `${process.env.REACT_APP_IMAGE_URI}/${id}`;

      const res = await axios.post(imageUri, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      });

      setUploadedFile(res.data);
    } catch (err) {
      if (err.response.status === 500) {
        console.log('There was a problem with the server');
      } else {
        console.log(err.response.data.error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input type='file' className='custom-file-input' id='customFile' onChange={onChange} />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>
        <input type='submit' value='Upload' className='btn btn-primary btn-block mt-4' />
      </form>
      {uploadedFile && (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.filename}</h3>
            <img style={{ width: '100%' }} src={`data:${uploadedFile.contentType};base64,${uploadedFile.imageBase64}`} alt='' />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

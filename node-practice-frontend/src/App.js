import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  const [clothing, setClothing] = useState([]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_OUTFIT_URI)
    .then(res => {
      console.log(res.data.data)
      setClothing(res.data.data);
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  return (
    <React.Fragment>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Clothing ids</th>
            <th>Formality</th>
          </tr>
        </thead>
        <tbody>
          {clothing.map(item => {
            return (
              <tr key={item.id}>
                <td>{item.clothing_ids}</td>
                <td>{item.formality}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </React.Fragment>
  );
}

export default App;

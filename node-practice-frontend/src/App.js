import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  const [clothing, setClothing] = useState([]);

  useEffect(() => {
    const getClothes = async () => {
      try {
        const res = await axios.get(process.env.REACT_APP_CLOTHING_URI, { withCredentials: true
        });
        setClothing(res.data.clothes);
      } catch (err) {
        console.log(err);
      }
    }
    getClothes();
    
  }, [])

  return (
    <React.Fragment>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Category</th>
            <th>Formality</th>
          </tr>
        </thead>
        <tbody>
          {clothing.map(item => {
            return (
              <tr key={item.id}>
                <td>{item.category}</td>
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

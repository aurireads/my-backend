import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: ''
  });

  const [editCarId, setEditCarId] = useState(null);

  // Carregar todos os carros
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:3000/cars'); // Substitua com o endpoint correto
      setCars(response.data);
    } catch (error) {
      console.error('Erro ao carregar carros', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const carData = {
        brand: form.brand,
        model: form.model,
        year: parseInt(form.year, 10),
      };

      if (editCarId) {
        // Atualizar carro existente
        await axios.put(`http://localhost:3000/cars/${editCarId}`, carData);
      } else {
        // Criar um novo carro
        await axios.post('http://localhost:3000/cars', carData);
      }

      // Após salvar o carro, atualize a lista
      fetchCars();

      // Limpar o formulário
      setForm({ brand: '', model: '', year: '' });
      setEditCarId(null);
    } catch (error) {
      console.error('Erro ao salvar carro', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/cars/${id}`);
      fetchCars();
    } catch (error) {
      console.error('Erro ao deletar carro', error);
    }
  };

  const handleEdit = (car) => {
    setForm({
      brand: car.brand,
      model: car.model,
      year: car.year.toString(), // Converter para string
    });
    setEditCarId(car.id);
  };

  return (
    <div className="App">
      <h1>Gerenciamento de Carros</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Marca"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
          required
        />
        <p></p><input
          type="text"
          placeholder="Modelo"
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
          required
        />
        <p></p><input
          type="date"
          placeholder="Ano"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          required
        />
        <button type="submit">{editCarId ? 'Atualizar' : 'Adicionar'} Carro</button>
      </form>

      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            {car.brand} {car.model} ({car.year})
            <button onClick={() => handleEdit(car)}>Editar</button>
            <button onClick={() => handleDelete(car.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

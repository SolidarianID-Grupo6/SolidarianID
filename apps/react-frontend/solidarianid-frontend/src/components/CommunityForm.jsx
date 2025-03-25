import React, { useState } from 'react';

function CommunityForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg">
      <form>
        {/* Nombre de la comunidad */}
        <div className="mb-4">
          <label htmlFor="nameCommunity" className="block text-sm font-medium text-gray-900">
            Nombre de la comunidad
          </label>
          <input
            id="nameCommunity"
            name="nameCommunity"
            type="text"
            placeholder="Nombre"
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:outline-none"
          />
        </div>

        {/* Descripción de la comunidad */}
        <div className="mb-4">
          <label htmlFor="descriptionCommunity" className="block text-sm font-medium text-gray-900">
            Descripción de la comunidad
          </label>
          <textarea
            id="descriptionCommunity"
            name="descriptionCommunity"
            rows={4}
            placeholder="Descripción"
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:outline-none"
          />
        </div>

        {/* Botón para enviar el formulario de la comunidad */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommunityForm;

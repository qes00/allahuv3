import React, { useState } from 'react';
import { UploadResponse, FetchStatus } from '../types';
import { Button } from './Button';
import { generateSmartDescription } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminPanel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('General');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  const [aiLoading, setAiLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Mock data for the chart
  const salesData = [
    { name: 'Lun', ventas: 4000 },
    { name: 'Mar', ventas: 3000 },
    { name: 'Mie', ventas: 2000 },
    { name: 'Jue', ventas: 2780 },
    { name: 'Vie', ventas: 1890 },
    { name: 'Sab', ventas: 2390 },
    { name: 'Dom', ventas: 3490 },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleGenerateDescription = async () => {
    if (!productName) return;
    setAiLoading(true);
    try {
      const generated = await generateSmartDescription(productName, category);
      setDescription(generated);
    } catch (error) {
      alert("Error generando descripción");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !productName || !price) {
      alert("Por favor complete los campos obligatorios");
      return;
    }

    setStatus(FetchStatus.LOADING);

    // SIMULACIÓN DE LA LLAMADA AL BACKEND EN CLOUD RUN
    // Esta función simula el POST /api/upload descrito en el prompt del backend.
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', productName);
      formData.append('price', price);
      formData.append('description', description);

      // Simular latencia de red (Cloud Run -> FTP -> Respuesta)
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("Enviando a Cloud Run API endpoint...");
      
      // Mock success response
      setStatus(FetchStatus.SUCCESS);
      setFile(null);
      setProductName('');
      setPrice('');
      setDescription('');
      setPreviewUrl(null);
      alert("Producto creado e imagen subida al FTP correctamente.");

    } catch (error) {
      console.error(error);
      setStatus(FetchStatus.ERROR);
    } finally {
      setStatus(FetchStatus.IDLE);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Panel de Administración</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de Creación */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-6 text-slate-700 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg text-sm">NUEVO</span>
            Agregar Producto
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Producto</label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                placeholder="Ej: Camiseta Selección Peruana"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="General">General</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Hogar">Hogar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Precio (PEN)</label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="0.00"
                  step="0.10"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Descripción</label>
                <button 
                  type="button" 
                  onClick={handleGenerateDescription}
                  disabled={aiLoading || !productName}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 disabled:opacity-50"
                >
                  {aiLoading ? 'Generando...' : '✨ Mejorar con Gemini AI'}
                </button>
              </div>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Descripción del producto..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Imagen del Producto</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                   <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="text-sm text-slate-500"><span className="font-semibold">Click para subir</span></p>
                        <p className="text-xs text-slate-400">JPG, PNG (MAX. 2MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
                </div>
                {previewUrl && (
                  <div className="w-32 h-32 rounded-lg overflow-hidden border border-slate-200">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-4" 
              isLoading={status === FetchStatus.LOADING}
            >
              Subir a Cloud Run & FTP
            </Button>
          </form>
        </div>

        {/* Panel de Estadísticas */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-grow">
            <h2 className="text-xl font-semibold mb-6 text-slate-700">Ventas Semanales</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="ventas" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-6 rounded-xl shadow-lg text-white">
            <h3 className="text-lg font-bold mb-2">Estado del Sistema</h3>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-indigo-100 text-sm">Cloud Run API: Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-indigo-100 text-sm">FTP Server: Conectado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
import React, { useState } from 'react';
import { UploadResponse, FetchStatus } from '../types';
import { Button } from './Button';
import { generateSmartDescription } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>Panel de Administración</h1>

      <div className={styles.gridContainer}>
        {/* Formulario de Creación */}
        <div className={styles.card.container}>
          <h2 className={styles.card.title}>
            <span className={styles.card.badge}>NUEVO</span>
            Agregar Producto
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={styles.form.label}>Nombre del Producto</label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className={styles.form.input}
                placeholder="Ej: Camiseta Selección Peruana"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={styles.form.label}>Categoría</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={styles.form.input}
                >
                  <option value="General">General</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Hogar">Hogar</option>
                </select>
              </div>
              <div>
                <label className={styles.form.label}>Precio (PEN)</label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={styles.form.input}
                  placeholder="0.00"
                  step="0.10"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={styles.form.label}>Descripción</label>
                <button 
                  type="button" 
                  onClick={handleGenerateDescription}
                  disabled={aiLoading || !productName}
                  className={styles.form.aiButton}
                >
                  {aiLoading ? 'Generando...' : '✨ Mejorar con Gemini AI'}
                </button>
              </div>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={styles.form.textarea}
                placeholder="Descripción del producto..."
              />
            </div>

            <div>
              <label className={styles.form.labelMargin}>Imagen del Producto</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                   <label className={styles.form.uploadBox}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-stone-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="text-sm text-stone-500 font-medium"><span className="font-bold text-gold-700">Click para subir</span></p>
                        <p className="text-xs text-stone-400 font-medium">JPG, PNG (MAX. 2MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
                </div>
                {previewUrl && (
                  <div className={styles.form.previewContainer}>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className={styles.form.submitBtn}
              isLoading={status === FetchStatus.LOADING}
            >
              Subir a Cloud Run & FTP
            </Button>
          </form>
        </div>

        {/* Panel de Estadísticas */}
        <div className="flex flex-col gap-6">
          <div className={`${styles.card.container} flex-grow`}>
            <h2 className={styles.chartTitle}>Ventas Semanales</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#000000', fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#000000', fontWeight: 'bold'}} />
                  <Tooltip 
                    cursor={{fill: '#fffdb3'}} 
                    contentStyle={{borderRadius: '8px', border: '1px solid #d6d3d1', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff'}}
                    itemStyle={{color: '#000'}}
                    labelStyle={{color: '#b39700', fontWeight: 'bold'}}
                  />
                  {/* Using both Gold subtypes for visualization */}
                  <Bar dataKey="ventas" radius={[4, 4, 0, 0]}>
                    {salesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#cd9f33' : '#ffd700'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2 text-xs font-bold text-stone-600">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gold-500"></div>Metal Gold</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-sun-500"></div>Sun Gold</div>
              </div>
            </div>
          </div>
          
          <div className={styles.status.card}>
            <h3 className={styles.status.title}>Estado del Sistema</h3>
            <div className={styles.status.row}>
              <div className={styles.status.indicator}></div>
              <span className={styles.status.text}>Cloud Run API: Online</span>
            </div>
            <div className={styles.status.row}>
              <div className={styles.status.indicator}></div>
              <span className={styles.status.text}>FTP Server: Conectado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  layout: "max-w-6xl mx-auto p-6",
  pageTitle: "text-3xl font-bold text-black mb-8",
  gridContainer: "grid grid-cols-1 lg:grid-cols-2 gap-8",
  card: {
    container: "bg-white p-6 rounded-xl shadow-sm border border-stone-200",
    title: "text-xl font-bold mb-6 text-black flex items-center gap-2",
    badge: "bg-gold-100 text-black p-1.5 rounded-lg text-sm font-bold"
  },
  form: {
    label: "block text-sm font-bold text-stone-900 mb-1",
    labelMargin: "block text-sm font-bold text-stone-900 mb-2",
    input: "w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-black font-medium",
    textarea: "w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none resize-none text-black font-medium",
    aiButton: "text-xs text-gold-700 hover:text-gold-900 font-bold flex items-center gap-1 disabled:opacity-50",
    uploadBox: "flex flex-col items-center justify-center w-full h-32 border-2 border-stone-300 border-dashed rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors",
    previewContainer: "w-32 h-32 rounded-lg overflow-hidden border border-stone-200",
    submitBtn: "w-full mt-4 bg-gold-500 hover:bg-gold-400 text-black"
  },
  chartTitle: "text-xl font-bold mb-6 text-black",
  status: {
    card: "bg-gradient-to-br from-gold-600 to-gold-700 p-6 rounded-xl shadow-lg text-black",
    title: "text-lg font-bold mb-2",
    row: "flex items-center gap-2 mb-1",
    indicator: "w-2 h-2 rounded-full bg-green-500 animate-pulse",
    text: "text-black text-sm font-medium"
  }
};

export default AdminPanel;
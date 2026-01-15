import React, { useState } from 'react';
import { UserProfile, CartItem, PaymentMethod, UserAddress } from '../types';
import { Button } from './Button';
import { formatCurrency } from '../constants';
import { useNavigate } from 'react-router-dom';

interface UserPanelProps {
  cart: CartItem[];
}

const MOCK_USER: UserProfile = {
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@example.com',
  phone: '987654321',
  documentType: 'DNI',
  documentNumber: '45678912',
  addresses: [
    {
      id: '1',
      department: 'Lima',
      province: 'Lima',
      district: 'Miraflores',
      street: 'Av. Larco 123, Dpto 401',
      reference: 'Frente al parque Kennedy'
    }
  ],
  savedCards: [
    {
      id: 'c1',
      brand: 'visa',
      last4: '4242',
      token: 'tok_secure_aes256_xyz123',
      expiry: '12/25'
    }
  ]
};

const UserPanel: React.FC<UserPanelProps> = ({ cart }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'shipping' | 'payment' | 'security' | 'cart'>('profile');
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [isEditing, setIsEditing] = useState(false);

  // Password State
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Handlers simulados
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    alert("Datos actualizados correctamente.");
  };

  const handleAddCard = () => {
    // En una app real, esto abriría un iframe/modal de la pasarela (Niubiz, Culqi, Izipay)
    // Nunca guardamos el número completo, solo el token retornado por la pasarela.
    alert("Iniciando conexión segura TLS 1.3 con pasarela de pagos...");
    
    setTimeout(() => {
      const newCard: PaymentMethod = {
        id: Math.random().toString(36).substr(2, 9),
        brand: 'mastercard',
        last4: '8899',
        token: `tok_${Math.random().toString(36).substr(2)}`, // Simulación de tokenización
        expiry: '09/26'
      };
      setUser(prev => ({ ...prev, savedCards: [...prev.savedCards, newCard] }));
      alert("Tarjeta tokenizada y guardada exitosamente.");
    }, 1500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      alert("Las nuevas contraseñas no coinciden.");
      return;
    }
    
    // Simulación de llamada a API
    alert("Procesando encriptación bcrypt...");
    setTimeout(() => {
      alert("Tu contraseña ha sido actualizada correctamente.");
      setPasswordForm({ current: '', new: '', confirm: '' });
    }, 1000);
  };

  const handleDeleteAccount = () => {
    const isConfirmed = window.confirm(
      "¿ESTÁS SEGURO?\n\nEsta acción eliminará permanentemente tu cuenta, historial de pedidos y datos personales. Esta acción no se puede deshacer."
    );

    if (isConfirmed) {
      // Simulación de borrado en Cloud SQL y Storage
      alert("Eliminando datos...");
      setTimeout(() => {
        alert("Tu cuenta ha sido eliminada. Lamentamos verte partir.");
        // Redirigir al home y limpiar estado (simulado)
        navigate('/');
        window.location.reload(); 
      }, 1500);
    }
  };

  const renderSidebar = () => (
    <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
      <div className="p-6 bg-indigo-50 border-b border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-800">{user.firstName}</p>
            <p className="text-xs text-slate-500">Miembro desde 2024</p>
          </div>
        </div>
      </div>
      <nav className="p-2">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          Datos Personales
        </button>
        <button 
          onClick={() => setActiveTab('shipping')}
          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === 'shipping' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Direcciones de Envío
        </button>
        <button 
          onClick={() => setActiveTab('payment')}
          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === 'payment' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
          Métodos de Pago
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          Seguridad & Privacidad
        </button>
        <button 
          onClick={() => setActiveTab('cart')}
          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === 'cart' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          Mi Carrito Activo
          {cart.length > 0 && <span className="ml-auto bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">{cart.reduce((a,c) => a + c.quantity, 0)}</span>}
        </button>
      </nav>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Mi Cuenta</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {renderSidebar()}
        
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Datos Personales</h2>
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="text-sm">
                  {isEditing ? 'Cancelar' : 'Editar Datos'}
                </Button>
              </div>
              
              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombres</label>
                  <input type="text" disabled={!isEditing} defaultValue={user.firstName} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 disabled:text-slate-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
                  <input type="text" disabled={!isEditing} defaultValue={user.lastName} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 disabled:text-slate-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Documento</label>
                  <select disabled={!isEditing} defaultValue={user.documentType} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 disabled:text-slate-500">
                    <option value="DNI">DNI</option>
                    <option value="RUC">RUC</option>
                    <option value="CE">Carnet Extranjería</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Número de Documento</label>
                  <input type="text" disabled={!isEditing} defaultValue={user.documentNumber} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 disabled:text-slate-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                  <input type="email" disabled defaultValue={user.email} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" />
                  <p className="text-xs text-slate-400 mt-1">Para cambiar tu correo, contacta a soporte.</p>
                </div>
                
                {isEditing && (
                  <div className="md:col-span-2 flex justify-end">
                    <Button type="submit">Guardar Cambios</Button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Mis Direcciones</h2>
                <Button className="text-sm">Nueva Dirección</Button>
              </div>

              <div className="space-y-4">
                {user.addresses.map(addr => (
                  <div key={addr.id} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors flex justify-between items-start group">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-800">{addr.district}, {addr.province}</span>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Principal</span>
                      </div>
                      <p className="text-slate-600">{addr.street}</p>
                      <p className="text-sm text-slate-500 mt-1">{addr.department}</p>
                      {addr.reference && <p className="text-xs text-slate-400 mt-2 italic">Ref: {addr.reference}</p>}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Editar</button>
                      <button className="text-red-500 hover:text-red-700 text-sm font-medium">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Billetera Segura</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Tus tarjetas son almacenadas de forma segura mediante <strong>Tokenización</strong>. 
                      No guardamos los números de tarjeta en nuestros servidores. (Evitamos MD5/SHA1 obsoletos, usamos TLS 1.3).
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {user.savedCards.map(card => (
                  <div key={card.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-500 uppercase">
                        {card.brand}
                      </div>
                      <div>
                        <p className="font-mono text-slate-700">•••• •••• •••• {card.last4}</p>
                        <p className="text-xs text-slate-500">Expira: {card.expiry}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-green-600 bg-green-50 px-2 py-1 rounded">Token: {card.token.substr(0,8)}...</span>
                  </div>
                ))}
              </div>

              <Button onClick={handleAddCard} className="w-full sm:w-auto">
                + Agregar Tarjeta (Integración Segura)
              </Button>
            </div>
          )}

          {activeTab === 'security' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
               <h2 className="text-xl font-bold text-slate-800 mb-6">Gestión de Contraseña</h2>
               
               <form onSubmit={handlePasswordChange} className="max-w-md space-y-4 mb-12">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña Actual</label>
                   <input 
                    type="password" 
                    required
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Contraseña</label>
                   <input 
                    type="password" 
                    required
                    minLength={8}
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                   />
                   <p className="text-xs text-slate-500 mt-1">Mínimo 8 caracteres.</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Nueva Contraseña</label>
                   <input 
                    type="password" 
                    required
                    minLength={8}
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                   />
                 </div>
                 <Button type="submit">Actualizar Contraseña</Button>
               </form>

               <div className="border-t border-slate-200 pt-8">
                 <h2 className="text-xl font-bold text-red-600 mb-4">Zona de Peligro</h2>
                 <div className="border border-red-200 bg-red-50 rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                   <div>
                     <h3 className="font-semibold text-red-800">Eliminar Cuenta</h3>
                     <p className="text-sm text-red-600 mt-1 max-w-lg">
                       Al eliminar tu cuenta, se borrarán todos tus datos personales, direcciones guardadas, métodos de pago e historial de pedidos. Esta acción <strong>no se puede deshacer</strong>.
                     </p>
                   </div>
                   <Button variant="danger" onClick={handleDeleteAccount}>
                     Eliminar mi Cuenta
                   </Button>
                 </div>
               </div>
             </div>
          )}

          {activeTab === 'cart' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Carrito Guardado</h2>
              {cart.length === 0 ? (
                <p className="text-slate-500">No tienes productos en tu carrito.</p>
              ) : (
                <div className="space-y-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0">
                      <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-slate-100" />
                      <div>
                        <h3 className="font-semibold text-slate-800">{item.name}</h3>
                        <p className="text-sm text-slate-500">{item.description}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="font-bold text-indigo-600">{formatCurrency(item.price)}</span>
                          <span className="text-sm text-slate-500">x {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-800">Total Estimado</span>
                    <span className="text-2xl font-bold text-indigo-700">
                      {formatCurrency(cart.reduce((sum, i) => sum + (i.price * i.quantity), 0))}
                    </span>
                  </div>
                  <Button className="w-full">Proceder al Pago</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
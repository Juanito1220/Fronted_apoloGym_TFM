import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/perfil.css";
import { useAuth } from "../../Auth/AuthContext";

export default function Perfil() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ nombre: "", direccion: "", telefono: "" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      // Usar datos mockeados si los campos están vacíos
      setForm({
        nombre: user.nombre || user.name || "Juan Carlos Pérez",
        direccion: user.direccion || "Calle 123 #45-67, Bogotá, Colombia",
        telefono: user.telefono || "+57 300 123 4567"
      });
    } else {
      // Datos por defecto si no hay usuario
      setForm({
        nombre: "Juan Carlos Pérez",
        direccion: "Calle 123 #45-67, Bogotá, Colombia",
        telefono: "+57 300 123 4567"
      });
    }
  }, [user]);

  const guardar = () => {
    updateUser({ ...form });
    setIsEditModalOpen(false);
    // Mostrar mensaje de éxito más elegante
    const toast = document.createElement('div');
    toast.textContent = '✅ Perfil actualizado exitosamente';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10B981;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 1000;
      font-weight: 500;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  // Modal de edición
  const EditModal = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isEditModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={() => setIsEditModalOpen(false)}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-transform duration-300"
        style={{ transform: isEditModalOpen ? 'scale(1)' : 'scale(0.9)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Editar Perfil</h2>
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ingresa tu nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <input
              type="text"
              value={form.direccion}
              onChange={e => setForm({ ...form, direccion: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ingresa tu dirección"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <input
              type="tel"
              value={form.telefono}
              onChange={e => setForm({ ...form, telefono: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ingresa tu número de teléfono"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={guardar}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">¡Bienvenido a Apolo Gym! 👋</h1>
              <p className="text-gray-600 mt-1">Tu centro de entrenamiento completo. Gestiona tu membresía y accede a todos los servicios.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Estado de Membresía */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Estado de Membresía</h2>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-lg">Sin membresía activa</div>
                  <div className="text-blue-100">Adquiere un plan para comenzar a entrenar con nosotros.</div>
                </div>
              </div>
            </div>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Sin membresía
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate('/cliente/planes')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Ver Planes Disponibles
            </button>
          </div>
        </div>

        {/* Mi Perfil Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Mi Perfil</h2>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Perfil
              </button>
            </div>
            <p className="text-gray-300 mt-2">Edita tu información básica.</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
                  <div className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border">
                    {form.nombre || "No especificado"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Dirección</label>
                  <div className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border">
                    {form.direccion || "No especificado"}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <div className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border">
                    {user?.email || "juan.perez@gmail.com"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Teléfono</label>
                  <div className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border">
                    {form.telefono || "No especificado"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Estadísticas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏃‍♂️</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">23</div>
              <div className="text-sm text-gray-600">Entrenamientos completados</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📅</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600">Clases reservadas</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">15</div>
              <div className="text-sm text-gray-600">Días de racha</div>
            </div>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => navigate('/cliente/planes')}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-blue-100"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💪</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Planes y Membresías</h3>
            <p className="text-sm text-gray-600">Ver planes disponibles</p>
          </div>

          <div
            onClick={() => navigate('/cliente/reservas')}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-green-100"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Reservar Clases</h3>
            <p className="text-sm text-gray-600">Agenda tu entrenamiento</p>
          </div>

          <div
            onClick={() => navigate('/cliente/rutinas')}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-purple-100"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🏃‍♂️</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Mis Rutinas</h3>
            <p className="text-sm text-gray-600">Ver plan de entrenamiento</p>
          </div>

          <div
            onClick={() => navigate('/cliente/historial')}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-orange-100"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Mi Historial</h3>
            <p className="text-sm text-gray-600">Pagos y asistencia</p>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      <EditModal />

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

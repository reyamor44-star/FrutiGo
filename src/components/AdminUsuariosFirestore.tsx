import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  User, 
  Bike, 
  Store, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  FileText, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Eye, 
  X, 
  Bell, 
  Radio, 
  Sparkles,
  ChevronRight,
  FileCheck,
  MapPin,
  Car,
  CreditCard,
  Key,
  Award,
  DollarSign,
  Package,
  Image as ImageIcon,
  Copy,
  Check,
  Navigation,
  Code,
  CheckCheck
} from "lucide-react";
import { 
  subscribeToUsuariosCollection, 
  ParsedUsuario, 
  RealtimeAlertEvent,
  parseFirestoreUsuario
} from "../lib/firestoreUsersClient";

interface AdminUsuariosFirestoreProps {
  onNotify?: (msg: string) => void;
}

export default function AdminUsuariosFirestore({ onNotify }: AdminUsuariosFirestoreProps) {
  const [usuarios, setUsuarios] = useState<ParsedUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"todos" | "cliente" | "repartidor" | "negocio">("todos");
  const [statusFilter, setStatusFilter] = useState<"todos" | "Completado" | "Pendiente de Documentos">("todos");

  // Alertas en tiempo real
  const [alerts, setAlerts] = useState<RealtimeAlertEvent[]>([]);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);

  // Modal para ver detalles y documentos de un usuario
  const [selectedUserModal, setSelectedUserModal] = useState<ParsedUsuario | null>(null);

  // Referencia estable para callback de notificación y evitar re-suscripciones
  const onNotifyRef = React.useRef(onNotify);
  useEffect(() => {
    onNotifyRef.current = onNotify;
  }, [onNotify]);

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Suscripción en Tiempo Real SOLO LECTURA a Firestore (default)
  useEffect(() => {
    setError(null);

    const unsubscribe = subscribeToUsuariosCollection(
      (data) => {
        setUsuarios(data);
        setLoading(false);
        setIsConnected(true);
        setError(null);
      },
      (newAlert) => {
        setAlerts((prev) => [newAlert, ...prev.slice(0, 24)]);
        setUnreadAlertsCount((prev) => prev + 1);
        if (onNotifyRef.current) {
          onNotifyRef.current(newAlert.message);
        }
      },
      (err) => {
        console.warn("Error en la conexión en tiempo real con Firestore:", err);
        setError("Modo de respaldo activo: Sincronizando con base de datos de usuarios.");
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/firestore-users");
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.users)) {
          const parsed = json.users.map((u: any) => parseFirestoreUsuario(u.id, u));
          setUsuarios(parsed);
        }
      }
    } catch (e) {
      console.warn("Fallo al actualizar manualmente:", e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const total = usuarios.length;
    const clientes = usuarios.filter((u) => u.rol === "cliente").length;
    const repartidores = usuarios.filter((u) => u.rol === "repartidor").length;
    const negocios = usuarios.filter((u) => u.rol === "negocio").length;
    const completados = usuarios.filter((u) => u.estatusRegistro === "Completado").length;
    const pendientes = usuarios.filter((u) => u.estatusRegistro === "Pendiente de Documentos").length;

    return { total, clientes, repartidores, negocios, completados, pendientes };
  }, [usuarios]);

  // Filtrado de usuarios
  const filteredUsuarios = useMemo(() => {
    return usuarios.filter((u) => {
      if (roleFilter !== "todos" && u.rol !== roleFilter) return false;
      if (statusFilter !== "todos" && u.estatusRegistro !== statusFilter) return false;

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchNombre = u.nombre.toLowerCase().includes(term);
        const matchCorreo = u.correo.toLowerCase().includes(term);
        const matchTel = u.telefono.toLowerCase().includes(term);
        const matchId = u.id.toLowerCase().includes(term);
        const matchPlacas = (u.placas || "").toLowerCase().includes(term);
        const matchDireccion = (u.direccion || "").toLowerCase().includes(term);
        return matchNombre || matchCorreo || matchTel || matchId || matchPlacas || matchDireccion;
      }

      return true;
    });
  }, [usuarios, roleFilter, statusFilter, searchTerm]);

  // Exportar a CSV
  const handleExportCSV = () => {
    if (usuarios.length === 0) return;

    const headers = [
      "ID",
      "Nombre",
      "Correo",
      "Telefono",
      "Rol",
      "Estatus",
      "Documentos_Subidos",
      "Cantidad_Documentos",
      "Direccion",
      "Vehiculo",
      "Placas",
      "Banco",
      "CLABE",
      "Fecha_Registro"
    ];

    const rows = filteredUsuarios.map((u) => [
      `"${u.id}"`,
      `"${u.nombre.replace(/"/g, '""')}"`,
      `"${u.correo}"`,
      `"${u.telefono}"`,
      `"${u.rolDisplay}"`,
      `"${u.estatusRegistro}"`,
      `"${u.documentsSubmitted ? 'SI' : 'NO'}"`,
      u.documentos.length,
      `"${(u.direccion || '').replace(/"/g, '""')}"`,
      `"${u.vehiculoTipo || ''}"`,
      `"${u.placas || ''}"`,
      `"${u.bankName || ''}"`,
      `"${u.openpayClabe || ''}"`,
      `"${u.fechaRegistroFormateada}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `usuarios_firestore_frutigo_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header del Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#0F3A1D] text-[#FABF08] rounded-xl">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-zinc-900">Extracción de Usuarios & Documentos Firestore</h2>
          </div>
          <p className="text-xs text-zinc-500">
            Monitoreo en tiempo real de registros, identificaciones oficiales, fotografías, licencias y estatus de cuentas en la base de datos.
          </p>
        </div>

        {/* Acciones y Estado de Conexión */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Badge de Conexión en Tiempo Real */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold shadow-2xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Firestore Conectado</span>
          </div>

          {/* Botón de Alertas / Notificaciones en tiempo real */}
          <div className="relative">
            <button
              onClick={() => {
                setShowAlertsDropdown(!showAlertsDropdown);
                setUnreadAlertsCount(0);
              }}
              className="relative p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold text-xs transition flex items-center gap-1.5"
              title="Alertas en tiempo real"
            >
              <Bell className="w-4 h-4 text-zinc-600" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Dropdown de Alertas */}
            {showAlertsDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span className="text-xs font-black text-zinc-900">Eventos en Vivo ({alerts.length})</span>
                  </div>
                  <button
                    onClick={() => setAlerts([])}
                    className="text-[11px] text-zinc-400 hover:text-zinc-600 font-bold"
                  >
                    Limpiar
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {alerts.length === 0 ? (
                    <div className="py-6 text-center text-xs text-zinc-400">
                      Sin eventos recientes en Firestore.
                    </div>
                  ) : (
                    alerts.map((al) => (
                      <div
                        key={al.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                          al.type === "new_user"
                            ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                            : "bg-amber-50/70 border-amber-200 text-amber-950"
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-bold">{al.message}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">{al.timestamp}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Botón de Refresco Manual */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold text-xs transition flex items-center gap-1.5"
            title="Sincronizar ahora con Firestore"
          >
            <RefreshCw className={`w-4 h-4 text-zinc-600 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
            <span className="hidden sm:inline">Sincronizar</span>
          </button>

          {/* Exportar a CSV */}
          <button
            onClick={handleExportCSV}
            disabled={usuarios.length === 0}
            className="px-4 py-2.5 bg-[#0F3A1D] hover:bg-emerald-800 text-[#FABF08] font-bold rounded-xl text-xs transition shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* METRICAS Y RESUMEN GENERAL (CONTADORES POR ROL) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total */}
        <button
          onClick={() => { setRoleFilter("todos"); setStatusFilter("todos"); }}
          className={`p-4 rounded-2xl border text-left transition transform active:scale-95 ${
            roleFilter === "todos" && statusFilter === "todos"
              ? "bg-zinc-900 text-white border-zinc-900 shadow-md"
              : "bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300 shadow-xs"
          }`}
        >
          <div className="text-[11px] font-black uppercase tracking-wider opacity-70 mb-1">Total Usuarios</div>
          <div className="text-2xl font-black">{stats.total}</div>
          <div className="text-[10px] opacity-60 mt-0.5">En base de datos</div>
        </button>

        {/* Clientes */}
        <button
          onClick={() => setRoleFilter("cliente")}
          className={`p-4 rounded-2xl border text-left transition transform active:scale-95 ${
            roleFilter === "cliente"
              ? "bg-emerald-700 text-white border-emerald-700 shadow-md"
              : "bg-white text-zinc-900 border-zinc-200 hover:border-emerald-300 shadow-xs"
          }`}
        >
          <div className="text-[11px] font-black uppercase tracking-wider text-emerald-600 mb-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>Clientes</span>
          </div>
          <div className="text-2xl font-black text-emerald-800">{stats.clientes}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Compradores</div>
        </button>

        {/* Repartidores */}
        <button
          onClick={() => setRoleFilter("repartidor")}
          className={`p-4 rounded-2xl border text-left transition transform active:scale-95 ${
            roleFilter === "repartidor"
              ? "bg-amber-600 text-white border-amber-600 shadow-md"
              : "bg-white text-zinc-900 border-zinc-200 hover:border-amber-300 shadow-xs"
          }`}
        >
          <div className="text-[11px] font-black uppercase tracking-wider text-amber-600 mb-1 flex items-center gap-1">
            <Bike className="w-3.5 h-3.5" />
            <span>Repartidores</span>
          </div>
          <div className="text-2xl font-black text-amber-700">{stats.repartidores}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Conductores / Motos</div>
        </button>

        {/* Tiendas / Negocios */}
        <button
          onClick={() => setRoleFilter("negocio")}
          className={`p-4 rounded-2xl border text-left transition transform active:scale-95 ${
            roleFilter === "negocio"
              ? "bg-purple-700 text-white border-purple-700 shadow-md"
              : "bg-white text-zinc-900 border-zinc-200 hover:border-purple-300 shadow-xs"
          }`}
        >
          <div className="text-[11px] font-black uppercase tracking-wider text-purple-600 mb-1 flex items-center gap-1">
            <Store className="w-3.5 h-3.5" />
            <span>Tiendas</span>
          </div>
          <div className="text-2xl font-black text-purple-800">{stats.negocios}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Comercios / Socios</div>
        </button>

        {/* Completados */}
        <button
          onClick={() => setStatusFilter("Completado")}
          className={`p-4 rounded-2xl border text-left transition transform active:scale-95 ${
            statusFilter === "Completado"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
              : "bg-white text-zinc-900 border-zinc-200 hover:border-emerald-300 shadow-xs"
          }`}
        >
          <div className="text-[11px] font-black uppercase tracking-wider text-emerald-600 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completados</span>
          </div>
          <div className="text-2xl font-black text-emerald-700">{stats.completados}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Documentos OK</div>
        </button>

        {/* Pendientes */}
        <button
          onClick={() => setStatusFilter("Pendiente de Documentos")}
          className={`p-4 rounded-2xl border text-left transition transform active:scale-95 ${
            statusFilter === "Pendiente de Documentos"
              ? "bg-red-600 text-white border-red-600 shadow-md"
              : "bg-white text-zinc-900 border-zinc-200 hover:border-red-300 shadow-xs"
          }`}
        >
          <div className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Pendientes</span>
          </div>
          <div className="text-2xl font-black text-red-700">{stats.pendientes}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Faltan documentos</div>
        </button>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="bg-white p-4 rounded-3xl border border-zinc-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Input de Búsqueda */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo, teléfono, ID de documento, placa o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0F3A1D] transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtro Rol */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setRoleFilter("todos")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                roleFilter === "todos" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Todos ({stats.total})
            </button>
            <button
              onClick={() => setRoleFilter("cliente")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                roleFilter === "cliente" ? "bg-white text-emerald-800 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Clientes ({stats.clientes})
            </button>
            <button
              onClick={() => setRoleFilter("repartidor")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                roleFilter === "repartidor" ? "bg-white text-amber-800 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Repartidores ({stats.repartidores})
            </button>
            <button
              onClick={() => setRoleFilter("negocio")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                roleFilter === "negocio" ? "bg-white text-purple-800 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Tiendas ({stats.negocios})
            </button>
          </div>

          {/* Filtro Estatus */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 outline-none cursor-pointer"
          >
            <option value="todos">Todos los Estatus</option>
            <option value="Completado">Estatus: Completado</option>
            <option value="Pendiente de Documentos">Estatus: Pendiente de Documentos</option>
          </select>
        </div>
      </div>

      {/* Error Banner solo si no hay usuarios cargados */}
      {error && usuarios.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs sm:text-sm font-medium flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-lg text-xs transition shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* TABLA COMPLETA DE USUARIOS */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-zinc-900 text-white font-black text-[11px] uppercase tracking-wider border-b border-zinc-800">
                <th className="py-3.5 px-4">Usuario / Nombre</th>
                <th className="py-3.5 px-4">Contacto</th>
                <th className="py-3.5 px-4 text-center">Rol</th>
                <th className="py-3.5 px-4">Operación / Vehículo</th>
                <th className="py-3.5 px-4 text-center">Estatus</th>
                <th className="py-3.5 px-4">Documentos & Fotografías</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading && usuarios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                      <span className="text-xs font-bold text-zinc-500">Conectando con Firestore en tiempo real...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsuarios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-zinc-300" />
                      <span className="text-sm font-bold text-zinc-600">No se encontraron usuarios</span>
                      <span className="text-xs text-zinc-400">
                        {searchTerm ? "Prueba cambiando los términos de búsqueda o filtros." : "Esperando registros en la colección 'users' / 'usuarios' de Firestore."}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsuarios.map((u) => {
                  // Encuentra foto de perfil si existe
                  const profileDoc = u.documentos.find((d) => d.tipo.toLowerCase().includes("perfil") || d.tipo.toLowerCase().includes("avatar"));

                  return (
                    <tr key={u.id} className="hover:bg-zinc-50/80 transition-colors">
                      {/* Nombre y Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {profileDoc && profileDoc.url ? (
                            <img
                              src={profileDoc.url}
                              alt={u.nombre}
                              className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                              u.rol === "cliente"
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                : u.rol === "repartidor"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-purple-100 text-purple-900 border border-purple-300"
                            }`}>
                              {u.nombre.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                              <span>{u.nombre}</span>
                              {u.rankLevel && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-black">
                                  {u.rankLevel}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                              <span>ID: {u.id.substring(0, 14)}...</span>
                              <button
                                onClick={() => copyToClipboard(u.id, `id-${u.id}`)}
                                title="Copiar ID"
                                className="text-zinc-400 hover:text-zinc-600"
                              >
                                {copiedField === `id-${u.id}` ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contacto */}
                      <td className="py-3.5 px-4 font-medium text-zinc-700">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-xs">
                            <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
                            <span className="truncate max-w-[160px]">{u.correo}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-zinc-500">
                            <Phone className="w-3 h-3 text-zinc-400 shrink-0" />
                            <span>{u.telefono}</span>
                          </div>
                        </div>
                      </td>

                      {/* Rol */}
                      <td className="py-3.5 px-4 text-center">
                        {u.rol === "cliente" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <User className="w-3 h-3" />
                            Cliente
                          </span>
                        )}
                        {u.rol === "repartidor" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <Bike className="w-3 h-3" />
                            Repartidor
                          </span>
                        )}
                        {u.rol === "negocio" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
                            <Store className="w-3 h-3" />
                            Tienda / Negocio
                          </span>
                        )}
                      </td>

                      {/* Operación / Vehículo / Ubicación */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {u.vehiculoTipo && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 text-zinc-800 rounded-md text-[11px] font-bold">
                              <Car className="w-3 h-3 text-zinc-600" />
                              <span className="capitalize">{u.vehiculoTipo}</span>
                              {u.placas && <span className="text-zinc-500 font-mono">({u.placas})</span>}
                            </div>
                          )}
                          {u.direccion && (
                            <div className="flex items-center gap-1 text-[11px] text-zinc-500 truncate max-w-[170px]" title={u.direccion}>
                              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                              <span className="truncate">{u.direccion}</span>
                            </div>
                          )}
                          {!u.vehiculoTipo && !u.direccion && (
                            <span className="text-zinc-400 text-xs">-</span>
                          )}
                        </div>
                      </td>

                      {/* Estatus */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {u.estatusRegistro === "Completado" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Completado (OK)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pendiente
                          </span>
                        )}
                      </td>

                      {/* Documentos & Fotografías */}
                      <td className="py-3.5 px-4">
                        {u.rol === "cliente" ? (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 w-fit">
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Completado (OK) • N/A</span>
                          </div>
                        ) : u.documentos.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {u.documentos.slice(0, 3).map((docItem, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (docItem.isImage) {
                                    setPreviewImage({ url: docItem.url, title: docItem.nombre });
                                  } else {
                                    window.open(docItem.url, "_blank");
                                  }
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold transition shadow-2xs"
                                title={`Abrir ${docItem.nombre}`}
                              >
                                {docItem.isImage ? <ImageIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                                <span className="truncate max-w-[110px]">{docItem.nombre}</span>
                              </button>
                            ))}
                            {u.documentos.length > 3 && (
                              <button
                                onClick={() => setSelectedUserModal(u)}
                                className="px-2 py-1 bg-zinc-200 text-zinc-700 rounded-lg text-xs font-bold hover:bg-zinc-300"
                              >
                                +{u.documentos.length - 3} más
                              </button>
                            )}
                          </div>
                        ) : u.documentsSubmitted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Documentos Enviados (OK)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Pendiente de Documentos
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => { setSelectedUserModal(u); setShowRawJson(false); }}
                          className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-zinc-600" />
                          <span>Ver Perfil</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer de la tabla */}
        <div className="py-3 px-6 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
          <span>
            Mostrando <strong>{filteredUsuarios.length}</strong> de <strong>{usuarios.length}</strong> usuarios en tiempo real
          </span>
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            🔒 Extracción Directa & Verificación Segura sobre Firestore
          </span>
        </div>
      </div>

      {/* MODAL DETALLES DEL USUARIO Y REVISIÓN DE DOCUMENTOS & FOTOGRAFÍAS */}
      {selectedUserModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-zinc-200 animate-in fade-in zoom-in-95">
            {/* Header del Modal */}
            <div className="p-6 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white rounded-t-3xl flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${
                  selectedUserModal.rol === "cliente" ? "bg-emerald-500 text-emerald-950" : selectedUserModal.rol === "repartidor" ? "bg-amber-400 text-amber-950" : "bg-purple-400 text-purple-950"
                }`}>
                  {selectedUserModal.rol === "cliente" ? <User className="w-6 h-6" /> : selectedUserModal.rol === "repartidor" ? <Bike className="w-6 h-6" /> : <Store className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>{selectedUserModal.nombre}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-white/20 text-white">
                      {selectedUserModal.rolDisplay}
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-300">Expediente Completo & Documentación de Firestore</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserModal(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6">
              {/* Sección 1: Información General de la Cuenta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-xs">
                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-400 block mb-0.5">Correo Electrónico</span>
                  <span className="font-bold text-zinc-900 select-all">{selectedUserModal.correo}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-400 block mb-0.5">Teléfono Móvil</span>
                  <span className="font-bold text-zinc-900 select-all">{selectedUserModal.telefono}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-400 block mb-0.5">Estatus de Cuenta</span>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-black ${
                    selectedUserModal.estatusRegistro === "Completado" ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"
                  }`}>
                    {selectedUserModal.estatusRegistro}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-400 block mb-0.5">Fecha de Registro</span>
                  <span className="font-bold text-zinc-800">{selectedUserModal.fechaRegistroFormateada}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-400 block mb-0.5">Documentos Enviados</span>
                  <span className={`font-bold ${selectedUserModal.documentsSubmitted ? "text-emerald-700" : "text-zinc-600"}`}>
                    {selectedUserModal.documentsSubmitted ? "✓ Sí (documents_submitted: true)" : "No indicado"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-400 block mb-0.5">Firestore Document ID</span>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-700 truncate">
                    <span className="truncate">{selectedUserModal.id}</span>
                    <button
                      onClick={() => copyToClipboard(selectedUserModal.id, "modal-id")}
                      className="text-zinc-400 hover:text-zinc-700"
                      title="Copiar ID"
                    >
                      {copiedField === "modal-id" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sección 2: Galería de Fotografías, Identificaciones y Documentos Oficiales */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-black text-zinc-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Documentos, Fotografías e Identificaciones Oficiales ({selectedUserModal.documentos.length})</span>
                  </h4>
                </div>

                {selectedUserModal.documentos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedUserModal.documentos.map((docItem, idx) => (
                      <div
                        key={idx}
                        className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3.5 space-y-3 hover:border-emerald-500 transition shadow-2xs"
                      >
                        {/* Header del documento */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl shrink-0">
                              {docItem.isImage ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-black text-zinc-900 truncate">{docItem.nombre}</div>
                              <div className="text-[10px] text-zinc-400 font-mono truncate">{docItem.tipo}</div>
                            </div>
                          </div>
                        </div>

                        {/* Thumbnail si es imagen */}
                        {docItem.isImage && (
                          <div
                            onClick={() => setPreviewImage({ url: docItem.url, title: docItem.nombre })}
                            className="relative h-36 w-full rounded-xl bg-zinc-200 overflow-hidden cursor-pointer group border border-zinc-200"
                          >
                            <img
                              src={docItem.url}
                              alt={docItem.nombre}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                              <Eye className="w-4 h-4" />
                              <span>Ampliar Imagen</span>
                            </div>
                          </div>
                        )}

                        {/* Botones de acción */}
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-200/60">
                          <button
                            onClick={() => copyToClipboard(docItem.url, `doc-url-${idx}`)}
                            className="px-2.5 py-1 text-[11px] text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 rounded-lg flex items-center gap-1"
                          >
                            {copiedField === `doc-url-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>Copiar Enlace</span>
                          </button>

                          <a
                            href={docItem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-[#0F3A1D] hover:bg-emerald-800 text-[#FABF08] rounded-lg text-xs font-bold flex items-center gap-1 transition"
                          >
                            <span>Abrir Original</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-zinc-600 text-xs">
                    {selectedUserModal.rol === "cliente" ? (
                      <p>Los usuarios registrados como <strong>Cliente</strong> no requieren subir documentación para operar.</p>
                    ) : (
                      <p className="text-red-700 font-bold">⚠️ Este usuario ({selectedUserModal.rolDisplay}) no tiene URLs o fotografías de documentos registradas en Firestore.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Sección 3: Datos de Vehículo y Operación (si existen) */}
              {(selectedUserModal.vehiculoTipo || selectedUserModal.placas || selectedUserModal.pin) && (
                <div>
                  <h4 className="text-sm font-black text-zinc-900 mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4 text-amber-600" />
                    <span>Datos de Vehículo y Seguridad Operativa</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-amber-50/60 border border-amber-200 p-4 rounded-2xl text-xs">
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-800/70 block mb-0.5">Tipo de Vehículo</span>
                      <span className="font-black text-amber-950 capitalize">{selectedUserModal.vehiculoTipo || "No especificado"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-800/70 block mb-0.5">Placas de Circulación</span>
                      <span className="font-mono font-bold text-amber-950">{selectedUserModal.placas || "No registradas"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-800/70 block mb-0.5">PIN de Seguridad</span>
                      <span className="font-mono font-bold text-amber-950">{selectedUserModal.pin || "No configurado"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sección 4: Datos Bancarios & Openpay (si existen) */}
              {(selectedUserModal.bankName || selectedUserModal.openpayClabe || selectedUserModal.openpayAccountHolderName) && (
                <div>
                  <h4 className="text-sm font-black text-zinc-900 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Datos Bancarios & Cuenta Openpay</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl text-xs">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-800/70 block mb-0.5">Institución Bancaria</span>
                      <span className="font-black text-emerald-950">{selectedUserModal.bankName || "No especificado"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-800/70 block mb-0.5">CLABE Interbancaria</span>
                      <span className="font-mono font-bold text-emerald-950 select-all">{selectedUserModal.openpayClabe || "No registrada"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-800/70 block mb-0.5">Titular de la Cuenta</span>
                      <span className="font-bold text-emerald-950">{selectedUserModal.openpayAccountHolderName || selectedUserModal.nombre}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sección 5: Dirección & Ubicación Geográfica */}
              {(selectedUserModal.direccion || selectedUserModal.lat !== undefined) && (
                <div>
                  <h4 className="text-sm font-black text-zinc-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>Dirección & Coordenadas GPS</span>
                  </h4>
                  <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl text-xs space-y-2">
                    {selectedUserModal.direccion && (
                      <div>
                        <span className="text-[10px] font-black uppercase text-zinc-400 block mb-0.5">Dirección Registrada</span>
                        <span className="font-bold text-zinc-900">{selectedUserModal.direccion}</span>
                      </div>
                    )}
                    {selectedUserModal.lat !== undefined && selectedUserModal.lng !== undefined && (
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
                        <div className="font-mono text-zinc-600 text-[11px]">
                          Lat: {selectedUserModal.lat}, Lng: {selectedUserModal.lng}
                        </div>
                        <a
                          href={`https://www.google.com/maps?q=${selectedUserModal.lat},${selectedUserModal.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Ver en Google Maps</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sección 6: Inspección de Documento Bruto JSON */}
              <div className="border-t border-zinc-200 pt-4">
                <button
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5"
                >
                  <Code className="w-4 h-4" />
                  <span>{showRawJson ? "Ocultar Documento Firestore Bruto (JSON)" : "Inspeccionar Documento Firestore Bruto (JSON)"}</span>
                </button>

                {showRawJson && (
                  <pre className="mt-3 p-4 bg-zinc-950 text-emerald-400 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-60 border border-zinc-800">
                    {JSON.stringify(selectedUserModal.raw, null, 2)}
                  </pre>
                )}
              </div>

              {/* Botón de Cierre */}
              <div className="flex justify-end pt-2 border-t border-zinc-100">
                <button
                  onClick={() => setSelectedUserModal(null)}
                  className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition"
                >
                  Cerrar Expediente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PREVISUALIZACIÓN DE FOTOGRAFÍA / IMAGEN AMPLIADA */}
      {previewImage && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <span className="font-bold text-sm">{previewImage.title}</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewImage.url}
              alt={previewImage.title}
              className="max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl border border-white/20"
              referrerPolicy="no-referrer"
            />
            <div className="mt-3 flex items-center gap-3">
              <a
                href={previewImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <span>Abrir en Nueva Pestaña</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

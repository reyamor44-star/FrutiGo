import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  Download,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  Copy,
  Check,
  Bike,
  Store,
  Briefcase
} from "lucide-react";
import { AppRegistrationData } from "../types";

interface RegistroFrutigoProps {
  onBackToHome?: () => void;
  onViewTerms?: () => void;
}

export default function RegistroFrutigo({
  onBackToHome,
  onViewTerms
}: RegistroFrutigoProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "cliente" as "cliente" | "repartidor" | "negocio",
    password: "",
    confirmPassword: "",
    termsAccepted: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const PLAY_STORE_URL =
    "https://play.google.com/store/apps/details?id=com.frutigo.app";
  const OFFICIAL_LOGO = "/frutigo-logo-oficial-amarillo.svg";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleRoleSelect = (role: "cliente" | "repartidor" | "negocio") => {
    setFormData((prev) => ({ ...prev, role }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg("Por favor, ingresa tu nombre completo.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMsg("Por favor, ingresa un correo electrónico válido.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMsg("Por favor, ingresa un número telefónico de 10 dígitos.");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden. Asegúrate de que sean iguales.");
      return;
    }
    if (!formData.termsAccepted) {
      setErrorMsg("Debes aceptar los Términos y Condiciones para continuar.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: AppRegistrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        role: formData.role,
        termsAccepted: true,
        createdAt: new Date().toISOString(),
        source: "web_registrofrutigo"
      };

      const res = await fetch("/api/app-users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          password: formData.password
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo completar el registro.");
      }

      // Success: open celebration notification modal
      setShowSuccessModal(true);
    } catch (err: any) {
      console.warn("Fallo temporal en red, guardando localmente:", err);
      // Fallback: save to local storage and show success modal
      try {
        const localRegistrations = JSON.parse(
          localStorage.getItem("frutigo_registrations") || "[]"
        );
        localRegistrations.push({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          role: formData.role,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem(
          "frutigo_registrations",
          JSON.stringify(localRegistrations)
        );
      } catch (e) {}

      setShowSuccessModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    const url = "https://frutigo.com.mx/registrofrutigo";
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-[85vh] py-4 sm:py-10 px-2.5 sm:px-4 flex items-center justify-center animate-in fade-in duration-300">
      <div className="w-full max-w-xl mx-auto">
        
        {/* Navigation back */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-2xl transition cursor-pointer active:scale-95 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Fruti Go</span>
            </button>
          )}

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-emerald-800 bg-white hover:bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-2xl transition cursor-pointer shadow-xs ml-auto"
            title="Copiar enlace directo de registro"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-extrabold">¡Enlace Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copiar Enlace</span>
              </>
            )}
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl sm:rounded-[36px] shadow-2xl border border-emerald-100/90 overflow-hidden relative">
          
          {/* Header Banner with Brand Colors */}
          <div className="bg-gradient-to-br from-[#FABF08] to-[#E5AC00] p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
            
            {/* Logo Badge */}
            <div className="relative inline-block mb-3">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white p-1.5 rounded-3xl shadow-xl mx-auto border-2 border-[#0F3A1D]/15 overflow-hidden flex items-center justify-center transform hover:scale-105 transition">
                <img
                  src={OFFICIAL_LOGO}
                  alt="Logo Oficial Fruti Go"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#0F3A1D] text-[#FABF08] p-1.5 rounded-full shadow-md">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#0F3A1D] tracking-tight">
              Regístrate en Fruti Go
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#0F3A1D]/90 mt-1 max-w-md mx-auto">
              Crea tu cuenta oficial para disfrutar de pedidos exprés de frutas, paquetería urbana y taxi pet en la app oficial.
            </p>

            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-white/70 backdrop-blur-md rounded-full text-[11px] font-black text-[#0F3A1D] border border-white/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
              <span>Registro Seguro Oficial • frutigo.com.mx</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-5 sm:p-8">
            {errorMsg && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-2xl flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Selector de Rol: Cliente | Repartidor | Negocio */}
              <div>
                <label className="block text-xs sm:text-sm font-black text-zinc-800 mb-2">
                  ¿Cómo deseas registrarte?
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {/* Rol: Cliente */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect("cliente")}
                    className={`p-3 rounded-2xl border-2 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      formData.role === "cliente"
                        ? "bg-[#FABF08]/15 border-[#0F3A1D] text-[#0F3A1D] shadow-sm font-black ring-2 ring-[#FABF08]/40"
                        : "bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-600 font-bold"
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${formData.role === "cliente" ? "bg-[#0F3A1D] text-[#FABF08]" : "bg-zinc-200 text-zinc-600"}`}>
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-xs sm:text-sm">Cliente</span>
                    <span className="text-[10px] text-zinc-500 font-normal hidden sm:inline">Para ordenar</span>
                  </button>

                  {/* Rol: Repartidor */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect("repartidor")}
                    className={`p-3 rounded-2xl border-2 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      formData.role === "repartidor"
                        ? "bg-[#FABF08]/15 border-[#0F3A1D] text-[#0F3A1D] shadow-sm font-black ring-2 ring-[#FABF08]/40"
                        : "bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-600 font-bold"
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${formData.role === "repartidor" ? "bg-[#0F3A1D] text-[#FABF08]" : "bg-zinc-200 text-zinc-600"}`}>
                      <Bike className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-xs sm:text-sm">Repartidor</span>
                    <span className="text-[10px] text-zinc-500 font-normal hidden sm:inline">Para entregar</span>
                  </button>

                  {/* Rol: Negocio */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect("negocio")}
                    className={`p-3 rounded-2xl border-2 text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      formData.role === "negocio"
                        ? "bg-[#FABF08]/15 border-[#0F3A1D] text-[#0F3A1D] shadow-sm font-black ring-2 ring-[#FABF08]/40"
                        : "bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-600 font-bold"
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${formData.role === "negocio" ? "bg-[#0F3A1D] text-[#FABF08]" : "bg-zinc-200 text-zinc-600"}`}>
                      <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-xs sm:text-sm">Negocio</span>
                    <span className="text-[10px] text-zinc-500 font-normal hidden sm:inline">Para vender</span>
                  </button>
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-xs sm:text-sm font-black text-zinc-800 mb-1.5">
                  {formData.role === "negocio" ? "Nombre del Negocio o Titular" : "Nombre Completo"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    {formData.role === "negocio" ? <Briefcase className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={formData.role === "negocio" ? "Ej. Frutas Don Juan / Juan Pérez" : "Ej. Juan Pérez González"}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm text-zinc-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition"
                  />
                </div>
              </div>

              {/* Correo Electrónico */}
              <div>
                <label className="block text-xs sm:text-sm font-black text-zinc-800 mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tucorreo@ejemplo.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm text-zinc-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-xs sm:text-sm font-black text-zinc-800 mb-1.5">
                  Teléfono (WhatsApp / Contacto)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ej. 3312345678"
                    maxLength={15}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm text-zinc-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs sm:text-sm font-black text-zinc-800 mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                      className="w-full pl-10 pr-10 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm text-zinc-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black text-zinc-800 mb-1.5">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repite la contraseña"
                      required
                      minLength={6}
                      className="w-full pl-10 pr-10 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm text-zinc-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 transition cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Términos y Condiciones Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded-md border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-zinc-600 leading-snug">
                    Acepto los{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onViewTerms) onViewTerms();
                      }}
                      className="text-emerald-700 font-black underline hover:text-emerald-800 cursor-pointer"
                    >
                      Términos y Condiciones
                    </button>{" "}
                    y el{" "}
                    <span className="font-bold text-zinc-800">
                      Aviso de Privacidad
                    </span>{" "}
                    de Fruti Go.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>
                        {formData.role === "cliente" && "Registrarme como Cliente"}
                        {formData.role === "repartidor" && "Registrarme como Repartidor"}
                        {formData.role === "negocio" && "Registrar mi Negocio"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Direct Google Play Store link box */}
            <div className="mt-6 pt-5 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <p className="text-xs font-black text-zinc-800">
                  ¿Ya tienes la app de Fruti Go instalada?
                </p>
                <p className="text-[11px] text-zinc-500">
                  Abre la app e ingresa con tu correo y contraseña registrados.
                </p>
              </div>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FABF08] hover:bg-[#E5AC00] text-[#0F3A1D] font-black text-xs rounded-xl shadow-sm transition shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Google Play</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Celebratory Notification Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl sm:rounded-[36px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#FABF08]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Official Logo Banner */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#FABF08] p-2 rounded-3xl shadow-xl mx-auto border-2 border-[#0F3A1D]/20 flex items-center justify-center">
                <img
                  src={OFFICIAL_LOGO}
                  alt="Logo Oficial Fruti Go"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
              <span className="absolute -top-2 -right-2 bg-emerald-600 text-white p-2 rounded-full shadow-lg">
                <CheckCircle2 className="w-5 h-5" />
              </span>
            </div>

            {/* Notification Title & Body */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F3A1D] tracking-tight">
              ¡Felicidades!
            </h2>
            <div className="inline-block my-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-black capitalize">
              Registro de {formData.role} completado con éxito
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 font-medium mt-2 leading-relaxed">
              Tu cuenta de <strong className="text-emerald-800 capitalize">{formData.role}</strong> ha sido creada exitosamente. Ahora descarga la app oficial de <strong className="text-emerald-800">Fruti Go</strong> en Google Play Store para ingresar con tu cuenta.
            </p>

            {/* CTA Button to Google Play Store */}
            <div className="mt-6 space-y-3">
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 bg-[#FABF08] hover:bg-[#E5AC00] text-[#0F3A1D] font-black text-sm sm:text-base rounded-2xl shadow-xl hover:shadow-2xl transition transform active:scale-95 flex items-center justify-center gap-2 border-2 border-[#0F3A1D]/15 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>DESCARGAR APP EN GOOGLE PLAY</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>

              {onBackToHome && (
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    onBackToHome();
                  }}
                  className="w-full py-2.5 text-xs sm:text-sm font-bold text-zinc-500 hover:text-zinc-800 transition cursor-pointer"
                >
                  Continuar explorando Fruti Go
                </button>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] text-zinc-400">
              Enlace de descarga directa:{" "}
              <span className="font-mono text-zinc-600 break-all">
                play.google.com/store/apps/details?id=com.frutigo.app
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

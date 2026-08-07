import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  MessageSquare
} from "lucide-react";
import { Language, UI_TRANSLATIONS } from "../translations";

interface Props {
  lang?: Language;
}

export default function AccountDeletionForm({ lang = "es" }: Props) {
  const t = UI_TRANSLATIONS[lang]?.deletionForm || UI_TRANSLATIONS.es.deletionForm;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    comments: "",
    confirm: false,
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage(
        lang === "en" ? "Please fill in all required contact fields." :
        lang === "pt" ? "Por favor, preencha todos os campos de contato obrigatórios." :
        "Por favor, completa todos los campos de contacto obligatorios."
      );
      setStatus("error");
      return;
    }

    if (!formData.comments.trim()) {
      setErrorMessage(
        lang === "en" ? "Please provide your reason for deletion and feedback." :
        lang === "pt" ? "Por favor, informe o motivo da exclusão e seus comentários." :
        "Por favor, dinos el motivo de eliminación y tus comentarios de mejora."
      );
      setStatus("error");
      return;
    }

    if (!formData.confirm) {
      setErrorMessage(
        lang === "en" ? "You must confirm that you want to permanently delete your data." :
        lang === "pt" ? "Você deve confirmar que deseja excluir permanentemente seus dados." :
        "Debes confirmar que deseas que eliminemos permanentemente tus datos."
      );
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/deletion-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error");
      }

      setStatus("success");
    } catch (err: any) {
      setErrorMessage(
        err.message || 
        (lang === "en" ? "Error connecting to the server. Please try again." :
         lang === "pt" ? "Erro ao conectar com o servidor. Tente novamente." :
         "Error al conectar con el servidor. Inténtalo de nuevo.")
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center py-12 px-4 relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-8 border border-emerald-200"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        
        <h2 className="text-3xl font-black italic tracking-tight text-brand-green mb-4">
          {t.successTitle}
        </h2>
        
        <p className="text-zinc-600 font-medium max-w-lg leading-relaxed mb-6">
          {t.successDesc}
        </p>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 text-amber-900 max-w-md shadow-lg shadow-amber-500/5 mb-8">
          <p className="text-sm font-bold leading-relaxed">
            {t.successAlert}
          </p>
        </div>

        <p className="text-xs text-zinc-400 font-mono">
          {t.successContact} <span className="font-bold underline text-brand-green">frutigo33@gmail.com</span>
        </p>
      </motion.div>
    );
  }

  return (
    <div className="relative z-10">
      {/* Block Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter text-brand-green mb-2">
          {t.title}
        </h2>
        <p className="text-zinc-500 text-sm font-medium">
          {t.subtitle}
        </p>
      </div>

      {/* Warning Policy Box */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl p-5 mb-8 text-amber-900 flex gap-4 items-start shadow-sm">
        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm font-bold leading-relaxed">
          {t.warning}
        </div>
      </div>

      {/* Grid: Form and Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="md:col-span-8 space-y-6">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-bold flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
              {errorMessage}
            </div>
          )}

          {/* Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-2">{t.fullName}</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-brand-green font-medium text-zinc-800 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-2">{t.email}</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder={t.emailPlaceholder}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-brand-green font-medium text-zinc-800 transition"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-2">{t.phone}</label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                  placeholder={t.phonePlaceholder}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-brand-green font-medium text-zinc-800 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-2">{t.reason}</label>
              <div className="relative">
                <FileText className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData(p => ({ ...p, reason: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-brand-green font-medium text-zinc-800 transition appearance-none"
                >
                  <option value="">{t.selectReason}</option>
                  <option value={t.reasons.noUse}>{t.reasons.noUse}</option>
                  <option value={t.reasons.privacy}>{t.reasons.privacy}</option>
                  <option value={t.reasons.technical}>{t.reasons.technical}</option>
                  <option value={t.reasons.moved}>{t.reasons.moved}</option>
                  <option value={t.reasons.other}>{t.reasons.other}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Custom Text Area */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-2">
              {t.commentsLabel}
            </label>
            <div className="relative">
              <MessageSquare className="w-5 h-5 absolute left-4 top-4 text-zinc-400" />
              <textarea
                required
                rows={4}
                value={formData.comments}
                onChange={(e) => setFormData(p => ({ ...p, comments: e.target.value }))}
                placeholder={t.commentsPlaceholder}
                className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-brand-green font-medium text-zinc-800 transition leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Confirm Checkbox */}
          <label className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl cursor-pointer select-none hover:bg-zinc-100/50 transition">
            <input
              type="checkbox"
              checked={formData.confirm}
              onChange={(e) => setFormData(p => ({ ...p, confirm: e.target.checked }))}
              className="mt-1 accent-brand-green w-4 h-4"
            />
            <span className="text-xs text-zinc-600 font-semibold leading-relaxed">
              {t.confirmCheckbox}
            </span>
          </label>

          {/* Submit button */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-brand-green text-brand-yellow font-black py-4 px-6 rounded-2xl shadow-lg shadow-brand-green/10 flex items-center justify-center gap-2 hover:bg-brand-black transition disabled:opacity-50 text-base"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> {t.submitting}
              </>
            ) : (
              <>
                {t.submitButton} <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Contact Info Column */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-brand-black text-sm uppercase tracking-wider mb-4 text-zinc-400">
              {t.contactTitle}
            </h3>
            
            <p className="text-xs text-zinc-500 leading-relaxed mb-6 font-medium">
              {t.contactDesc}
            </p>

            <div className="space-y-4 font-bold text-sm">
              <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-zinc-100">
                <div className="w-10 h-10 bg-brand-green/5 rounded-xl flex items-center justify-center text-brand-green">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">{t.emailLabel}</span>
                  <a href="mailto:frutigo33@gmail.com" className="text-zinc-700 hover:text-brand-green truncate">
                    frutigo33@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-zinc-100">
                <div className="w-10 h-10 bg-brand-green/5 rounded-xl flex items-center justify-center text-brand-green">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">{t.phoneLabel}</span>
                  <a href="tel:3317093598" className="text-zinc-700 hover:text-brand-green">
                    3317093598
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-zinc-200/60 text-[10px] text-zinc-400 leading-normal font-medium text-center whitespace-pre-line">
              {t.hours}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

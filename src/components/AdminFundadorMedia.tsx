import React, { useState, useEffect, ChangeEvent } from "react";
import { 
  Upload, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Youtube, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Eye, 
  FileText, 
  Sparkles,
  Search,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { mediaService, FounderMediaItem, extractYouTubeId } from "../services/mediaService";

const DEFAULT_ALT_TEXT = "Alberto Reyes Sandoval - Fundador de Fruti Go";

export default function AdminFundadorMedia() {
  const [items, setItems] = useState<FounderMediaItem[]>([]);
  const [filterType, setFilterType] = useState<"all" | "image" | "video" | "youtube">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | "youtube">("image");
  const [mediaUrl, setMediaUrl] = useState("");
  const [altText, setAltText] = useState(DEFAULT_ALT_TEXT);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  // Feedback & Editing State
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAltText, setEditAltText] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    setItems(mediaService.getFounderMedia());
    const unsubscribe = mediaService.subscribe(() => {
      setItems(mediaService.getFounderMedia());
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setFeedback({
        type: "error",
        message: "El archivo es demasiado grande. Por favor selecciona un archivo menor a 15MB o usa enlace de YouTube."
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      setFilePreview(result);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }

      // Upload file to server to obtain permanent static URL
      try {
        setFeedback({ type: "success", message: "Subiendo archivo multimedia al servidor..." });
        const res = await fetch("/api/founder/upload-media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileBase64: result, fileName: file.name })
        });
        const data = await res.json();
        if (data.success && data.url) {
          setMediaUrl(data.url);
          setFeedback({ type: "success", message: "¡Archivo multimedia guardado en el servidor con URL estática!" });
        } else {
          setMediaUrl(result);
        }
      } catch (err) {
        console.error("Error al subir media a servidor:", err);
        setMediaUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!title.trim()) {
      setFeedback({ type: "error", message: "El título es obligatorio." });
      return;
    }

    if (!mediaUrl.trim()) {
      setFeedback({ type: "error", message: "Debes subir un archivo o ingresar una URL de medio válida." });
      return;
    }

    let ytId: string | undefined = undefined;
    if (mediaType === "youtube") {
      const extracted = extractYouTubeId(mediaUrl);
      if (!extracted) {
        setFeedback({ type: "error", message: "La URL de YouTube ingresada no es válida. Ejemplo: https://www.youtube.com/watch?v=..." });
        return;
      }
      ytId = extracted;
    }

    try {
      mediaService.addFounderMedia({
        title: title.trim(),
        description: description.trim(),
        type: mediaType,
        url: mediaUrl,
        youtubeId: ytId,
        altText: altText.trim() || DEFAULT_ALT_TEXT
      });

      // Reset Form
      setTitle("");
      setDescription("");
      setMediaType("image");
      setMediaUrl("");
      setFilePreview(null);
      setAltText(DEFAULT_ALT_TEXT);

      setFeedback({
        type: "success",
        message: "Elemento multimedia guardado correctamente en la galería oficial."
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setFeedback({
        type: "error",
        message: "Ocurrió un error al guardar el elemento multimedia."
      });
    }
  };

  const handleStartEdit = (item: FounderMediaItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditAltText(item.altText);
    setEditDescription(item.description);
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    mediaService.updateFounderMedia(id, {
      title: editTitle.trim(),
      altText: editAltText.trim() || DEFAULT_ALT_TEXT,
      description: editDescription.trim()
    });
    setEditingId(null);
    setFeedback({
      type: "success",
      message: "Cambios guardados exitosamente."
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = (id: string, itemTitle: string) => {
    if (window.confirm(`¿Estás seguro de eliminar "${itemTitle}" de la galería oficial del fundador?`)) {
      mediaService.deleteFounderMedia(id);
      setFeedback({
        type: "success",
        message: "Elemento eliminado de la galería."
      });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filterType === "all" || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.altText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 bg-zinc-50 p-4 sm:p-6 lg:p-8 rounded-3xl border border-zinc-200 shadow-sm max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Panel Privado de Contenido SEO
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Gestión de Galería Multimedia / <span className="text-emerald-700">Fundador</span>
          </h2>
          <p className="text-sm text-zinc-600 mt-1">
            Administra las fotos, videos y recursos indexables de <strong className="text-zinc-800">Alberto Reyes Sandoval</strong> (Creador, Desarrollador Principal y Fundador de Fruti Go).
          </p>
        </div>

        <a
          href="/fundador"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition duration-200 shrink-0"
        >
          <Eye className="w-4 h-4" />
          Ver Vista Pública (/fundador)
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>

      {/* Alert / Feedback message */}
      {feedback && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm font-semibold transition-all ${
          feedback.type === "success" 
            ? "bg-emerald-50 border-emerald-300 text-emerald-900" 
            : "bg-red-50 border-red-300 text-red-900"
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? <Check className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* FORM: Add New Media */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-lg font-extrabold text-zinc-900">
          <Plus className="w-5 h-5 text-emerald-600" />
          <h3>Agregar Nuevo Contenido Multimedia</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Media Type Selector */}
          <div>
            <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider mb-2">
              Tipo de Medio
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => { setMediaType("image"); setMediaUrl(""); setFilePreview(null); }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                  mediaType === "image"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Imagen Local / Archivo
              </button>

              <button
                type="button"
                onClick={() => { setMediaType("video"); setMediaUrl(""); setFilePreview(null); }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                  mediaType === "video"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                }`}
              >
                <VideoIcon className="w-4 h-4" />
                Video Local / MP4
              </button>

              <button
                type="button"
                onClick={() => { setMediaType("youtube"); setMediaUrl(""); setFilePreview(null); }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                  mediaType === "youtube"
                    ? "border-red-600 bg-red-50 text-red-900 shadow-sm"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                }`}
              >
                <Youtube className="w-4 h-4 text-red-600" />
                Video de YouTube (URL)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider mb-1.5">
                Título del Contenido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Alberto Reyes Sandoval liderando la innovación en Fruti Go"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
                required
              />
            </div>

            {/* Alt Text (SEO) */}
            <div>
              <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider mb-1.5">
                Texto Alternativo SEO (alt text) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder={DEFAULT_ALT_TEXT}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
                required
              />
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Etiqueta HTML <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-700 font-mono">alt="..."</code> optimizada para Google Imágenes y lectores de pantalla.
              </span>
            </div>
          </div>

          {/* Media Input: File Upload OR YouTube URL */}
          <div>
            <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider mb-1.5">
              {mediaType === "youtube" ? "Enlace de YouTube (URL / ID)" : "Archivo de Medio (Subir o Enlace)"} <span className="text-red-500">*</span>
            </label>

            {mediaType === "youtube" ? (
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                required
              />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-sm border border-zinc-300 cursor-pointer transition">
                    <Upload className="w-4 h-4 text-emerald-700" />
                    Seleccionar Archivo Local
                    <input
                      type="file"
                      accept={mediaType === "image" ? "image/*" : "video/*"}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-zinc-500 font-medium">o ingresa la URL directa abajo:</span>
                </div>

                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(e) => {
                    setMediaUrl(e.target.value);
                    setFilePreview(e.target.value);
                  }}
                  placeholder={mediaType === "image" ? "https://ejemplo.com/foto.jpg o data:image/..." : "https://ejemplo.com/video.mp4"}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider mb-1.5">
              Descripción o Biografía Corta
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Detalles adicionales sobre esta foto o video del fundador Alberto Reyes Sandoval..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            />
          </div>

          {/* Media Preview Box */}
          {mediaUrl && (
            <div className="p-4 rounded-xl bg-zinc-100 border border-zinc-200 flex flex-col sm:flex-row items-center gap-4">
              <span className="text-xs font-bold text-zinc-600 uppercase">Vista Previa:</span>
              <div className="max-w-md max-h-64 rounded-xl overflow-hidden border border-zinc-300 bg-zinc-950 p-2 flex items-center justify-center">
                {mediaType === "image" && (
                  <img src={mediaUrl} alt={altText} className="max-h-56 max-w-full object-contain rounded" />
                )}
                {mediaType === "video" && (
                  <video src={mediaUrl} controls className="max-h-36 max-w-full" />
                )}
                {mediaType === "youtube" && (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(mediaUrl)}`}
                    title={title || "YouTube Preview"}
                    className="w-48 h-28 border-0"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Publicar en Galería del Fundador
          </button>
        </form>
      </div>

      {/* LIST / CONTROL TABLE */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-zinc-900">
              Elementos Publicados ({filteredItems.length})
            </h3>
            <p className="text-xs text-zinc-500">Edita títulos, atributos SEO o elimina publicaciones.</p>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título o alt text..."
                className="pl-9 pr-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 w-48 sm:w-60"
              />
            </div>

            <div className="flex items-center rounded-lg border border-zinc-200 p-0.5 bg-zinc-50">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${filterType === "all" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-800"}`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType("image")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${filterType === "image" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-800"}`}
              >
                Fotos
              </button>
              <button
                onClick={() => setFilterType("video")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${filterType === "video" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-800"}`}
              >
                Videos
              </button>
              <button
                onClick={() => setFilterType("youtube")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${filterType === "youtube" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-800"}`}
              >
                YouTube
              </button>
            </div>
          </div>
        </div>

        {/* Table Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
            <ImageIcon className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
            <p className="font-semibold text-sm">No hay elementos multimedia registrados.</p>
            <p className="text-xs text-zinc-400 mt-0.5">Agrega fotos o videos arriba para comenzar a poblar la galería.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-100 border-b border-zinc-200 text-[11px] font-black uppercase text-zinc-600 tracking-wider">
                  <th className="p-3">Vista Previa</th>
                  <th className="p-3">Título / Descripción</th>
                  <th className="p-3">Atributo SEO (alt text)</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-xs">
                {filteredItems.map((item) => {
                  const isEditing = editingId === item.id;
                  return (
                    <tr key={item.id} className="hover:bg-zinc-50/80 transition">
                      {/* Thumbnail */}
                      <td className="p-3 w-28">
                        <div className="w-24 h-24 rounded-xl bg-zinc-950 overflow-hidden flex items-center justify-center border border-zinc-200 relative group p-1">
                          {item.type === "image" && (
                            <img src={item.url} alt={item.altText} className="w-full h-full object-contain rounded-lg" />
                          )}
                          {item.type === "video" && (
                            <video src={item.url} className="w-full h-full object-cover" />
                          )}
                          {item.type === "youtube" && (
                            <iframe
                              src={`https://www.youtube.com/embed/${item.youtubeId}`}
                              title={item.title}
                              className="w-full h-full pointer-events-none"
                            />
                          )}
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td className="p-3 max-w-xs">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-2 py-1 rounded border border-zinc-300 font-bold text-xs"
                            />
                            <textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              rows={2}
                              className="w-full px-2 py-1 rounded border border-zinc-300 text-[11px]"
                            />
                          </div>
                        ) : (
                          <div>
                            <span className="font-extrabold text-zinc-900 block text-xs">{item.title}</span>
                            {item.description && (
                              <p className="text-zinc-500 text-[11px] line-clamp-2 mt-0.5">{item.description}</p>
                            )}
                          </div>
                        )}
                      </td>

                      {/* SEO Alt Text */}
                      <td className="p-3 max-w-xs">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editAltText}
                            onChange={(e) => setEditAltText(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-zinc-300 font-mono text-[11px]"
                          />
                        ) : (
                          <code className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-[11px] block truncate font-mono">
                            {item.altText}
                          </code>
                        )}
                      </td>

                      {/* Type Badge */}
                      <td className="p-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          item.type === "image" ? "bg-emerald-100 text-emerald-800" :
                          item.type === "video" ? "bg-blue-100 text-blue-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {item.type === "image" && <ImageIcon className="w-3 h-3" />}
                          {item.type === "video" && <VideoIcon className="w-3 h-3" />}
                          {item.type === "youtube" && <Youtube className="w-3 h-3" />}
                          {item.type}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="p-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800"
                              title="Guardar Cambios"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 rounded-lg bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                              title="Cancelar"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1.5 rounded-lg text-zinc-600 hover:text-emerald-800 hover:bg-zinc-100 transition"
                              title="Editar Atributos"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.title)}
                              className="p-1.5 rounded-lg text-zinc-600 hover:text-red-600 hover:bg-red-50 transition"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import { motion } from 'framer-motion';
import { showToast } from '../../components/Toast';
import { deleteDocument, getDocuments, uploadDocument } from '../../lib/documentsApi';
import { useAuth } from '../../contexts/AuthContext';
import type { Document, DocumentCategory, DocumentVisibility } from '../../types';

const CATEGORIES: DocumentCategory[] = ['Financial', 'Reports', 'Calendar', 'Policies', 'Forms'];

function formatSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const DocumentsManager: React.FC = () => {
  usePageTitle('Documents Manager', 'Manage the GPAA document library.');
  const { profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Reports');
  const [visibility, setVisibility] = useState<DocumentVisibility>('public');
  const [file, setFile] = useState<File | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setDocuments(await getDocuments());
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not load documents.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !profile) return;
    setUploading(true);
    try {
      await uploadDocument({ title, description, category, visibility, file, uploadedBy: profile.id });
      showToast('Document uploaded.', 'success');
      setTitle('');
      setDescription('');
      setFile(null);
      (e.target as HTMLFormElement).reset();
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not upload document.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (doc: Document) => {
    if (!window.confirm(`Delete "${doc.title}"? This can't be undone.`)) return;
    try {
      await deleteDocument(doc);
      showToast('Document deleted.', 'success');
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not delete document.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#0c0f12] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <Link to="/admin" className="text-sm font-bold text-primary hover:underline mb-2 inline-block">
            &larr; Admin Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-2 dark:text-white">Documents Manager</h1>
          <p className="text-[#617289] dark:text-gray-400 text-lg">Upload and manage the public document library.</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-6 md:p-8 mb-8"
        >
          <h2 className="text-2xl font-black mb-4 dark:text-white">Upload Document</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="doc-title" className="block font-bold mb-2 text-sm dark:text-white">Title</label>
                <input
                  id="doc-title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="doc-file" className="block font-bold mb-2 text-sm dark:text-white">File</label>
                <input
                  id="doc-file"
                  type="file"
                  required
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label htmlFor="doc-description" className="block font-bold mb-2 text-sm dark:text-white">Description</label>
              <textarea
                id="doc-description"
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="doc-category" className="block font-bold mb-2 text-sm dark:text-white">Category</label>
                <select
                  id="doc-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="doc-visibility" className="block font-bold mb-2 text-sm dark:text-white">Visibility</label>
                <select
                  id="doc-visibility"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as DocumentVisibility)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e7eb] dark:border-white/15 dark:bg-white/5 dark:text-white focus:border-primary outline-none transition-all"
                >
                  <option value="public">Public</option>
                  <option value="members">Members Only</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="bg-ghana-green text-white px-6 py-3 rounded-xl font-black hover:bg-green-dark transition-all shadow-lg disabled:opacity-60"
            >
              {uploading ? 'Uploading…' : 'Upload Document'}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-[#14181c] rounded-3xl shadow-xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-black mb-4 dark:text-white">Library</h2>
          {loading ? (
            <p className="text-[#617289] dark:text-gray-400">Loading…</p>
          ) : documents.length === 0 ? (
            <p className="text-[#617289] dark:text-gray-400">No documents yet.</p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between gap-4 border-2 border-[#f0f2f4] dark:border-white/10 rounded-xl p-4">
                  <div>
                    <p className="font-bold dark:text-white">{doc.title}</p>
                    <p className="text-sm text-[#617289] dark:text-gray-400">
                      {doc.category} · {doc.visibility === 'public' ? 'Public' : 'Members Only'} · {formatSize(doc.fileSizeBytes)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(doc)}
                    className="text-red-500 font-bold text-sm hover:underline shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentsManager;

/**
 * The admin-curated document library (public + members-only files backed
 * by Supabase Storage). Same thin-wrapper discipline as lib/authApi.ts.
 */
import { supabase } from './supabaseClient';
import type { Document, DocumentCategory, DocumentVisibility } from '../types';

function mapRow(row: {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  storage_path: string;
  file_size_bytes: number | null;
  visibility: DocumentVisibility;
  uploaded_by: string | null;
  created_at: string;
}): Document {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    storagePath: row.storage_path,
    fileSizeBytes: row.file_size_bytes,
    visibility: row.visibility,
    uploadedBy: row.uploaded_by,
    createdAt: row.created_at,
  };
}

const SELECT_COLUMNS = 'id, title, description, category, storage_path, file_size_bytes, visibility, uploaded_by, created_at';

/** Public: documents visible to the current session (RLS filters by visibility). */
export async function getDocuments(): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select(SELECT_COLUMNS)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

/** Downloads a document's file and triggers a browser save-as with its original title. */
export async function downloadDocument(doc: Document): Promise<void> {
  const { data, error } = await supabase.storage.from('documents').download(doc.storagePath);
  if (error) throw new Error(error.message);
  const url = URL.createObjectURL(data);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = doc.storagePath.split('/').pop() ?? doc.title;
  link.click();
  URL.revokeObjectURL(url);
}

/** Admin-only: upload a new document to the library. */
export async function uploadDocument(input: {
  title: string;
  description: string;
  category: DocumentCategory;
  visibility: DocumentVisibility;
  file: File;
  uploadedBy: string;
}): Promise<void> {
  const storagePath = `${input.category}/${Date.now()}-${input.file.name}`;
  const { error: uploadError } = await supabase.storage.from('documents').upload(storagePath, input.file);
  if (uploadError) throw new Error(uploadError.message);

  const { error: insertError } = await supabase.from('documents').insert({
    title: input.title,
    description: input.description,
    category: input.category,
    storage_path: storagePath,
    file_size_bytes: input.file.size,
    visibility: input.visibility,
    uploaded_by: input.uploadedBy,
  });
  if (insertError) throw new Error(insertError.message);
}

/** Admin-only: remove a document and its underlying file. */
export async function deleteDocument(doc: Document): Promise<void> {
  const { error: storageError } = await supabase.storage.from('documents').remove([doc.storagePath]);
  if (storageError) throw new Error(storageError.message);

  const { error: deleteError } = await supabase.from('documents').delete().eq('id', doc.id);
  if (deleteError) throw new Error(deleteError.message);
}

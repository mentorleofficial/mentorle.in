"use client";

import { browserSupabase } from "@/lib/supabase/browser";

// Follow-up tasks a mentor assigns after a session (the platform's session_action_items, as its mentee Tasks page
// and SessionActionItemsPanel use them). A mentee may tick an item done and attach their own files, when the
// mentor allows replies with files (mentor_allows_mentee_attachments); the database refuses anything else.
// Files go to the public `session-attachments` bucket under <session id>/<user id>/, like the platform.

export type Attachment = { name: string; url: string };

export type ActionItem = {
  id: string;
  sessionId: string;
  mentorId: string;
  title: string;
  description: string;
  dueDate: string | null; // "YYYY-MM-DD"
  done: boolean;
  completedAt: string | null;
  createdAt: string;
  mentorFiles: Attachment[];
  myFiles: Attachment[];
};

type Row = {
  id: string;
  session_id: string;
  mentor_id: string;
  title: string | null;
  description: string | null;
  due_date: string | null;
  status: string;
  completed_at: string | null;
  created_at: string;
  mentor_attachments: Attachment[] | null;
  mentee_attachments: Attachment[] | null;
};

const BUCKET = "session-attachments";
export const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

const db = () => browserSupabase();

const fromRow = (row: Row): ActionItem => ({
  id: row.id,
  sessionId: row.session_id,
  mentorId: row.mentor_id,
  title: row.title?.trim() || "Action item",
  description: row.description?.trim() ?? "",
  dueDate: row.due_date,
  done: row.status === "done",
  completedAt: row.completed_at,
  createdAt: row.created_at,
  mentorFiles: row.mentor_attachments ?? [],
  myFiles: row.mentee_attachments ?? [],
});

const pathOf = (url: string) => {
  const marker = `/${BUCKET}/`;
  const index = url.indexOf(marker);
  return index >= 0 ? decodeURIComponent(url.slice(index + marker.length).split("?")[0]) : null;
};

export const actionItemsService = {
  async listMine(userId: string): Promise<ActionItem[]> {
    const { data, error } = await db()
      .from("session_action_items")
      .select("id, session_id, mentor_id, title, description, due_date, status, completed_at, created_at, mentor_attachments, mentee_attachments")
      .eq("mentee_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`action items failed: ${error.message}`);
    return ((data ?? []) as Row[]).map(fromRow);
  },

  async setDone(id: string, done: boolean) {
    const { error } = await db()
      .from("session_action_items")
      .update({ status: done ? "done" : "open", completed_at: done ? new Date().toISOString() : null })
      .eq("id", id);
    if (error) throw new Error(`action item update failed: ${error.message}`);
  },

  // Whether each mentor lets mentees reply with files (mentees can't read mentor profiles directly).
  async filesAllowed(mentorIds: string[]) {
    const entries = await Promise.all(
      mentorIds.map(async (id) => {
        const { data } = await db().rpc("mentor_allows_mentee_attachments", { _mentor_id: id });
        return [id, Boolean(data)] as const;
      }),
    );
    return new Map(entries);
  },

  async attach(item: ActionItem, userId: string, file: File): Promise<Attachment[]> {
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${item.sessionId}/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await db().storage.from(BUCKET).upload(path, file, { contentType: file.type || undefined });
    if (error) throw new Error(`attachment upload failed: ${error.message}`);
    const files = [...item.myFiles, { name: file.name, url: db().storage.from(BUCKET).getPublicUrl(path).data.publicUrl }];
    const { error: updateError } = await db().from("session_action_items").update({ mentee_attachments: files }).eq("id", item.id);
    if (updateError) {
      await db().storage.from(BUCKET).remove([path]);
      throw new Error(`attachment save failed: ${updateError.message}`);
    }
    return files;
  },

  async detach(item: ActionItem, index: number): Promise<Attachment[]> {
    const removed = item.myFiles[index];
    const files = item.myFiles.filter((_, i) => i !== index);
    const { error } = await db().from("session_action_items").update({ mentee_attachments: files }).eq("id", item.id);
    if (error) throw new Error(`attachment remove failed: ${error.message}`);
    const path = removed && pathOf(removed.url);
    if (path) await db().storage.from(BUCKET).remove([path]);
    return files;
  },
};

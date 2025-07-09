import { supabase } from "./supabaseClient";
import type { Folder } from "../types/dashboard";

export class FileService {
  static async getFoldersByUser(userId: string): Promise<Folder[]> {
    const { data, error } = await supabase
      .from("folders")
      .select(
        `
        id,
        name,
        path,
        parent_path,
        created_at,
        updated_at,
        pages (
          id,
          title,
          slug,
          file_path,
          created_at,
          updated_at
        )
      `
      )
      .eq("user_id", userId)
      .order("path", { ascending: true });

    if (error) {
      console.error("Error fetching folders:", error);
      throw new Error("Error getting folders");
    }

    const folders: Folder[] = (data || []).map((folder: any) => ({
      id: folder.id,
      title: folder.name,
      path: folder.path,
      parentPath: folder.parent_path || "",
      isOpen: false,
      createdAt: folder.created_at ? new Date(folder.created_at) : undefined,
      updatedAt: folder.updated_at ? new Date(folder.updated_at) : undefined,
      pages: (folder.pages || []).map((page: any) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        filePath: page.file_path,
        createdAt: new Date(page.created_at),
        updatedAt: new Date(page.updated_at),
      })),
    }));

    return folders;
  }

  static async deleteFolder(userId: string, folderId: string): Promise<void> {
    const { error } = await supabase
      .from("folders")
      .delete()
      .match({ user_id: userId, id: folderId });

    if (error) {
      console.error("Error deleting folder:", error);
      throw new Error("Error deleting folder");
    }
  }

  static async createFolder(
    userId: string,
    name: string,
    parentPath = ""
  ): Promise<Folder> {
    const folderPath = parentPath ? `${parentPath}/${name}` : name;
    const { data, error } = await supabase
      .from("folders")
      .insert([
        {
          user_id: userId,
          name: name,
          path: folderPath,
          parent_path: parentPath,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating folder:", error);
      throw new Error("Error creating folder");
    }

    return {
      id: data.id,
      title: data.name,
      path: data.path,
      parentPath: data.parent_path || "",
      pages: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      isOpen: false,
    };
  }

  static async createPage(
    userId: string,
    title: string,
    slug: string,
    folderId: string
  ): Promise<any> {
    const { data, error } = await supabase
      .from("pages")
      .insert([
        {
          user_id: userId,
          title: title,
          slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
          folder_id: folderId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating page:", error);
      throw new Error("Error creating page");
    }

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      filePath: data.file_path,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

    static async getPageByUserAndFolder(userId: string, folderId?: string): Promise<any[]> {
    let query = supabase
      .from("pages")
      .select("*")
      .eq("user_id", userId);

    if (folderId) {
      query = query.eq("folder_id", folderId);
    }

    const { data, error } = await query.order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching pages:", error);
      throw new Error("Error getting pages");
    }

    return (data || []).map((page: any) => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      filePath: page.file_path,
      createdAt: new Date(page.created_at),
      updatedAt: new Date(page.updated_at),
    }));
  }
}

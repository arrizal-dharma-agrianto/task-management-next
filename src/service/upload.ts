'use server'

import { createClient } from "@/utils/supabase/server"

export async function uploadFile(file: FormData, name: string, taskId: string) {
  // console.log("Uploading file:", file, "to task ID:", taskId)
  // return 'test';
  const supabase = await createClient()
  console.log("Uploading file:", name, "to task ID:", taskId)
  const { data, error } = await supabase.storage
    .from('attachments')
    .upload(`${taskId}/${name}`, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) throw error

  const { data: publicUrl } = supabase.storage
    .from('attachments')
    .getPublicUrl(`${taskId}/${name}`)

  const fileData = file.get('file') as File
  const size: string = formatSize(fileData.size)
  
  return {
    url: publicUrl.publicUrl,
    size,
  }
}

const formatSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
}

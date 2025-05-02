"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

export default function Home() {
  const createDocuments = useMutation(api.documents.createDocument);
  const documents = useQuery(api.documents.getDocuments);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    // You may handle file upload here if your backend supports it
    // For now, we'll just send the title

    const uploadUrl = await generateUploadUrl();

    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file!.type },
      body: file,
    });

    const {storageId} = await result.json();

    await createDocuments({ title,fileId: storageId as Id<"_storage">, });

    setIsModalOpen(false);
    setTitle("");
    setFile(null);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Upload Document
        </button>

        {documents &&
    documents.map((doc: any) => (
      <div
        key={doc._id}
        className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition duration-200"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{doc.title}</h3>
        <Link className="px-4 py-2 rounded-lg bg-cyan-500" href={`/documents/${doc._id}`}>View</Link>
       
      </div>
    ))}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black text-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Document Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <input
                type="file"
                accept=".txt,.pdf,.xml,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="border p-2 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

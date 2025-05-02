"use client";
import React, { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { extractTextFromPdfUrl } from "@/lib/pdfParser";

const ChatPanel = ({ documentUrl }: { documentUrl: string }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askHuggingFace = useAction(api.documents.askHuggingFace);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnswer("");

    try {
      const documentText = await extractTextFromPdfUrl(documentUrl);
      const result = await askHuggingFace({ question, documentText });
      setAnswer(result.answer);
    } catch (err: any) {
      console.error(err);
      setAnswer("Something went wrong.");
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  return (
    <div className="w-[30vw] h-[70vh] bg-gray-500 rounded-lg overflow-hidden shadow-lg mx-3.5 flex flex-col">
      {/* Messages Display Area */}
      <div className="flex-1 p-4 overflow-y-auto text-white">
        {loading && <p>Thinking...</p>}
        {answer && (
          <div className="bg-gray-700 p-3 rounded-lg whitespace-pre-wrap">
            <strong>Answer:</strong> {answer}
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleAsk} className="p-4 border-t border-gray-400">
        <input
          required
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full h-10 p-2 border border-gray-300 rounded-md mb-2"
          placeholder="Type your question about the document..."
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-400 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Asking..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;

"use client"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {use} from "react"; 
import { Usable } from "react";
import ChatPanel from "./chat-panel";
import { useParams } from "next/navigation"; 


const DocumentPage = () => {

   // Fetch the documentId using the useParams hook
   const { documentId } = useParams();

   // Make sure documentId exists before using it
   if (!documentId) {
     return <div>Document ID is missing.</div>;
   }
  
  const document = useQuery(api.documents.getDocument, { documentId: documentId as Id<"documents"> });

  if(!document) {
    return <div>You do not have access for this file</div>
  }


  return (
    <div>
      <div className="flex flex-col justify-between items-center">
        <h1 className="text-4xl font-bold">{document?.title}</h1>

          <div className="flex flex-row ">
          <div className="w-[50vw] h-[70vh] bg-gray-200 rounded-lg overflow-hidden shadow-lg mx-3.5">
          {
            document?.documentUrl && (
              <iframe className="w-full h-full " src={document.documentUrl}/>
            )

          }
         
          
        </div>
{       document?.documentUrl &&
      <ChatPanel documentUrl={document.documentUrl}/>
}
            </div>   

      </div>
    </div>
  )
}

export default DocumentPage

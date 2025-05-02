import { action, mutation, query } from "./_generated/server";
import {ConvexError, v} from "convex/values"





export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getDocuments = query({
  async handler (ctx) {
    const userId=(await ctx.auth.getUserIdentity())?.tokenIdentifier
    if(!userId) {
      return []
    }

    return await ctx.db.query("documents").withIndex("by_tokenIdentifier",(q)=>q.eq("tokenIdentifier",userId)).collect()
  }
})

export const getDocument = query({
  args:{
    documentId: v.id("documents")
  },
  async handler (ctx, args) {
    const userId=(await ctx.auth.getUserIdentity())?.tokenIdentifier
    if(!userId) throw new ConvexError("User not authenticated")

   const document=await ctx.db.get(args.documentId)

   if(!document) throw new ConvexError("Document not found")
   
   if(document?.tokenIdentifier!==userId) throw new ConvexError("Unautohrized access")

    return {...document,documentUrl:await ctx.storage.getUrl(document?.fileId)}
  }

})


export const createDocument = mutation({
 args:{
  title: v.string(),
  fileId: v.id("_storage"),
 },
  async handler ( ctx, args ){

    const userId=(await ctx.auth.getUserIdentity())?.tokenIdentifier
    if(!userId) throw new ConvexError("User not authenticated")

   await ctx.db.insert("documents", {
    title: args.title,
    tokenIdentifier: userId,
    fileId: args.fileId,
   })
  },

})
{/*
export const askQuestion=action({
  args:{
    question: v.string(),
    documentId: v.id("documents"),
  },
  async handler (ctx, args) {
    const userId=(await ctx.auth.getUserIdentity())?.tokenIdentifier
    if(!userId) throw new ConvexError("User not authenticated")

    const document=await ctx.runQuery(api.documents.getDocument, {documentId: args.documentId})

    if(!document) throw new ConvexError("Document not found")

      const file=await ctx.storage.get(document?.fileId)
      if(!file) throw new ConvexError("File not found")

      const chatCompletion=await openai.chat.completions.create({
        messages:[{role:"user",content:`Answer the question based on the document provided. If the answer is not in the document, say "I don't know".\n\nQuestion: ${args.question}\n\nDocument: ${file}` }],
        model:"gpt-3.5-turbo",

      })

    



  } 
})
*/}

export const askHuggingFace = action({
  args: {
    question: v.string(),
    documentText: v.string(),
  },
  handler: async (ctx, { question, documentText }) => {

    const userId=(await ctx.auth.getUserIdentity())?.tokenIdentifier
    if(!userId) throw new ConvexError("User not authenticated")

  

    const HF_API_KEY = process.env.HF_API_KEY!;

if (!HF_API_KEY) throw new ConvexError("Missing Hugging Face API key in Convex environment.");

console.log("document:",documentText.slice(0, 1000))
console.log("question:",question)


    const model ="deepset/roberta-base-squad2"

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
   

      body: JSON.stringify({
        inputs: {
          question: question,
          context: documentText
        }
      }),

    });

    const rawText = await response.text();

console.log("RAW response:", rawText);

try {
  const data = JSON.parse(rawText);
  if (data.error) throw new ConvexError(data.error);
  return { answer: data.answer || "No answer received." };
} catch (err) {
  throw new ConvexError("Invalid JSON returned from Hugging Face");
}


   
  },
});





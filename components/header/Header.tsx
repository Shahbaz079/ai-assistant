"use client"
import { api } from "@/convex/_generated/api";


import { SignInButton, UserButton } from "@clerk/clerk-react"
import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";


const Header = () => {
  return (
    <div className="w-[80vw] h-15 px-2.5 py-1.5 mx-[10vw] my-[5vh] bg-cyan-800 rounded-4xl   flex flex-row items-center justify-between">
 <div className="">Second Brain</div>
 <div>
<Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <Authenticated>
        <UserButton />
        </Authenticated>      
    </div>

    </div>
   
  )
}

export default Header

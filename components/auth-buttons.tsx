"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import SignoutButton from "@/components/signout-button";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation"
import { BookDashed, Crown, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";


export default function AuthButtons() {
	const pathname = usePathname()
	const { data, isPending } = authClient.useSession();
	if (isPending) return <div>Loading...</div>;

	const session = data;

	return !session ? (
		// <div className="w-full md:w-1/2 grid justify-start md:flex gap-2 md:items-center md:justify-center md:pl-6 ">
		<div className="flex items-center gap-2 justify-start">
			<Link href="/auth/login" className="w-full ">
				<Button className="w-full">Log In</Button>
			</Link>
			<Link href="/auth/register" className="w-full ">
				<Button className="w-full">Register</Button>
			</Link>
		</div>
	) : (
		<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 justify-start">
			{/* <Image 
			src={session?.user?.image ?? '/images/placeholder.svg'} 
			alt={session?.user?.name} 
			width={12} height={12} 
			className="rounded-full w-6 h-6" 
			/> */}
			<p>{session?.user?.name.toUpperCase()}</p>
		</div>
      </DropdownMenuTrigger>
      {/* <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
           <Link href={`/profile/${session?.user?.id}`} className=" flex justify-center items-center gap-2 text-md text-gray-500 hover:underline hover:text-black">
		 		<User /> Profile
		 	</Link>
          </DropdownMenuItem>
         
          
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
		<DropdownMenuItem>
        <Link href="/subscription" className="flex justify-center items-center gap-2 text-md text-gray-500 hover:underline hover:text-black">
				<Crown className="h-4 w-4 mr-2" />
		   		<span>Membership</span>
			</Link>
			</DropdownMenuItem>
        <DropdownMenuSeparator />
       
        <DropdownMenuItem>
        <Link href="/articles" className="flex items-center gap-2 text-md text-gray-500 hover:underline hover:text-black">
		 	<BookDashed />	Articles
		 	</Link>
		</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent> */}
    </DropdownMenu>
		
	);
}

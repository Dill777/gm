// types globals.d.ts
import NextAuth, { DefaultUser } from "next-auth";
import React, { PropsWithChildren } from "react";

declare global {
  interface ExtraTWClassProps {
    className?: string;
  }

  type ComponentProps = PropsWithChildren<ExtraTWClassProps> & {
    onClick?: (e: any) => void;
  };
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      address: string;
    };
  }
  interface User extends DefaultUser {
    address: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    addressToken?: string;
    userId?: string;
  }
}

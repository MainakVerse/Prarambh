import "next-auth";
import "next-auth/jwt";

/** Module augmentation: our custom claims on Session and JWT. */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      roles: string[];
      emailVerified: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    email?: string;
    name?: string | null;
    image?: string | null;
    roles?: string[];
    emailVerified?: boolean;
  }
}

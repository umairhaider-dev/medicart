import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "medicart-dev-secret-change-in-production"
);

export interface TokenPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as unknown as TokenPayload;
}

export async function getSession(): Promise<TokenPayload | null> {
  try {
    const store = await cookies();
    const token = store.get("mc_token")?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(req: Request): Promise<TokenPayload | null> {
  try {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const match = cookieHeader.match(/mc_token=([^;]+)/);
    if (!match) return null;
    return await verifyToken(match[1]);
  } catch {
    return null;
  }
}

export function mapUser(user: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  mediCoins: number;
  memberSince: Date;
  tier: string;
  isAdmin: boolean;
  addresses?: {
    id: string;
    label: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    zip: string;
    isDefault: boolean;
  }[];
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? undefined,
    avatar: user.avatar ?? undefined,
    mediCoins: user.mediCoins,
    memberSince: user.memberSince.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    tier: user.tier.charAt(0) + user.tier.slice(1).toLowerCase() as "Silver" | "Gold" | "Platinum",
    isAdmin: user.isAdmin,
    addresses: (user.addresses ?? []).map((a) => ({
      id: a.id,
      label: a.label,
      line1: a.line1,
      line2: a.line2 ?? undefined,
      city: a.city,
      state: a.state,
      zip: a.zip,
      isDefault: a.isDefault,
    })),
    savedRx: [],
  };
}

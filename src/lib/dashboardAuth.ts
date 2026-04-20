import { createClient, User } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL?.trim() ?? process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ??
  process.env.SUPABASE_PUBLISHABLE_KEY?.trim() ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ??
  "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const normalizePassword = (password: string) => password.trim();

const getPublicAuthClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};

const getServiceClient = () => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};

export const extractBearerToken = (request: Request) => {
  const authorization = request.headers.get("authorization")?.trim() ?? "";

  if (!authorization.toLowerCase().startsWith("bearer ")) {
    return "";
  }

  return authorization.slice(7).trim();
};

type AuthResult = {
  accessToken: string;
  user: User;
};

export const loginDashboardUser = async (emailInput: string, passwordInput: string) => {
  const email = normalizeEmail(emailInput);
  const password = normalizePassword(passwordInput);

  if (!email || !password) {
    throw new Error("Email dan password wajib diisi.");
  }

  const supabase = getPublicAuthClient();

  if (!supabase) {
    throw new Error("Supabase auth belum dikonfigurasi.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session?.access_token || !data.user) {
    throw new Error("Email atau password tidak valid.");
  }

  const result: AuthResult = {
    accessToken: data.session.access_token,
    user: data.user,
  };

  return result;
};

export const registerDashboardUser = async (emailInput: string, passwordInput: string) => {
  const email = normalizeEmail(emailInput);
  const password = normalizePassword(passwordInput);

  if (!email || !password) {
    throw new Error("Email dan password wajib diisi.");
  }

  const supabase = getPublicAuthClient();

  if (!supabase) {
    throw new Error("Supabase auth belum dikonfigurasi.");
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    throw new Error("Gagal membuat akun. Coba gunakan email lain.");
  }

  if (!data.session?.access_token) {
    return {
      requiresEmailConfirmation: true,
      accessToken: "",
      user: data.user,
    };
  }

  return {
    requiresEmailConfirmation: false,
    accessToken: data.session.access_token,
    user: data.user,
  };
};

export const verifyDashboardAccessToken = async (tokenInput: string) => {
  const token = tokenInput.trim();

  if (!token) {
    return { isValid: false, user: null as User | null };
  }

  const supabase = getServiceClient();

  if (!supabase) {
    return { isValid: false, user: null as User | null };
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return { isValid: false, user: null as User | null };
  }

  return { isValid: true, user: data.user };
};

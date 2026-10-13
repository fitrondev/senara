export {};

// 4 Jenis Role Platform Senara:
// - user: Pengguna Biasa (Pasangan Pengantin / Pembuat Acara)
// - reseller: Mitra Reseller / WO / Studio White-Label
// - admin: Admin Operasional (Verifikator Pembayaran & Moderator)
// - superadmin: Super Admin Utama (Pemilik Platform & Pengelola Role/Kupon)
export type Roles = "user" | "reseller" | "admin" | "superadmin";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}

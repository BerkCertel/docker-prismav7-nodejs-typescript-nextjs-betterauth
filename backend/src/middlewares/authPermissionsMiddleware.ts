// backend/auth/permissions.ts
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

// ✅ Yetki statement'ları (custom actions ekle)
const statement = {
  ...defaultStatements, // user: ["list", "create", "update", "delete", "set-role", "ban", "impersonate", "set-password", "get"]
  // session: ["list", "revoke", "delete"]

  // ✅ Custom statement'lar ekle
  user: [
    ...defaultStatements.user,
    "unban", // ✅ Kendi unban action'ımızı ekliyoruz
  ],

  product: ["view", "create", "update", "delete", "updateStatus"],
  category: ["view", "create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

// ✅ USER ROLE
// - Sadece görüntüleme
// - Ürün statusu güncelleyebilir
export const userRole = ac.newRole({
  product: ["view", "updateStatus"], // ✅ Sadece görür ve status günceller
  category: ["view"], // ✅ Sadece görür
  user: [], // ❌ Hiçbir kullanıcı işlemi yapamaz
  session: [], // ❌ Session yönetimi yapamaz
});

// ✅ ADMIN ROLE
// - Kullanıcı oluşturma/silme HARİÇ her şeyi yapabilir
// - Product ve Category üzerinde tam yetki
export const adminRole = ac.newRole({
  product: ["view", "create", "update", "delete", "updateStatus"], // ✅ Ürünler üzerinde tam yetki
  category: ["view", "create", "update", "delete"], // ✅ Kategoriler üzerinde tam yetki
  user: ["list", "get", "ban", "unban", "set-role", "update"], // ✅ unban artık kullanılabilir
  session: ["list", "revoke"], // ✅ Session yönetimi
});

// ✅ SUPERADMIN ROLE
// - Her şeye tam yetki
export const superAdminRole = ac.newRole({
  ...adminAc.statements, // Better Auth'un tüm admin yetkileri
  product: ["view", "create", "update", "delete", "updateStatus"],
  category: ["view", "create", "update", "delete"],
  user: [
    ...adminAc.statements.user,
    "unban", // ✅ SuperAdmin için de unban ekle
  ],
});

export { statement };

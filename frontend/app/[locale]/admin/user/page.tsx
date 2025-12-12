"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Edit, Trash2, UsersIcon, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Mock data
const mockUsers = [
  {
    id: "1",
    email: "m.berkcertel@outlook.com",
    role: "SUPERADMIN",
    locations: [],
  },
  {
    id: "2",
    email: "bilgilialikemal56@gmail.com",
    role: "SUPERADMIN",
    locations: [],
  },
  {
    id: "3",
    email: "bilgilialikemal57@gmail.com",
    role: "ADMIN",
    locations: ["Odalar", "Sahil"],
  },
  {
    id: "4",
    email: "delphinkullaniciornek@gmail.com",
    role: "USER",
    locations: ["Odalar"],
  },
  {
    id: "5",
    email: "stufan@delphinhotel.com",
    role: "ADMIN",
    locations: ["Odalar", "Sahil"],
  },
];

const mockLocations = ["Odalar", "Sahil", "Pool Bar", "Lobby Bar"];
const roles = ["USER", "ADMIN", "SUPERADMIN"];

export default function UsersPage() {
  const t = useTranslations();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [users] = useState(mockUsers);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<(typeof mockUsers)[0] | null>(
    null
  );

  const handleCreate = () => {
    console.log("[v0] Creating user:", {
      email,
      password,
      role: selectedRole,
      locations: selectedLocations,
    });
    toast.success(t("common.success"));
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (user: (typeof mockUsers)[0]) => {
    setEditingUser(user);
    setEmail(user.email);
    setSelectedRole(user.role);
    setSelectedLocations(user.locations);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    console.log("[v0] Updating user:", {
      id: editingUser?.id,
      email,
      role: selectedRole,
      locations: selectedLocations,
    });
    toast.success(t("common.success"));
    setIsEditDialogOpen(false);
    setEditingUser(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    console.log("[v0] Deleting user:", id);
    toast.success("User deleted");
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setSelectedRole("");
    setSelectedLocations([]);
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === "SUPERADMIN") return "default";
    if (role === "ADMIN") return "secondary";
    return "outline";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("users.title")}
          </h1>
          <p className="text-muted-foreground">{t("users.subtitle")}</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t("users.create")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("users.create")}</DialogTitle>
              <DialogDescription>{t("users.subtitle")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("users.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@hotel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("users.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">{t("users.role")}</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder={t("users.selectRole")} />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("users.locations")}</Label>
                <div className="space-y-2 border rounded-md p-3 max-h-40 overflow-y-auto">
                  {mockLocations.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={location}
                        checked={selectedLocations.includes(location)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedLocations([
                              ...selectedLocations,
                              location,
                            ]);
                          } else {
                            setSelectedLocations(
                              selectedLocations.filter((l) => l !== location)
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={location}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button onClick={handleCreate}>{t("common.create")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("common.edit")}</DialogTitle>
            <DialogDescription>{t("users.subtitle")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">{t("users.email")}</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="admin@hotel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">{t("users.role")}</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder={t("users.selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("users.locations")}</Label>
              <div className="space-y-2 border rounded-md p-3 max-h-40 overflow-y-auto">
                {mockLocations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${location}`}
                      checked={selectedLocations.includes(location)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedLocations([
                            ...selectedLocations,
                            location,
                          ]);
                        } else {
                          setSelectedLocations(
                            selectedLocations.filter((l) => l !== location)
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`edit-${location}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={handleUpdate}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Users List */}
      {users.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <UsersIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1">
                {t("common.noData")}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {t("users.subtitle")}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card
              key={user.id}
              className="group hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{user.email}</span>
                      <Badge
                        variant={getRoleBadgeVariant(user.role)}
                        className="flex items-center gap-1"
                      >
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </Badge>
                    </div>
                    {user.locations.length > 0 ? (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {user.locations.map((location) => (
                          <Badge
                            key={location}
                            variant="outline"
                            className="text-xs"
                          >
                            {location}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("users.allLocations")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">{t("common.edit")}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">{t("common.delete")}</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

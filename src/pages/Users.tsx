// src/pages/Users.tsx
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { createUser, deleteUser, listUsers, updateUser, Role, User } from "@/services/users";

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");

  const [newUser, setNewUser] = useState<{
    name: string;
    lastName: string;
    email: string;
    role: Role;
    password: string;
  }>({
    name: "",
    lastName: "",
    email: "",
    role: "student",
    password: "",
  });

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [roleChangeTarget, setRoleChangeTarget] = useState<{ user: User; newRole: Role } | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await listUsers(roleFilter === "all" ? undefined : { role: roleFilter });
      setUsers(("users" in res) ? (res as any).users : (res as any));
    } catch (e: any) {
      toast.error(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleCreate = async () => {
    if (!newUser.name || !newUser.lastName || !newUser.email || !newUser.password) {
      toast.error("Complete name, last name, email and password");
      return;
    }
    try {
      const created = await createUser(newUser);
      toast.success("User created");
      setUsers((u) => [created, ...u]);
      setNewUser({ name: "", lastName: "", email: "", role: "student", password: "" });
    } catch (e: any) {
      toast.error(e?.message || "Error creating user");
    }
  };

  const confirmRoleChange = async () => {
    if (!roleChangeTarget) return;
    try {
      const updated = await updateUser(roleChangeTarget.user.id, { role: roleChangeTarget.newRole });
      setUsers((arr) => arr.map((u) => (u.id === roleChangeTarget.user.id ? updated : u)));
      toast.success("Role updated");
      setRoleChangeTarget(null);
    } catch (e: any) {
      toast.error(e?.message || "Error updating role");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id);
      setUsers((arr) => arr.filter((u) => u.id !== deleteTarget.id));
      toast.success("User deleted");
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e?.message || "Error deleting user");
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar />
      <SidebarInset className="bg-gray-900 text-white min-h-screen">
        <Header/>
        <div className="p-6 space-y-6">
          {/* CREATE USER */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Crear Usuario</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label>Apellido</Label>
                <Input
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Email</Label>
                <Input
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <Label>Contraseña</Label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                  placeholder="********"
                />
              </div>
              <div>
                <Label>Rol</Label>
                <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v as Role })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Estudiante</SelectItem>
                    <SelectItem value="teacher">Profesor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-6 flex justify-end">
                <Button onClick={handleCreate} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                  Crear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* LIST USERS */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Todos los Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Label>Filtrar</Label>
                <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as any)}>
                  <SelectTrigger className="w-48 bg-gray-700 border-gray-600">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="student">Estudiantes</SelectItem>
                    <SelectItem value="teacher">Profesores</SelectItem>
                    <SelectItem value="admin">Administradores</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={fetchUsers} variant="outline" className="border-gray-600 text-gray-200">
                  Refrescar
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {users.map((u) => (
                  <div key={u.id} className="p-4 rounded-xl bg-gray-900 border border-gray-700 space-y-2">
                    <div className="font-semibold">
                      {u.name} {u.lastName}
                    </div>
                    <div className="text-sm text-gray-300">{u.email}</div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={u.role}
                        onValueChange={(v) => setRoleChangeTarget({ user: u, newRole: v as Role })}
                      >
                        <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Estudiante</SelectItem>
                          <SelectItem value="teacher">Profesor</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={() => setDeleteTarget(u)} variant="destructive" className="ml-auto">
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && <div className="text-gray-400">No hay usuarios registrados.</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Modal confirmación cambio de rol */}
      <Dialog open={!!roleChangeTarget} onOpenChange={() => setRoleChangeTarget(null)}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirmar cambio de rol</DialogTitle>
          </DialogHeader>
          <p>
            ¿Seguro que deseas cambiar el rol de{" "}
            <strong>
              {roleChangeTarget?.user.name} {roleChangeTarget?.user.lastName}
            </strong>{" "}
            a <strong>{roleChangeTarget?.newRole}</strong>?
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRoleChangeTarget(null)}>Cancelar</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={confirmRoleChange}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal confirmación eliminación */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p>
            ¿Seguro que deseas eliminar al usuario{" "}
            <strong>
              {deleteTarget?.name} {deleteTarget?.lastName}
            </strong>{" "}
            ({deleteTarget?.email})?
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Users;

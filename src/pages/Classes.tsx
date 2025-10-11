// src/pages/Classes.tsx
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  createSubject,
  listSubjects,
  deleteSubject,
  updateSubject,
  Subject,
} from "@/services/subjects";
import { listUsers, User } from "@/services/users";

const Classes = () => {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [updateTarget, setUpdateTarget] = useState<{ subjectId: string; professorId: string } | null>(null);

  const [form, setForm] = useState<{ subject: string; category: string; description: string; professorId: string }>({
    subject: "",
    category: "",
    description: "",
    professorId: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const subs = await listSubjects();
      setSubjects(subs || []);

      const t = await listUsers({ role: "teacher" });
      const teachersList = "users" in t ? (t as any).users : (t as any);
      setTeachers(teachersList);
    } catch (e: any) {
      toast.error(e?.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!form.subject || !form.category || !form.description || !form.professorId) {
      toast.error("Complete todos los campos (incluyendo profesor)");
      return;
    }
    try {
      const created = await createSubject(form);
      toast.success("Clase creada");
      setSubjects((s) => [created, ...s]);
      setForm({ subject: "", category: "", description: "", professorId: "" });
    } catch (e: any) {
      toast.error(e?.message || "Error creando clase");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSubject(deleteTarget);
      setSubjects((s) => s.filter((c) => c.id !== deleteTarget && c._id !== deleteTarget));
      toast.success("Clase eliminada");
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e?.message || "Error eliminando clase");
    }
  };

  const confirmUpdateProfessor = async () => {
    if (!updateTarget) return;
    try {
      const updated = await updateSubject(updateTarget.subjectId, {
        professorId: updateTarget.professorId,
      });
      setSubjects((prev) =>
        prev.map((s) =>
          s._id === updateTarget.subjectId || s.id === updateTarget.subjectId ? updated : s
        )
      );
      toast.success("Profesor actualizado");
      setEditing(null);
      setUpdateTarget(null);
    } catch (e: any) {
      toast.error(e?.message || "Error actualizando profesor");
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar />
      <SidebarInset className="bg-gray-900 text-white min-h-screen">
        <Header />
        <div className="p-6 space-y-6">
          {/* Formulario para crear clases */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader><CardTitle>Crea una Clase</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="md:col-span-2">
                <Label>Título</Label>
                <Input className="bg-gray-700 border-gray-600" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Categoría</Label>
                <Input className="bg-gray-700 border-gray-600" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Profesor</Label>
                <Select value={form.professorId} onValueChange={(v) => setForm({ ...form, professorId: v })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600"><SelectValue placeholder="Seleccione profesor" /></SelectTrigger>
                  <SelectContent>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name} {t.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-6">
                <Label>Descripción</Label>
                <Input className="bg-gray-700 border-gray-600" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="md:col-span-6 flex justify-end">
                <Button onClick={handleCreate} disabled={loading} className="bg-purple-600 hover:bg-purple-700">Crear</Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de clases */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader><CardTitle>Todas las Clases</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {subjects.map((s) => (
                  <div key={s.id || s._id} className="p-4 rounded-xl bg-gray-900 border border-gray-700 space-y-2">
                    <div className="font-semibold">{s.subject}</div>
                    <div className="text-sm text-gray-300">{s.category} • {s.numberOfClasses} sesiones</div>
                    <div className="text-sm text-gray-400">{s.description}</div>

                    {/* Profesor */}
                    {editing === (s._id || s.id) ? (
                      <div className="flex items-center space-x-2">
                        <Select
                          defaultValue={s.professor?._id || s.professor?.id || ""}
                          onValueChange={(v) =>
                            setUpdateTarget({ subjectId: s._id || s.id!, professorId: v })
                          }
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Seleccione profesor" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.name} {t.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button size="sm" onClick={() => setEditing(null)} className="bg-gray-600">
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-300">
                        Profesor: {s.professor?.name} {s.professor?.lastName || ""}
                      </div>
                    )}

                    <div className="flex justify-between pt-2">
                      <Button onClick={() => setEditing(s._id || s.id!)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Editar Profesor
                      </Button>
                      <Button onClick={() => setDeleteTarget(s.id || s._id)} variant="destructive" size="sm">
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
                {subjects.length === 0 && <div className="text-gray-400">No hay clases registradas.</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Modal Confirmación Eliminar */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de eliminar esta clase? Esta acción no se puede deshacer.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Confirmación Cambio de Profesor */}
      <Dialog open={!!updateTarget} onOpenChange={() => setUpdateTarget(null)}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirmar cambio de profesor</DialogTitle>
          </DialogHeader>
          <p>
            ¿Seguro que deseas cambiar el profesor de esta clase a{" "}
            <strong>
              {teachers.find((t) => t.id === updateTarget?.professorId)?.name}{" "}
              {teachers.find((t) => t.id === updateTarget?.professorId)?.lastName}
            </strong>
            ?
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUpdateTarget(null)}>Cancelar</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={confirmUpdateProfessor}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Classes;

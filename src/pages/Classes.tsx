// src/pages/Classes.tsx
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createSubject, listSubjects, deleteSubject, updateSubject, Subject } from "@/services/subjects";
import { listUsers, User } from "@/services/users";

const Classes = () => {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [editing, setEditing] = useState<string | null>(null); // id de la clase que se está editando
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
      toast.error(e?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!form.subject || !form.category || !form.description || !form.professorId) {
      toast.error("Complete all fields (including professor)");
      return;
    }
    try {
      const created = await createSubject(form);
      toast.success("Class created");
      setSubjects((s) => [created, ...s]);
      setForm({ subject: "", category: "", description: "", professorId: "" });
    } catch (e: any) {
      toast.error(e?.message || "Error creating class");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this class?")) return;
    try {
      await deleteSubject(id);
      setSubjects((s) => s.filter((c) => c.id !== id && c._id !== id));
      toast.success("Class deleted");
    } catch (e: any) {
      toast.error(e?.message || "Error deleting class");
    }
  };

  const handleUpdateProfessor = async (subjectId: string, newProfessorId: string) => {
    try {
      const updated = await updateSubject(subjectId, { professorId: newProfessorId });
      setSubjects((prev) =>
        prev.map((s) => (s._id === subjectId || s.id === subjectId ? updated : s))
      );
      toast.success("Professor updated");
      setEditing(null);
    } catch (e: any) {
      toast.error(e?.message || "Error updating professor");
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
            <CardHeader><CardTitle>Create Class</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="md:col-span-2">
                <Label>Title</Label>
                <Input className="bg-gray-700 border-gray-600" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Category</Label>
                <Input className="bg-gray-700 border-gray-600" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Professor</Label>
                <Select value={form.professorId} onValueChange={(v) => setForm({ ...form, professorId: v })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600"><SelectValue placeholder="Select professor" /></SelectTrigger>
                  <SelectContent>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name} {t.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-6">
                <Label>Description</Label>
                <Input className="bg-gray-700 border-gray-600" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="md:col-span-6 flex justify-end">
                <Button onClick={handleCreate} disabled={loading} className="bg-purple-600 hover:bg-purple-700">Create</Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de clases */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader><CardTitle>All Classes</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {subjects.map((s) => (
                  <div key={s.id || s._id} className="p-4 rounded-xl bg-gray-900 border border-gray-700 space-y-2">
                    <div className="font-semibold">{s.subject}</div>
                    <div className="text-sm text-gray-300">{s.category} • {s.numberOfClasses} sessions</div>
                    <div className="text-sm text-gray-400">{s.description}</div>

                    {/* Profesor */}
                    {editing === (s._id || s.id) ? (
                      <div className="flex items-center space-x-2">
                        <Select
                          defaultValue={s.professor?._id || s.professor?.id || ""}
                          onValueChange={(v) => handleUpdateProfessor(s._id || s.id!, v)}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Select professor" />
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
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-300">
                        Professor: {s.professor?.name} {s.professor?.lastName || ""}
                      </div>
                    )}

                    <div className="flex justify-between pt-2">
                      <Button onClick={() => setEditing(s._id || s.id!)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Edit Professor
                      </Button>
                      <Button onClick={() => handleDelete(s.id || s._id)} variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {subjects.length === 0 && <div className="text-gray-400">No classes found.</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Classes;

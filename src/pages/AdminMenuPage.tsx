import { useEffect, useState } from "react";
import { menuAPI } from "@/services/api";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

const emptyForm = { name: "", description: "", price: "", image: "" };

const AdminMenuPage = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchItems = () => {
    setLoading(true);
    menuAPI.getAll()
      .then((res) => setItems(res.data.items || res.data))
      .catch(() => toast.error("Failed to load menu"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (item: MenuItem) => {
    setForm({ name: item.name, description: item.description, price: String(item.price), image: item.image || "" });
    setEditId(item._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) { toast.error("Name and price required"); return; }
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), description: form.description.trim(), price: parseFloat(form.price), image: form.image.trim() };
      if (editId) {
        await menuAPI.update(editId, payload);
        toast.success("Item updated");
      } else {
        await menuAPI.create(payload);
        toast.success("Item added");
      }
      setShowForm(false);
      fetchItems();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await menuAPI.delete(deleteTarget);
      setItems((p) => p.filter((i) => i._id !== deleteTarget));
      toast.success("Item deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteTarget(null);
    }
  };

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-foreground">Manage Menu</h1>
        <button onClick={openAdd} className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-border bg-card p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">{editId ? "Edit Item" : "New Item"}</h2>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Name</label>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Price ($)</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Description</label>
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Image URL</label>
              <input value={form.image} onChange={(e) => update("image", e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {saving ? "Saving..." : editId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {loading ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No menu items yet</td></tr>
            ) : items.map((item) => (
              <tr key={item._id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">${item.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="mr-2 text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4 inline" /></button>
                  <button onClick={() => setDeleteTarget(item._id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Item"
        message="Are you sure? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminMenuPage;

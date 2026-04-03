import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Save, Loader2 } from 'lucide-react';
import { useCategories, Category, Subcategory } from '../context/CategoryContext';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryManagerModal({ isOpen, onClose }: CategoryManagerModalProps) {
  const { categories, saveCategories } = useCategories();
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingSubcatId, setEditingSubcatId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newSubcatNames, setNewSubcatNames] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalCategories(categories);
      setSaveSuccess(false);
    }
  }, [isOpen, categories]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await saveCategories(localCategories);
      setSaveSuccess(true);
      // Wait a bit to show success before closing
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error saving categories:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: Date.now().toString(),
      name: newCatName.trim(),
      subcategories: []
    };
    setLocalCategories([...localCategories, newCat]);
    setNewCatName('');
  };

  const deleteCategory = (id: string) => {
    setLocalCategories(localCategories.filter(c => c.id !== id));
  };

  const startEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditName(cat.name);
  };

  const saveEditCategory = (id: string) => {
    setLocalCategories(localCategories.map(c => 
      c.id === id ? { ...c, name: editName.trim() } : c
    ));
    setEditingCatId(null);
  };

  const addSubcategory = (catId: string) => {
    const subName = newSubcatNames[catId]?.trim();
    if (!subName) return;
    
    setLocalCategories(localCategories.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          subcategories: [...c.subcategories, { id: Date.now().toString(), name: subName }]
        };
      }
      return c;
    }));
    setNewSubcatNames({ ...newSubcatNames, [catId]: '' });
  };

  const deleteSubcategory = (catId: string, subId: string) => {
    setLocalCategories(localCategories.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          subcategories: c.subcategories.filter(s => s.id !== subId)
        };
      }
      return c;
    }));
  };

  const startEditSubcategory = (sub: Subcategory) => {
    setEditingSubcatId(sub.id);
    setEditName(sub.name);
  };

  const saveEditSubcategory = (catId: string, subId: string) => {
    setLocalCategories(localCategories.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          subcategories: c.subcategories.map(s => 
            s.id === subId ? { ...s, name: editName.trim() } : s
          )
        };
      }
      return c;
    }));
    setEditingSubcatId(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-2xl font-serif text-gray-900">Manage Categories</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
          <div className="mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Add Major Category</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g., Men, Women, Kids"
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              />
              <button
                onClick={addCategory}
                className="bg-[#f20c92] text-white px-4 py-2 rounded-lg hover:bg-[#f20c92]/90 transition-colors flex items-center gap-2 active:scale-95 shadow-sm"
              >
                <Plus size={18} /> Add
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {localCategories.map(category => (
              <div key={category.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  {editingCatId === category.id ? (
                    <div className="flex items-center gap-2 flex-1 mr-4">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && saveEditCategory(category.id)}
                      />
                      <button onClick={() => saveEditCategory(category.id)} className="text-green-600 hover:text-green-700 p-1">
                        <Save size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <button onClick={() => startEditCategory(category)} className="text-gray-400 hover:text-primary transition-colors">
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={() => deleteCategory(category.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="space-y-2 mb-4">
                    {category.subcategories.map(sub => (
                      <div key={sub.id} className="flex items-center justify-between bg-gray-50/50 border border-gray-100 rounded-lg px-3 py-2">
                        {editingSubcatId === sub.id ? (
                          <div className="flex items-center gap-2 flex-1 mr-4">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && saveEditSubcategory(category.id, sub.id)}
                            />
                            <button onClick={() => saveEditSubcategory(category.id, sub.id)} className="text-green-600 hover:text-green-700 p-1">
                              <Save size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">{sub.name}</span>
                            <button onClick={() => startEditSubcategory(sub)} className="text-gray-400 hover:text-primary transition-colors">
                              <Edit2 size={12} />
                            </button>
                          </div>
                        )}
                        <button 
                          onClick={() => deleteSubcategory(category.id, sub.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {category.subcategories.length === 0 && (
                      <p className="text-sm text-gray-400 italic">No subcategories yet.</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSubcatNames[category.id] || ''}
                      onChange={(e) => setNewSubcatNames({ ...newSubcatNames, [category.id]: e.target.value })}
                      placeholder="New subcategory..."
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      onKeyDown={(e) => e.key === 'Enter' && addSubcategory(category.id)}
                    />
                    <button
                      onClick={() => addSubcategory(category.id)}
                      className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex-1">
            {saveSuccess && (
              <span className="text-green-600 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                <Save size={18} />
                Changes saved successfully!
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || saveSuccess}
              className="px-6 py-2 bg-[#f20c92] text-white rounded-lg hover:bg-[#f20c92]/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 active:scale-95 shadow-md shadow-[#f20c92]/20 min-w-[140px] justify-center"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : saveSuccess ? (
                'Saved!'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

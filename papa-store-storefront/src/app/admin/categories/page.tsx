'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Category, getAdminCategories, createCategory, updateCategory, deleteCategory } from '@lib/api'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Sortable Category Item Component
function SortableCategoryItem({
  category,
  depth,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddSubcategory,
  onInlineEdit,
  inlineEdit,
  setInlineEdit,
  handleInlineSubmit,
  getTotalProducts,
}: {
  category: Category
  depth: number
  isExpanded: boolean
  onToggleExpand: (id: string) => void
  onEdit: (category: Category) => void
  onDelete: (id: string, name: string) => void
  onAddSubcategory: (parentId: string) => void
  onInlineEdit: (id: string, field: 'name', value: string) => void
  inlineEdit: { id: string; field: 'name'; value: string } | null
  setInlineEdit: (edit: { id: string; field: 'name'; value: string } | null) => void
  handleInlineSubmit: () => void
  getTotalProducts: (category: Category) => number
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const hasChildren = category.children && category.children.length > 0
  const totalProducts = getTotalProducts(category)

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`
          flex items-center gap-3 py-3 px-4 border-b border-gray-100
          hover:bg-blue-50/50 transition-colors group
          ${depth === 0 ? 'bg-white' : 'bg-gray-50/30'}
          ${isDragging ? 'shadow-lg bg-blue-50 rounded-lg' : ''}
        `}
        style={{ paddingLeft: `${1 + depth * 1.5}rem` }}
      >
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
          title="Drag to reorder"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* Expand/Collapse */}
        <button
          onClick={() => onToggleExpand(category.id)}
          className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
            hasChildren ? 'hover:bg-gray-200 text-gray-500' : 'text-transparent'
          }`}
          disabled={!hasChildren}
        >
          {hasChildren && (
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Inline Name Edit */}
            {inlineEdit?.id === category.id && inlineEdit.field === 'name' ? (
              <input
                type="text"
                value={inlineEdit.value}
                onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
                onBlur={handleInlineSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleInlineSubmit()
                  if (e.key === 'Escape') setInlineEdit(null)
                }}
                className="font-semibold text-gray-800 px-2 py-0.5 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <h4
                className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                onClick={() => onInlineEdit(category.id, 'name', category.name)}
                title="Click to edit name"
              >
                {category.name}
              </h4>
            )}

            {/* Actions - next to title */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onAddSubcategory(category.id)}
                className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                title="Add subcategory"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={() => onEdit(category)}
                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                title="Edit details"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(category.id, category.name)}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {depth === 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full ml-1">
                {totalProducts} products
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
            <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
              /{category.handle}
            </span>
            {category.description && (
              <span className="truncate max-w-xs">{category.description}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Drag Overlay Item (shown while dragging)
function DragOverlayItem({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-3 py-3 px-4 bg-blue-100 rounded-lg shadow-xl border-2 border-blue-400">
      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
      </svg>
      <span className="font-semibold text-blue-800">{category.name}</span>
    </div>
  )
}

// Recursive Category List Component
function RecursiveCategoryList({
  categories,
  depth,
  expandedIds,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddSubcategory,
  onInlineEdit,
  inlineEdit,
  setInlineEdit,
  handleInlineSubmit,
  getTotalProducts,
}: {
  categories: Category[]
  depth: number
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
  onEdit: (category: Category) => void
  onDelete: (id: string, name: string) => void
  onAddSubcategory: (parentId: string) => void
  onInlineEdit: (id: string, field: 'name', value: string) => void
  inlineEdit: { id: string; field: 'name'; value: string } | null
  setInlineEdit: (edit: { id: string; field: 'name'; value: string } | null) => void
  handleInlineSubmit: () => void
  getTotalProducts: (category: Category) => number
}) {
  // Different border colors for different depths
  const borderColors = ['border-blue-200', 'border-green-200', 'border-purple-200', 'border-orange-200']
  const borderColor = borderColors[depth % borderColors.length]

  return (
    <SortableContext
      items={categories.map(c => c.id)}
      strategy={verticalListSortingStrategy}
    >
      {categories.map((category) => (
        <div key={category.id}>
          <SortableCategoryItem
            category={category}
            depth={depth}
            isExpanded={expandedIds.has(category.id)}
            onToggleExpand={onToggleExpand}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddSubcategory={onAddSubcategory}
            onInlineEdit={onInlineEdit}
            inlineEdit={inlineEdit}
            setInlineEdit={setInlineEdit}
            handleInlineSubmit={handleInlineSubmit}
            getTotalProducts={getTotalProducts}
          />

          {/* Recursive children */}
          {category.children && category.children.length > 0 && expandedIds.has(category.id) && (
            <div className={`border-l-2 ${borderColor} ml-6`}>
              <RecursiveCategoryList
                categories={category.children}
                depth={depth + 1}
                expandedIds={expandedIds}
                onToggleExpand={onToggleExpand}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddSubcategory={onAddSubcategory}
                onInlineEdit={onInlineEdit}
                inlineEdit={inlineEdit}
                setInlineEdit={setInlineEdit}
                handleInlineSubmit={handleInlineSubmit}
                getTotalProducts={getTotalProducts}
              />
            </div>
          )}
        </div>
      ))}
    </SortableContext>
  )
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [activeId, setActiveId] = useState<string | null>(null)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    description: '',
    thumbnail: '',
    parentId: '',
    sortOrder: '0'
  })
  const [handleManuallyEdited, setHandleManuallyEdited] = useState(false)

  // Generate URL-friendly handle from name
  function generateHandle(name: string): string {
    // Transliterate Bulgarian to Latin
    const bulgarianToLatin: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh',
      'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
      'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
      'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sht', 'ъ': 'a', 'ь': '',
      'ю': 'yu', 'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ж': 'Zh',
      'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
      'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F',
      'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sht', 'Ъ': 'A', 'Ь': '',
      'Ю': 'Yu', 'Я': 'Ya'
    }

    let result = ''
    for (const char of name) {
      result += bulgarianToLatin[char] || char
    }

    return result
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  function handleNameChange(name: string) {
    setFormData(prev => ({
      ...prev,
      name,
      // Only auto-update handle if not manually edited and not editing existing category
      handle: (!handleManuallyEdited && !editingCategory) ? generateHandle(name) : prev.handle
    }))
  }

  function handleHandleChange(handle: string) {
    setHandleManuallyEdited(true)
    setFormData(prev => ({ ...prev, handle }))
  }

  // Inline edit state
  const [inlineEdit, setInlineEdit] = useState<{ id: string; field: 'name'; value: string } | null>(null)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getAdminCategories()
      setCategories(data)
      // Expand all by default
      const allIds = new Set<string>()
      function collectIds(cats: Category[]) {
        cats.forEach(c => {
          if (c.children?.length) {
            allIds.add(c.id)
            collectIds(c.children)
          }
        })
      }
      collectIds(data)
      setExpandedIds(allIds)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function openCreateModal(parentId?: string) {
    setEditingCategory(null)
    setHandleManuallyEdited(false)
    setFormData({
      name: '',
      handle: '',
      description: '',
      thumbnail: '',
      parentId: parentId || '',
      sortOrder: '0'
    })
    setShowModal(true)
  }

  function openEditModal(category: Category) {
    setEditingCategory(category)
    setHandleManuallyEdited(true) // Don't auto-generate when editing
    setFormData({
      name: category.name,
      handle: category.handle,
      description: category.description || '',
      thumbnail: category.thumbnail || '',
      parentId: category.parentId || '',
      sortOrder: category.sortOrder?.toString() || '0'
    })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: formData.name,
          handle: formData.handle || undefined,
          description: formData.description || undefined,
          thumbnail: formData.thumbnail || undefined,
          parentId: formData.parentId || undefined,
          sortOrder: parseInt(formData.sortOrder) || 0
        })
      } else {
        await createCategory({
          name: formData.name,
          handle: formData.handle || undefined,
          description: formData.description || undefined,
          thumbnail: formData.thumbnail || undefined,
          parentId: formData.parentId || undefined,
          sortOrder: parseInt(formData.sortOrder) || 0
        })
      }

      setShowModal(false)
      fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return

    try {
      await deleteCategory(id)
      fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  async function handleInlineSubmit() {
    if (!inlineEdit) return

    try {
      await updateCategory(inlineEdit.id, { [inlineEdit.field]: inlineEdit.value })
      setInlineEdit(null)
      fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update')
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    // Find which list (parent or subcategory) the items belong to
    const activeCategory = findCategoryById(categories, active.id as string)
    const overCategory = findCategoryById(categories, over.id as string)

    if (!activeCategory || !overCategory) return

    // Only allow reordering within the same level (same parent)
    if (activeCategory.parentId !== overCategory.parentId) return

    // Get the list of siblings
    const isTopLevel = !activeCategory.parentId
    let siblings: Category[]
    if (isTopLevel) {
      siblings = categories
    } else {
      const parent = findCategoryById(categories, activeCategory.parentId)
      if (!parent || !parent.children) return
      siblings = parent.children
    }

    const oldIndex = siblings.findIndex(c => c.id === active.id)
    const newIndex = siblings.findIndex(c => c.id === over.id)

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

    // Reorder the array
    const reordered = arrayMove(siblings, oldIndex, newIndex)

    // Optimistic update - update state immediately
    if (isTopLevel) {
      const updatedCategories = reordered.map((cat, index) => ({
        ...cat,
        sortOrder: index
      }))
      setCategories(updatedCategories)
    } else {
      // Recursive function to update children at any depth
      function updateChildrenRecursively(cats: Category[], parentId: string, newChildren: Category[]): Category[] {
        return cats.map(cat => {
          if (cat.id === parentId) {
            return {
              ...cat,
              children: newChildren.map((child, index) => ({
                ...child,
                sortOrder: index
              }))
            }
          }
          if (cat.children && cat.children.length > 0) {
            return {
              ...cat,
              children: updateChildrenRecursively(cat.children, parentId, newChildren)
            }
          }
          return cat
        })
      }

      setCategories(prevCategories =>
        updateChildrenRecursively(prevCategories, activeCategory.parentId!, reordered)
      )
    }

    // Update sort orders in background (non-blocking)
    const minIdx = Math.min(oldIndex, newIndex)
    const maxIdx = Math.max(oldIndex, newIndex)
    const itemsToUpdate = reordered.slice(minIdx, maxIdx + 1)

    // Fire and forget - update in background
    Promise.all(
      itemsToUpdate.map((cat, i) =>
        updateCategory(cat.id, { sortOrder: minIdx + i })
      )
    ).catch(err => {
      setError(err instanceof Error ? err.message : 'Failed to save order')
      fetchCategories() // Revert on error
    })
  }

  function findCategoryById(cats: Category[], id: string): Category | null {
    for (const cat of cats) {
      if (cat.id === id) return cat
      if (cat.children) {
        const found = findCategoryById(cat.children, id)
        if (found) return found
      }
    }
    return null
  }

  function getActiveCategory(): Category | null {
    if (!activeId) return null
    return findCategoryById(categories, activeId)
  }

  function getTotalProducts(category: Category): number {
    let total = category.productCount || 0
    if (category.children) {
      category.children.forEach(child => {
        total += getTotalProducts(child)
      })
    }
    return total
  }

  // Get flat list of categories for parent dropdown
  function flattenCategories(cats: Category[], prefix = '', excludeId?: string): { id: string; name: string }[] {
    const result: { id: string; name: string }[] = []
    for (const cat of cats) {
      if (cat.id !== excludeId) {
        result.push({ id: cat.id, name: prefix + cat.name })
        if (cat.children?.length) {
          result.push(...flattenCategories(cat.children, prefix + '— ', excludeId))
        }
      }
    }
    return result
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500 mt-1">
            Drag and drop to reorder categories
          </p>
        </div>
        <button
          onClick={() => openCreateModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          + New Parent Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-orange-600">{categories.length}</div>
          <div className="text-sm text-gray-500">Parent Categories</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">
            {categories.reduce((sum, c) => sum + (c.children?.length || 0), 0)}
          </div>
          <div className="text-sm text-gray-500">Subcategories</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">
            {categories.reduce((sum, c) => sum + getTotalProducts(c), 0)}
          </div>
          <div className="text-sm text-gray-500">Total Products</div>
        </div>
      </div>

      {/* Categories List with Drag and Drop */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            Category Hierarchy
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
            <span>Drag handle to reorder</span>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">No categories yet</h3>
            <p className="text-gray-500 mb-4">Create your first category to organize products</p>
            <button
              onClick={() => openCreateModal()}
              className="px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Parent Category
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Recursive Category Tree */}
            <RecursiveCategoryList
              categories={categories}
              depth={0}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onAddSubcategory={openCreateModal}
              onInlineEdit={(id, field, value) => setInlineEdit({ id, field, value })}
              inlineEdit={inlineEdit}
              setInlineEdit={setInlineEdit}
              handleInlineSubmit={handleInlineSubmit}
              getTotalProducts={getTotalProducts}
            />

            {/* Drag Overlay */}
            <DragOverlay>
              {activeId && getActiveCategory() ? (
                <DragOverlayItem category={getActiveCategory()!} />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2">Tips for organizing categories:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Drag the ≡ handle to reorder categories</li>
          <li>• Categories can only be reordered within the same level</li>
          <li>• Click on a category name to edit it inline</li>
          <li>• Use the + button to add subcategories</li>
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Играчки"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Handle {!editingCategory && !handleManuallyEdited && <span className="text-gray-400 font-normal">(auto-generated from name)</span>}
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-gray-500 text-sm">
                    /categories/
                  </span>
                  <input
                    type="text"
                    value={formData.handle}
                    onChange={(e) => handleHandleChange(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., toys"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Short description for the mega menu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">None (Top Level)</option>
                  {flattenCategories(categories, '', editingCategory?.id).map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail URL
                  </label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
                >
                  {saving && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

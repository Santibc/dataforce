import { useState, ReactNode } from 'react';

type UseFormHandlingOptions<T> = {
  editForm?: ReactNode;
  createForm?: ReactNode;
  onEdit?: (data: T) => void;
  onCreate?: () => void;
};

/**
 * Handle form hook. This hook exposes isEditing and isCreating, a simple way of 
 * having access to state to conditionally render a form modal.
 * 
 * Also, when editing, you need to have access to the editing data. Suppose
 * we have an array of names
 * 
 * const names = ['Rodrigo', 'Roberto', 'Alejandro', 'Lucas'];
 * 
 * If you want to edit in a form the name you should have access to the content of what
 * you want to edit. With this hook, you would simply do:
 * 
 * edit(names[0]);
 * 
 * And your form now has access to the information you want to edit.
 * 
 * @example const UniversidadForm = () => {
  const { isEditig, isCreating, edit, create, close, editForm, createForm } = useFormHandling({
    editForm: (
      // Your custom edit form JSX here
    ),
    createForm: (
      // Your custom create form JSX here
    ),
    onEdit: (data) => {
      // Handle edit form data here
    },
    onCreate: () => {
      // Handle create form data here
    },
  });

  return (
    <>
      {isEdit && (
        <Modal open={isEdit} onClose={handleClose}>
          {editForm}
        </Modal>
      )}
      {isCreate && (
        <Modal open={isCreate} onClose={handleClose}>
          {createForm}
        </Modal>
      )}
    </>
    );
  };
 * @param options 
 * @returns 
 */

export function useFormHandling<T>(options?: UseFormHandlingOptions<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingData, setEditingData] = useState<T | null>(null);

  const edit = (data: T) => {
    setIsEditing(true);
    setEditingData(data);
    if (options?.onEdit) {
      options.onEdit(data);
    }
  };

  const create = () => {
    setIsCreating(true);
    setEditingData(null);
    if (options?.onCreate) {
      options.onCreate();
    }
  };

  const close = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditingData(null);
  };

  return {
    isEditing,
    isCreating,
    editingData,
    edit,
    create,
    close,
    editForm: options?.editForm,
    createForm: options?.createForm,
  };
}

export default useFormHandling;

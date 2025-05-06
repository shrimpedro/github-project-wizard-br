
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Pencil, Trash2, UserPlus, ShieldCheck, User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  avatar_url: string | null;
  created_at: string | null;
};

const UsersManager = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Falha ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (user: UserProfile) => {
    setCurrentUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user'
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (user: UserProfile) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update user');
      
      const updatedUser = await response.json();
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      setIsEditDialogOpen(false);
      toast.success('Usuário atualizado com sucesso');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Falha ao atualizar usuário');
    }
  };

  const handleDelete = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete user');
      
      setUsers(users.filter(user => user.id !== currentUser.id));
      setIsDeleteDialogOpen(false);
      toast.success('Usuário removido com sucesso');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Falha ao remover usuário');
    }
  };

  const roleIcons = {
    admin: <ShieldCheck className="h-4 w-4 text-red-500" />,
    broker: <UserPlus className="h-4 w-4 text-blue-500" />,
    user: <User className="h-4 w-4 text-gray-500" />
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Gerenciamento de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(5).fill(0).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name || '—'}</TableCell>
                      <TableCell>{user.email || '—'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.role && roleIcons[user.role as keyof typeof roleIcons]}
                          <span className="capitalize">{user.role || 'user'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.created_at 
                          ? new Date(user.created_at).toLocaleDateString('pt-BR')
                          : '—'
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditClick(user)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário aqui. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Perfil
                </Label>
                <Select 
                  value={formData.role} 
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="broker">Corretor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title={`Excluir usuário ${currentUser?.name || ''}`}
      />
    </div>
  );
};

export default UsersManager;


import React, { useState } from 'react';
import { Search, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Property } from '../PropertyCard';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  property?: Property;
  date: Date;
  read: boolean;
}

// Mensagens simuladas para demonstração
const initialMessages: Message[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@example.com',
    phone: '(11) 98765-4321',
    message: 'Olá, gostaria de agendar uma visita para esse apartamento em Pinheiros. Estou disponível no próximo final de semana.',
    property: {
      id: '1',
      title: 'Apartamento em Pinheiros',
      address: 'Pinheiros, São Paulo - SP',
      price: 2500,
      type: 'rent',
      bedrooms: 2,
      bathrooms: 1,
      area: 65,
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
    },
    date: new Date('2023-09-15T14:22:00'),
    read: false
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@example.com',
    phone: '(11) 91234-5678',
    message: 'Boa tarde, tenho interesse na casa em Vila Madalena. Gostaria de saber se o valor é negociável e se aceita financiamento bancário.',
    property: {
      id: '2',
      title: 'Casa em Vila Madalena',
      address: 'Vila Madalena, São Paulo - SP',
      price: 1200000,
      type: 'sale',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
    },
    date: new Date('2023-09-16T09:45:00'),
    read: true
  },
  {
    id: '3',
    name: 'Pedro Santos',
    email: 'pedro.santos@example.com',
    phone: '(11) 99876-5432',
    message: 'Estou interessado no studio na Consolação. Quais são as condições para locação? Preciso de fiador?',
    property: {
      id: '3',
      title: 'Studio na Consolação',
      address: 'Consolação, São Paulo - SP',
      price: 1800,
      type: 'rent',
      bedrooms: 1,
      bathrooms: 1,
      area: 40,
      imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3R1ZGlvJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
    },
    date: new Date('2023-09-17T16:30:00'),
    read: false
  }
];

const MessagesManager = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');

  // Filtrar mensagens com base no termo de pesquisa
  const filteredMessages = messages.filter(message => 
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (message.property?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Visualizar detalhes de uma mensagem
  const handleViewMessage = (message: Message) => {
    // Marcar mensagem como lida
    if (!message.read) {
      setMessages(messages.map(m => 
        m.id === message.id ? { ...m, read: true } : m
      ));
    }
    
    setSelectedMessage(message);
    setIsMessageOpen(true);
  };

  // Abrir diálogo de resposta
  const handleOpenReply = () => {
    setIsReplyOpen(true);
    setIsMessageOpen(false);
  };

  // Enviar resposta
  const handleSendReply = () => {
    // Em uma aplicação real, enviaria a resposta para um servidor
    toast.success('Resposta enviada com sucesso!');
    setIsReplyOpen(false);
    setReplyText('');
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mensagens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar mensagens..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <TableRow 
                      key={message.id}
                      className={!message.read ? 'bg-gray-50' : ''}
                      onClick={() => handleViewMessage(message)}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        {!message.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell>
                        {message.property ? message.property.title : 'Geral'}
                      </TableCell>
                      <TableCell>
                        {new Date(message.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {message.read ? (
                          <Badge variant="outline">Lida</Badge>
                        ) : (
                          <Badge>Nova</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhuma mensagem encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para visualizar a mensagem */}
      {selectedMessage && (
        <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Mensagem de {selectedMessage.name}</DialogTitle>
              <DialogDescription>
                Recebida em {new Date(selectedMessage.date).toLocaleDateString('pt-BR')} às {new Date(selectedMessage.date).toLocaleTimeString('pt-BR')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedMessage.property && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Imóvel Relacionado</h4>
                  <div className="flex gap-3">
                    <img 
                      src={selectedMessage.property.imageUrl} 
                      alt={selectedMessage.property.title}
                      className="h-14 w-14 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium">{selectedMessage.property.title}</p>
                      <p className="text-sm text-gray-500">{selectedMessage.property.address}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium">Mensagem:</h4>
                <p className="bg-gray-50 p-3 rounded-md mt-1">{selectedMessage.message}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Nome:</h4>
                  <p>{selectedMessage.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Email:</h4>
                  <p>{selectedMessage.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Telefone:</h4>
                  <p>{selectedMessage.phone}</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMessageOpen(false)}>
                Fechar
              </Button>
              <Button onClick={handleOpenReply}>
                <MessageSquare className="h-4 w-4 mr-2" /> Responder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog para responder */}
      {selectedMessage && (
        <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Responder para {selectedMessage.name}</DialogTitle>
              <DialogDescription>
                Enviando email para {selectedMessage.email}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Mensagem original:</h4>
                <p className="bg-gray-50 p-3 rounded-md mt-1 text-sm text-gray-600">{selectedMessage.message}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Sua resposta:</h4>
                <Textarea 
                  value={replyText} 
                  onChange={(e) => setReplyText(e.target.value)} 
                  placeholder="Digite sua resposta aqui..."
                  className="min-h-32"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReplyOpen(false)}>Cancelar</Button>
              <Button 
                onClick={handleSendReply}
                disabled={!replyText.trim()}
              >
                Enviar Resposta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MessagesManager;

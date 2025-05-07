
import React, { useState, useEffect } from 'react';
import Dashboard from '../components/admin/Dashboard';
import { Property } from '../components/PropertyCard';

// Demo data
const demoProperties: Property[] = [
  {
    id: '1',
    title: 'Apartamento em Pinheiros',
    address: 'Pinheiros, São Paulo - SP',
    price: 2500,
    type: 'rent',
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    status: 'active',
  },
  {
    id: '2',
    title: 'Casa em Vila Madalena',
    address: 'Vila Madalena, São Paulo - SP',
    price: 1200000,
    type: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    status: 'active',
  },
];

const demoMessages = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    message: 'Olá, tenho interesse no apartamento em Pinheiros.',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@example.com',
    message: 'Gostaria de agendar uma visita à casa em Vila Madalena.',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
];

const demoUsers = [
  { id: 1, name: 'Admin', email: 'admin@exemplo.com' },
  { id: 2, name: 'Corretor', email: 'corretor@exemplo.com' },
];

const AdminDashboardPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Simulating API calls to fetch data
    setTimeout(() => {
      setProperties(demoProperties);
      setMessages(demoMessages);
      setUsers(demoUsers);
    }, 500);
  }, []);

  return <Dashboard properties={properties} messages={messages} users={users} />;
};

export default AdminDashboardPage;

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const Configuracoes = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Configurações</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Gerenciar Usuários */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/configuracoes/usuarios">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Gerenciar Usuários</CardTitle>
                    <CardDescription>
                      Cadastrar, editar e gerenciar usuários do sistema
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Controle de acesso, perfis e permissões de usuários
                </p>
              </CardContent>
            </Link>
          </Card>

          {/* Tabelas de Produtos */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/configuracoes/produtos">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Tabelas de Produtos</CardTitle>
                    <CardDescription>
                      Gerenciar produtos para Multi, VRF e Diárias
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  CRUD de produtos, marcas, modelos e configurações técnicas
                </p>
              </CardContent>
            </Link>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
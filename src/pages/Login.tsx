import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Snowflake, Thermometer } from 'lucide-react';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(usuario, senha);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Erro no login');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <img 
              src="/lovable-uploads/62ef3cac-2a46-4916-8f53-2ff94d9ca0e4.png" 
              alt="Sulfrio Logo" 
              className="h-12 w-12 object-contain"
            />
          </div>
          <h1 className="text-6xl font-bold text-blue-400 mb-4">SULFRIO</h1>
          <p className="text-gray-400 text-xl mb-8">Sistema Avançado de Cálculo HVAC</p>
        </div>

        {/* Login Card */}
        <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Entrar</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="bg-red-900/20 border-red-500/30">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="usuario" className="text-gray-300">Usuário</Label>
                <Input
                  id="usuario"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senha" className="text-gray-300">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Credenciais de teste:</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p><strong className="text-gray-300">Admin:</strong> admin / admin123</p>
                <p><strong className="text-gray-300">Assistente:</strong> assistente / teste123</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Sistema desenvolvido para cálculos precisos de equipamentos HVAC • ©2025 Sulfrioservice.com.br, ltda
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
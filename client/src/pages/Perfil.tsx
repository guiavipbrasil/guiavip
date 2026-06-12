import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, X, MapPin, Heart, DollarSign, User, Camera } from "lucide-react";
import { MetaTags } from "@/components/MetaTags";

interface Preco {
  duracao: string;
  valor: number;
}

interface Caracteristicas {
  altura?: string;
  peso?: string;
  busto?: string;
  olhos?: string;
  cabelo?: string;
  medidas?: string;
  idade?: number;
}

interface Perfil {
  id: number;
  nome: string;
  categoria: "feminina" | "trans";
  cidade: string;
  descricao: string;
  foto_original: string;
  url_amigavel: string;
  precos?: Preco[];
  caracteristicas?: Caracteristicas;
  servicos?: string[];
  galeria_fotos?: string[];
  disponibilidade?: string;
}

export default function Perfil() {
  const { url } = useParams();
  const [, navigate] = useLocation();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Array<{ tipo: 'usuario' | 'assistente', texto: string }>>([]);
  const [inputMensagem, setInputMensagem] = useState("");
  const [fotoAtiva, setFotoAtiva] = useState(0);

  useEffect(() => {
    fetch("/perfis.json")
      .then((res) => res.json())
      .then((data: Perfil[]) => {
        const encontrado = data.find((p) => p.url_amigavel === url);
        if (encontrado) {
          setPerfil(encontrado);
        } else {
          setErro(true);
        }
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar perfil:", err);
        setErro(true);
        setCarregando(false);
      });
  }, [url]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando perfil...</p>
      </div>
    );
  }

  if (erro || !perfil) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Perfil não encontrado.</p>
        <Button onClick={() => navigate("/")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  const handleEnviarMensagem = () => {
    if (!inputMensagem.trim()) return;

    const novasMensagens = [
      ...mensagens,
      { tipo: 'usuario' as const, texto: inputMensagem },
    ];
    setMensagens(novasMensagens);
    setInputMensagem("");

    setTimeout(() => {
      const respostas = [
        `Olá! Sou o Assistente Virtual de ${perfil.nome}. Como posso ajudá-lo?`,
        `${perfil.nome} está disponível em ${perfil.cidade}. Gostaria de saber mais informações?`,
        `Obrigado por entrar em contato! ${perfil.nome} responderá em breve. Posso ajudá-lo com algo mais?`,
        `Temos várias opções de atendimento disponíveis. Qual seria sua preferência?`,
      ];
      const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)];
      setMensagens((prev) => [
        ...prev,
        { tipo: 'assistente' as const, texto: respostaAleatoria },
      ]);
    }, 800);
  };

  const urlCompleta = typeof window !== 'undefined' ? window.location.href : '';
  const imagemCompartilhamento = `/manus-storage/${perfil.foto_original}`;

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title={`${perfil.nome} - Guia VIP Brasil`}
        description={perfil.descricao}
        image={imagemCompartilhamento}
        url={urlCompleta}
        type="article"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container py-4">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda - Foto e Galeria */}
          <div className="lg:col-span-2">
            {/* Foto Principal */}
            <div className="relative overflow-hidden rounded-lg bg-muted mb-4" style={{ aspectRatio: '3/4' }}>
              <img
                src={`/manus-storage/${perfil.foto_original}`}
                alt={perfil.nome}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Galeria de Fotos (se houver) */}
            {perfil.galeria_fotos && perfil.galeria_fotos.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {perfil.galeria_fotos.map((foto, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFotoAtiva(idx + 1)}
                    className={`relative overflow-hidden rounded-lg ${
                      fotoAtiva === idx + 1 ? 'ring-2 ring-accent' : ''
                    }`}
                    style={{ aspectRatio: '1' }}
                  >
                    <img
                      src={`/manus-storage/${foto}`}
                      alt={`Galeria ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Coluna Direita - Informações */}
          <div className="flex flex-col gap-6">
            {/* Categoria */}
            <div>
              <span className="profile-category">
                {perfil.categoria === "feminina" ? "Feminina" : "Trans"}
              </span>
            </div>

            {/* Nome */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {perfil.nome}
              </h1>
              <div className="accent-line mb-4" />
            </div>

            {/* Localização */}
            <div className="bg-card border border-border rounded-lg p-4 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Localização</p>
                <p className="text-lg font-semibold text-foreground">
                  {perfil.cidade}
                </p>
              </div>
            </div>

            {/* Características Físicas */}
            {perfil.caracteristicas && (
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-accent mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Características
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {perfil.caracteristicas.idade && (
                    <div>
                      <p className="text-muted-foreground">Idade</p>
                      <p className="font-semibold text-foreground">{perfil.caracteristicas.idade} anos</p>
                    </div>
                  )}
                  {perfil.caracteristicas.altura && (
                    <div>
                      <p className="text-muted-foreground">Altura</p>
                      <p className="font-semibold text-foreground">{perfil.caracteristicas.altura}</p>
                    </div>
                  )}
                  {perfil.caracteristicas.peso && (
                    <div>
                      <p className="text-muted-foreground">Peso</p>
                      <p className="font-semibold text-foreground">{perfil.caracteristicas.peso}</p>
                    </div>
                  )}
                  {perfil.caracteristicas.busto && (
                    <div>
                      <p className="text-muted-foreground">Busto</p>
                      <p className="font-semibold text-foreground">{perfil.caracteristicas.busto}</p>
                    </div>
                  )}
                  {perfil.caracteristicas.medidas && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Medidas</p>
                      <p className="font-semibold text-foreground">{perfil.caracteristicas.medidas}</p>
                    </div>
                  )}
                  {perfil.caracteristicas.cabelo && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Cabelo</p>
                      <p className="font-semibold text-foreground">{perfil.caracteristicas.cabelo}</p>
                    </div>
                  )}
                  {perfil.caracteristicas.olhos && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Olhos</p>
                      <p className="font-semibold text-foreground">{perfil.caracteristicas.olhos}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tabela de Preços */}
            {perfil.precos && perfil.precos.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-accent mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Tabela de Preços
                </h3>
                <div className="space-y-2">
                  {perfil.precos.map((preco, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-2 border-b border-border last:border-0">
                      <span className="text-sm text-foreground">{preco.duracao}</span>
                      <span className="font-semibold text-accent">R$ {preco.valor.toLocaleString('pt-BR')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Descrição */}
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Sobre</p>
              <p className="text-foreground leading-relaxed">
                {perfil.descricao}
              </p>
            </div>

            {/* Serviços/Diferenciais */}
            {perfil.servicos && perfil.servicos.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-accent mb-3">Serviços & Diferenciais</h3>
                <ul className="space-y-2">
                  {perfil.servicos.map((servico, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                      <Heart className="w-4 h-4 text-accent flex-shrink-0" />
                      {servico}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disponibilidade */}
            {perfil.disponibilidade && (
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-sm text-accent font-semibold mb-1">Disponibilidade</p>
                <p className="text-sm text-foreground">{perfil.disponibilidade}</p>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex flex-col gap-3 mt-auto">
              <Button 
                className="w-full btn-primary"
                onClick={() => setChatAberto(true)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Conversar Agora
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  const texto = `Confira ${perfil.nome} no Guia VIP Brasil`;
                  if (navigator.share) {
                    navigator.share({
                      title: `${perfil.nome} - Guia VIP Brasil`,
                      text: texto,
                      url: urlCompleta,
                    });
                  } else {
                    alert('Compartilhamento não suportado neste navegador');
                  }
                }}
              >
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat com Assistente Virtual */}
      {chatAberto && (
        <div className="fixed bottom-4 right-4 w-96 h-96 bg-card border border-border rounded-lg shadow-lg flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
            <div>
              <h3 className="font-semibold">Assistente Virtual</h3>
              <p className="text-xs opacity-90">Respondendo por {perfil.nome}</p>
            </div>
            <button
              onClick={() => setChatAberto(false)}
              className="hover:bg-primary-foreground/20 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {mensagens.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                <p>Olá! Sou um assistente virtual.</p>
                <p className="mt-2">Como posso ajudá-lo?</p>
              </div>
            )}
            {mensagens.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.tipo === 'usuario'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {msg.texto}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border flex gap-2">
            <input
              type="text"
              value={inputMensagem}
              onChange={(e) => setInputMensagem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensagem()}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              size="sm"
              onClick={handleEnviarMensagem}
              className="px-3"
            >
              Enviar
            </Button>
          </div>
        </div>
      )}

      {!chatAberto && (
        <button
          onClick={() => setChatAberto(true)}
          className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40"
          title="Abrir chat com assistente virtual"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

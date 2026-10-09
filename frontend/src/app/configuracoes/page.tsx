"use client";
import { useRef, useState } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { Icon } from "@/components/entrelinhas/Icons";

export default function Settings() {
  const {demo, connectionIssue, goal, setGoal, theme, setTheme, exportBooks, importBooks, restoreDemo, reconnect, notify, livros} = useLibrary();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error("Selecione um arquivo JSON com até 2 MB.");
      const raw: unknown = JSON.parse(await file.text());
      await importBooks(raw);
    } catch (error) {notify(error instanceof Error ? error.message : "O arquivo não pôde ser importado.");}
    finally {setImporting(false); if (fileRef.current) fileRef.current.value = "";}
  }
  return <div className="settings-page page-enter"><div className="page-intro"><div><span className="eyebrow"><span className="eyebrow-dot"/> PERSONALIZE SUA EXPERIÊNCIA</span><h1>Seu espaço, <em>suas regras.</em></h1><p>Pequenos ajustes para aproveitar melhor cada leitura.</p></div></div>
    <div className="settings-layout"><div className="settings-primary">
      <section className="settings-card"><div className="settings-head"><span className="settings-icon"><Icon name="sun"/></span><div><h2>Aparência</h2><p>Escolha o ambiente que combina com você.</p></div></div><div className="settings-row"><div><strong>Tema da interface</strong><span>Uma estante confortável, de dia ou à noite.</span></div><div className="theme-options"><button className={theme === "light" ? "active" : ""} onClick={() => setTheme("light")} aria-pressed={theme === "light"}><Icon name="sun" size={16}/> Claro</button><button className={theme === "dark" ? "active" : ""} onClick={() => setTheme("dark")} aria-pressed={theme === "dark"}><Icon name="moon" size={16}/> Escuro</button></div></div></section>
      <section className="settings-card"><div className="settings-head"><span className="settings-icon"><Icon name="sparkles"/></span><div><h2>Metas pessoais</h2><p>Trace seu próprio ritmo de leitura.</p></div></div><div className="settings-row"><div><strong>Meta anual de livros</strong><span>Defina quantos livros deseja concluir neste ano.</span></div><div className="goal-input"><button aria-label="Diminuir meta" onClick={() => setGoal(goal-1)}>−</button><input type="number" aria-label="Meta anual" min={1} max={200} value={goal} onChange={e => setGoal(Number(e.target.value))}/><button aria-label="Aumentar meta" onClick={() => setGoal(goal+1)}>+</button></div></div></section>
      <section className="settings-card"><div className="settings-head"><span className="settings-icon"><Icon name="download"/></span><div><h2>Seus dados</h2><p>Seu acervo está nas suas mãos.</p></div></div><div className="settings-row"><div><strong>Exportar biblioteca</strong><span>Baixe seus {livros.length} livros em um arquivo JSON.</span></div><button className="btn btn-secondary" onClick={exportBooks}><Icon name="download" size={17}/> Exportar</button></div><div className="settings-row"><div><strong>Importar biblioteca</strong><span>Adicione livros de um arquivo JSON, sem duplicatas.</span></div><input type="file" ref={fileRef} accept=".json,application/json" onChange={handleFile} className="sr-only" aria-label="Selecionar arquivo JSON"/><button className="btn btn-secondary" disabled={importing} onClick={() => fileRef.current?.click()}><Icon name="upload" size={17}/>{importing ? "Importando..." : "Importar"}</button></div>{demo && <div className="settings-row"><div><strong>Restaurar coleção de exemplo</strong><span>Substitui sua biblioteca de demonstração pelos livros iniciais.</span></div>{confirmReset ? <div className="confirm-row"><button className="btn btn-danger" onClick={() => {restoreDemo(); setConfirmReset(false);}}>Confirmar</button><button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>Cancelar</button></div> : <button className="btn btn-outline" onClick={() => setConfirmReset(true)}><Icon name="refresh" size={16}/> Restaurar</button>}</div>}</section>
    </div><aside className="settings-aside"><div className="settings-info"><span className="settings-info-icon"><Icon name="book" size={28}/></span><h3>Um lugar para suas histórias.</h3><p>O Entrelinhas foi pensado para transformar o hábito de ler em uma experiência pessoal, acolhedora e cheia de significado.</p><div className="settings-info-foot">ENTRELINHAS <span>✳</span> ATELIÊ DE LEITURA</div></div><div className="settings-status"><span className="eyebrow">AMBIENTE ATUAL</span><strong>{demo ? "Modo demonstração" : "Conectado à API"}</strong><p>{connectionIssue ? "Não foi possível conectar à API. A versão de demonstração está ativa com armazenamento no seu navegador." : demo ? "Seus dados são salvos no navegador deste dispositivo. Ideal para explorar o projeto online." : "Os dados são persistidos no servidor Spring Boot configurado."}</p>{connectionIssue && <button className="btn btn-secondary" onClick={() => reconnect()}><Icon name="refresh" size={16}/> Tentar reconectar</button>}</div></aside></div>
  </div>;
}

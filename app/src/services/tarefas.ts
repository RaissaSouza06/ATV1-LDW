import type { Tarefa, TarefaInput } from "@/types/tarefa";

const API_URL = import.meta.env.VITE_API_URL as string;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    let mensagem = `Erro ${res.status}`;
    try {
      const corpo = (await res.json()) as { erro?: string };
      if (corpo.erro) mensagem = corpo.erro;
    } catch {
      // resposta sem corpo JSON
    }
    throw new Error(mensagem);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export const tarefasApi = {
  listar: () => request<Tarefa[]>("/tarefas"),

  criar: (dados: TarefaInput) =>
    request<Tarefa>("/tarefas", {
      method: "POST",
      body: JSON.stringify(dados),
    }),

  atualizar: (id: number, dados: TarefaInput) =>
    request<Tarefa>(`/tarefas/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    }),

  excluir: (id: number) =>
    request<void>(`/tarefas/${id}`, { method: "DELETE" }),
};
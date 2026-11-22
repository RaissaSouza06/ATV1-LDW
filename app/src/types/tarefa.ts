export type Prioridade = "Baixa" | "Média" | "Alta";

export interface Tarefa {
  id: number;
  titulo: string;
  etiqueta: string;
  prioridade: Prioridade;
  status_conclusao: boolean;
  updatedAt?: string;
}

export type TarefaFormDados = Pick<Tarefa, "titulo" | "etiqueta" | "prioridade">;

export type TarefaInput = TarefaFormDados & { status_conclusao: boolean };
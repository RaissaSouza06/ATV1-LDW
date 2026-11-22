import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TarefaFormDialog } from "@/components/TarefaFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { tarefasApi } from "@/services/tarefas";
import type { Prioridade, Tarefa, TarefaFormDados } from "@/types/tarefa";

const prioridadeVariant: Record<
  Prioridade,
  "default" | "secondary" | "destructive"
> = {
  Baixa: "secondary",
  Média: "default",
  Alta: "destructive",
};

function mensagemDeErro(err: unknown, padrao: string): string {
  return err instanceof Error ? err.message : padrao;
}

export function Dashboard() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState<Tarefa | null>(null);
  const [excluindo, setExcluindo] = useState<Tarefa | null>(null);

  // LISTAR (GET)
  useEffect(() => {
    let ativo = true;

    tarefasApi
      .listar()
      .then((dados) => {
        if (ativo) setTarefas(dados);
      })
      .catch((err: unknown) => {
        toast.error(mensagemDeErro(err, "Não foi possível carregar as tarefas."));
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  function abrirNova() {
    setEditando(null);
    setFormAberto(true);
  }

  function abrirEdicao(tarefa: Tarefa) {
    setEditando(tarefa);
    setFormAberto(true);
  }

  // CRIAR (POST) e ATUALIZAR (PUT)
  async function handleSalvar(dados: TarefaFormDados) {
    try {
      if (editando) {
        const atualizada = await tarefasApi.atualizar(editando.id, {
          ...dados,
          status_conclusao: editando.status_conclusao,
        });
        setTarefas((prev) =>
          prev.map((t) => (t.id === atualizada.id ? atualizada : t)),
        );
        toast.success("Tarefa atualizada com sucesso!");
      } else {
        const nova = await tarefasApi.criar({ ...dados, status_conclusao: false });
        setTarefas((prev) => [...prev, nova]);
        toast.success("Tarefa criada com sucesso!");
      }
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao salvar a tarefa."));
      throw err; // mantém o modal aberto
    }
  }

  // ATUALIZAR (PUT) - concluir / reabrir
  async function alternarConclusao(tarefa: Tarefa) {
    try {
      const atualizada = await tarefasApi.atualizar(tarefa.id, {
        titulo: tarefa.titulo,
        etiqueta: tarefa.etiqueta,
        prioridade: tarefa.prioridade,
        status_conclusao: !tarefa.status_conclusao,
      });
      setTarefas((prev) =>
        prev.map((t) => (t.id === atualizada.id ? atualizada : t)),
      );
      toast.success(
        atualizada.status_conclusao
          ? "Tarefa marcada como concluída!"
          : "Tarefa reaberta!",
      );
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao atualizar a tarefa."));
    }
  }

  // EXCLUIR (DELETE)
  async function confirmarExclusao() {
    if (!excluindo) return;
    try {
      await tarefasApi.excluir(excluindo.id);
      setTarefas((prev) => prev.filter((t) => t.id !== excluindo.id));
      toast.success("Tarefa excluída com sucesso!");
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao excluir a tarefa."));
    } finally {
      setExcluindo(null);
    }
  }

  const ordenadas = [...tarefas].sort((a, b) => a.id - b.id);
  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => t.status_conclusao).length;
  const pendentes = total - concluidas;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Minhas tarefas</h1>
        <Button onClick={abrirNova}>+ Nova tarefa</Button>
      </div>

      {/* Contadores */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-3xl">{total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pendentes</CardDescription>
            <CardTitle className="text-3xl">{pendentes}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Concluídas</CardDescription>
            <CardTitle className="text-3xl">{concluidas}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Estado de carregamento */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      )}

      {/* Estado vazio */}
      {!loading && tarefas.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Nenhuma tarefa cadastrada ainda. Clique em "Nova tarefa" para
            começar!
          </CardContent>
        </Card>
      )}

      {/* Lista */}
      {!loading && tarefas.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ordenadas.map((tarefa) => (
            <Card key={tarefa.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle
                    className={`text-lg ${
                      tarefa.status_conclusao
                        ? "text-muted-foreground line-through"
                        : ""
                    }`}
                  >
                    {tarefa.titulo}
                  </CardTitle>
                  <Badge variant={prioridadeVariant[tarefa.prioridade] ?? "secondary"}>
                    {tarefa.prioridade}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="outline">{tarefa.etiqueta}</Badge>
                  <span>
                    {tarefa.status_conclusao ? "Concluída" : "Pendente"}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex-wrap gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => alternarConclusao(tarefa)}
                >
                  {tarefa.status_conclusao ? "Reabrir" : "Concluir"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => abrirEdicao(tarefa)}
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setExcluindo(tarefa)}
                >
                  Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de criar/editar */}
      {formAberto && (
        <TarefaFormDialog
          onOpenChange={setFormAberto}
          tarefa={editando}
          onSubmit={handleSalvar}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      <Dialog
        open={excluindo !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setExcluindo(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir tarefa?</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir "{excluindo?.titulo}"? Essa ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExcluindo(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarExclusao}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
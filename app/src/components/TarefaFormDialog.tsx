import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Prioridade, Tarefa, TarefaFormDados } from "@/types/tarefa";

interface Props {
  onOpenChange: (open: boolean) => void;
  tarefa: Tarefa | null; // null = criando | objeto = editando
  onSubmit: (dados: TarefaFormDados) => Promise<void>;
}

export function TarefaFormDialog({ onOpenChange, tarefa, onSubmit }: Props) {
  const [titulo, setTitulo] = useState(tarefa?.titulo ?? "");
  const [etiqueta, setEtiqueta] = useState(tarefa?.etiqueta ?? "");
  const [prioridade, setPrioridade] = useState<Prioridade>(
    tarefa?.prioridade ?? "Baixa",
  );
  const [salvando, setSalvando] = useState(false);

  function handleTitulo(e: React.ChangeEvent<HTMLInputElement>) {
    setTitulo(e.target.value);
  }

  function handleEtiqueta(e: React.ChangeEvent<HTMLInputElement>) {
    setEtiqueta(e.target.value);
  }

  function handlePrioridade(e: React.ChangeEvent<HTMLSelectElement>) {
    setPrioridade(e.target.value as Prioridade);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSalvando(true);
    try {
      await onSubmit({ titulo, etiqueta, prioridade });
      onOpenChange(false);
    } catch {
      // o toast de erro já é exibido pela página
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tarefa ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
          <DialogDescription>
            Preencha os campos e clique em salvar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={handleTitulo}
              maxLength={150}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="etiqueta">Etiqueta</Label>
            <Input
              id="etiqueta"
              value={etiqueta}
              onChange={handleEtiqueta}
              placeholder="Ex.: Estudo, Trabalho, Casa"
              maxLength={50}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prioridade">Prioridade</Label>
            <select
              id="prioridade"
              value={prioridade}
              onChange={handlePrioridade}
              className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
            >
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
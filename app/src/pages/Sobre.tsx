import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Sobre() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sobre o projeto</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        Aplicação SPA em React, TypeScript e shadcn/ui que consome a API REST de
        tarefas (Express + Sequelize + PostgreSQL), com operações completas de
        CRUD. Projeto da disciplina de Laboratório de Desenvolvimento Web.
      </CardContent>
    </Card>
  );
}
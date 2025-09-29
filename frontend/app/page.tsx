"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, CheckCircle2 } from "lucide-react"

interface Task {
  id: number
  name: string
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [inputValue, setInputValue] = useState("")
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const addTask = async () => {
    await fetch("http://localhost:8080/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: inputValue })
    });
    setNewTask("");
    // reload tasks
    fetch("http://localhost:8080/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  };

 
    const deleteTask = async (id: number) => {
      await fetch(`http://localhost:8080/tasks/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((t) => t.id !== id));
    };    
  


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-md mx-auto mt-8">
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Todo App
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Stay organized and productive</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Add a new task..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border-2 border-border/50 focus:border-primary/50 transition-colors duration-200 bg-background/50"
              />
              <Button
                onClick={addTask}
                size="icon"
                className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No tasks yet. Add one above!</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border/30 hover:shadow-md transition-all duration-200 hover:scale-[1.02] group"
                  >
                    <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                      {task.name}
                    </span>
                    <Button
                      onClick={() => deleteTask(task.id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-110"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {tasks.length > 0 && (
              <div className="text-center pt-2 border-t border-border/30">
                <p className="text-sm font-medium text-primary">
                  {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

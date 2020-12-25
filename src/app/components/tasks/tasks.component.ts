import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  searchText = '';
  editForm = false;
  showForm = false;
  myTask : Task = {
    label:'',
    completed:false
  }
  tasks : Task[] =[];
  resultTasks : Task[] =[];
  constructor(private taskservice: TaskService) { }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(){
    this.taskservice.findAll()
      .subscribe(tasks => {
        this.resultTasks =this.tasks=tasks
      })
  }

  deleteTask(id){
    this.taskservice.delete(id)
        .subscribe(() => {
          this.tasks = this.tasks.filter(task => task.id != id)
        })
  }

  persistTask(){
    this.taskservice.persist(this.myTask)
      .subscribe((task) => {
        
        this.tasks = [task,...this.tasks];
        this.resetTask();
        this.showForm =false;
      })
  }

  resetTask(){
    this.myTask = {
      label:'',
      completed:false
    }
  }
  toggleCompleted(task){
    this.taskservice.completed(task.id,task.completed)
      .subscribe(() =>{
        task.completed = !task.completed
      })
  }
  editTask(task){
    this.showForm = true;
    this.myTask = task
    this.editForm = true
  }
  updateTask(){
    this.taskservice.update(this.myTask)
        .subscribe(task => {
          this.resetTask();
          this.editForm =false;
          this.showForm=false
        })
  }

  search(){
    this.resultTasks = this.tasks.filter((task)=> task.label.toLowerCase().includes(this.searchText.toLowerCase()))
  }
}

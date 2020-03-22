import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import * as moment from 'moment';

export interface Task {
  id?: string
  title: string
  date?: string
}


interface CreateResponse{
  name: string

}


@Injectable({providedIn: 'root'})
export class TasksService{
  static  url = 'https://angular-practice-maks.firebaseio.com/tasks'

  constructor(private http: HttpClient) {
  }

  load(date: moment.Moment): Observable<Task[]>{
    return this.http
      .get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(tasks=>{
        if (!tasks){
          return[]
        }
        return Object.keys(tasks).map(key => ({...tasks[key], id:key}))
      }))
  }

  create(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${TasksService.url}/${task.date}.json` , task)
      .pipe(map(res => {
        console.log('Response:', res)
        return {...task, id: res.name}
      }))
  }
  remove(task: Task){
    return this.http
      .delete<void >(`${TasksService.url}/${task.date}/${task.id}.json`)
  }
}

import { Injectable } from '@angular/core';
import {IBlog} from '../interfaces/blog.interface';
import {IUser} from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
private arrBlogPost: Array<IBlog> = [{
  id:1, 
  postedBy: 'admin', 
  topic: 'First post', 
  date: 'Mon Jul 27 2020 15:45:32 GMT+0300 (за східноєвропейським літнім часом)',
  message:'Sign up to create your account.'
}]

private arrUsers: Array<IUser> = [{
  id:1,
  username: 'admin',
  email: 'admin@gmail.com',
  password: 'pass'
}]

  constructor() { }
  getBlogPost(): Array<IBlog> {
    return this.arrBlogPost;
  }
  getUser(): Array<IUser>{
    return this.arrUsers;
  }
  addBlogPost(post: IBlog): void {
    this.arrBlogPost.push(post);
  }
  addUser(user:IUser): void{
    this.arrUsers.push(user);
  }
  deleteBlogPost(id: number): void {
    const index = this.arrBlogPost.findIndex(d => d.id === id);
    this.arrBlogPost.splice(index, 1);
  }
  updateBlogPost(discount: IBlog): void {
    const index = this.arrBlogPost.findIndex(d => d.id === discount.id);
    this.arrBlogPost.splice(index, 1, discount);
  }


  
}

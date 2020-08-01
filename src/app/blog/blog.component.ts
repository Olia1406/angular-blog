import { Component, OnInit, TemplateRef } from '@angular/core';
import { IBlog } from 'src/app/shared/interfaces/blog.interface';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { Blog } from 'src/app/shared/models/blog.model';
import { User } from 'src/app/shared/models/user.model';
import { BlogService } from 'src/app/shared/services/blog.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  providers: []
})
export class BlogComponent implements OnInit {
  currentUserName = 'some';

  logEmail: string;
  logPassword: string;
  // для того, щоб відображалась або форма для реєстрції(з UserName), або форма для логінування (без UserName)
  formNameStatus: boolean;

  users: Array<IUser> = [];
  bUserID: number;
  bUserName: string;
  bEmail: string;
  bPassword: string;

  blogPosts: Array<IBlog> = [];
  bID: number;
  bPostedBy:string;
  bTopic = '';
  bDate ='';
  bMessage = '';
  editStatus = false;
  // для зміни видимості груп кнопок у навбарі
  btnSignStatus = true;
  // для функції добавлення поста або оновлення
  addPostStatus = false;

  modalTitle = 'Add post';
  modalRef: BsModalRef;
  modalRefconfig = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(private bService: BlogService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getBlogPost();
    this.getUser();
  }
  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.modalRefconfig);
  }
  getBlogPost(): void {
    this.blogPosts = this.bService.getBlogPost();
  }
  getUser(): void {
    this.users = this.bService.getUser();
  }
  // для реєстрації при кліку на кн submit; додає в масив юзерів, якщо таких ще немає
  addSubmitedUser() {
    const user = new User(this.bUserID, this.bUserName, this.bEmail, this.bPassword);
    if (!this.users.some(element => element.username == this.bUserName || element.email == this.bEmail) && user.email !== '' && user.username !== '') {
      if (this.users.length > 0) {
        user.id = this.users.slice(-1)[0].id + 1;
      }
      this.bService.addUser(user);
      this.currentUserName = this.bUserName;
      this.modalRef.hide();
      this.btnSignStatus = false;
      this.addPostStatus = true;
    }
    else {
      alert('Such user already exist or maybe you forgot to fill formfields.');
      this.btnSignStatus = true;
    }
  }
  // для логінування при кліку на кн submit; міняє ім'я поточного юзера
  submitLoginedUser() {
    if (this.users.some(element => element.email == this.logEmail && element.password == this.logPassword)) {
      this.currentUserName = this.users.find(element => element.email == this.logEmail).username;
      this.btnSignStatus = false;
      this.addPostStatus = true;
      this.modalRef.hide();
    }
    else {
      alert('Pleace sign up or enter correct email and password!');
      this.btnSignStatus = true;
    }
  }
  // відкриває модалку для добавлення поста
  addPost(template) {
    this.modalTitle = 'Add post';
    this.openModal(template);
    this.editStatus = false;
  }
  // додає або редагує пост в залежності від editStatus
  addBlogPost(): void {
    this.bPostedBy = this.currentUserName;
    const post = new Blog(this.bID, this.bPostedBy, this.bTopic, this.bDate, this.bMessage);
    if (post.topic !== '' && post.message !== '') {
      if (!this.editStatus) {
        if (this.blogPosts.length > 0) {
          post.id = this.blogPosts.slice(-1)[0].id + 1;
        }
        post.date = new Date().toString();
        this.bService.addBlogPost(post);
      }
      else { 
        this.bService.updateBlogPost(post);
        this.editStatus = false;
      }
      this.modalRef.hide();
      this.resetForm();
    }
    else if (post.topic == '' || post.message == '') alert('Pleace fill all fields!');
  }
  closeBlogPostForm() {
    this.modalRef.hide();
    this.resetForm();
  }

  deleteBlogPost(post: IBlog): void {
    if (confirm('Are you sure ?')) {
      this.bService.deleteBlogPost(post.id);
    }
  }
  // заповнює поля форми для поста поточним текстом поста
  editBlogPost(template: TemplateRef<any>, post: IBlog): void {
    this.modalRef = this.modalService.show(template, this.modalRefconfig);
    this.bID = post.id;
    this.bTopic = post.topic;
    this.bMessage = post.message;
    this.editStatus = true;
    this.modalTitle = 'Edit post';
  }

  signIn(template): void {
    this.modalTitle = 'Sign In';
    this.addPostStatus = false;
    this.formNameStatus = false;
    this.resetSignInForm();
    this.openModal(template);
  }

  signUp(template): void {
    this.modalTitle = 'Sign Up';
    this.addPostStatus = false;
    this.resetSignUpForm();
    this.openModal(template);
    this.formNameStatus = true;
  }

  signOut() {
    this.addPostStatus = false;
    this.btnSignStatus = true;
    this.currentUserName = '';
  }

  private resetForm(): void {
    this.bID = 1;
    this.bTopic = '';
    this.bMessage = '';
  }
  private resetSignUpForm() {
    this.bUserID = 1;
    this.bUserName = '';
    this.bEmail = '';
    this.bPassword = '';
  }
  private resetSignInForm() {
    this.logEmail = '';
    this.logPassword = '';
  }



}

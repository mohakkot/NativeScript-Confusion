import { Component, OnInit } from '@angular/core';
import { Page } from 'ui/page';
import { TextField } from "ui/text-field";
import { Slider } from 'ui/slider';
import { Dish } from '../shared/dish';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
    moduleId: module.id,
    templateUrl:'./comment.component.html'
})

export class CommentComponent implements OnInit{

    commentForm: FormGroup;
    dish: Dish;

    constructor(private page:Page, private formBuilder: FormBuilder,
    private params: ModalDialogParams){
        this.commentForm = this.formBuilder.group({
            rating: 5,
            comment:['', Validators.required],  
            author : ['', Validators.required], 
            date: ['', Validators.required]
        });
    }

    ngOnInit(){
        
    }

    onNameChange(args){
        let textfield = <TextField>args.object;
        this.commentForm.patchValue({ author : textfield.text});
    }

    onCommentChange(args){
        let textfield = <TextField>args.object;
        this.commentForm.patchValue({ comment : textfield.text});
    }

    onSliderChange(args){
        let slideval = <Slider>args.object;
        this.commentForm.patchValue({ rating : slideval.value})
    }

    onSubmit(){
        let currentDate: Date = new Date();
        this.commentForm.patchValue({ date : currentDate});
        console.log(JSON.stringify(this.commentForm.value));
        this.params.closeCallback(this.commentForm.value);
    }
}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import 'rxjs/add/operator/map';

@Injectable()
export class FavoriteService{

    favorites: Array<number>;

    constructor(private dishservice: DishService){
        this.favorites = [];

    }

    isFavorite(id: number) {
        return this.favorites.some(el => el === id);
    }

    addFavorite(id: number) {
        if(!this.isFavorite(id)){
            this.favorites.push(id);
        }
        return true;
    }

    getFavorites(): Observable<Dish[]>{
        return this.dishservice.getDishes()
        .map(dishes => dishes.filter(dish => this.favorites.some(el => el===dish.id)));
    }

    deleteFavorite(id: number): Observable<Dish[]>{
        let index = this.favorites.indexOf(id);
        if (index >=0 ){
            this.favorites.splice(index, 1);
            return this.getFavorites();
        }
        else{
            return Observable.throw("Deleting non-existant Favorite");
        }
    }
}
import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'heroes-hero-card',
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {

  @Input()
  hero!: Hero;

  constructor() { }

  ngOnInit(): void {
    if(!this.hero) throw Error('La propiedad Hero es requerida');
  }

}

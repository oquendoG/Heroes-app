import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: `img {
    max-width: 600px;
  } `,
})
export class HeroPageComponent implements OnInit {
  public hero?: Hero;

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getById(id)))
      .subscribe((hero) => {
        if (!hero) return this.router.navigate(['/heroes/list']);

        this.hero = hero;

        return;
      });
  }

  public goBack(): void {
    this.router.navigateByUrl('/heroes/list');
  }
}

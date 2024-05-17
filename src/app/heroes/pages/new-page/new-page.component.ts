import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { filter, switchMap } from 'rxjs';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``,
})
export class NewPageComponent implements OnInit {
  constructor(
    private heroesService: HeroesService,
    private ActivatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;
    this.ActivatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getById(id)))
      .subscribe((hero) => {
        if (!hero) return this.router.navigateByUrl('/');
        this.heroForm.reset(hero);
        return;
      });
  }

  public heroForm: FormGroup = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  public get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  public onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe((hero) => {
        this.showSnackbar(`${hero.superhero} actualizado correctamente!`);
      });

      return;
    }

    this.heroesService.addHero(this.currentHero).subscribe((hero) => {
      this.router.navigate(['/heroes/edit', hero.id]);
      this.showSnackbar(`${hero.superhero} añadido correctamente!`);
    });
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'done', {
      duration: 2500,
    });
  }

  public onDeleteHero(): void {
    if (!this.currentHero.id) throw Error('El id del héroe es requerido');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed().pipe(
      filter((result: boolean) => result),
      switchMap(() => this.heroesService.deleteHerobyId(this.currentHero.id)),
      filter((wasdeleted: boolean) => wasdeleted)
    )
    .subscribe(() => {
      this.router.navigate(['/heroes'])
    })
  }
}

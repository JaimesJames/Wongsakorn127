import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CreditBadgeComponent } from '../../../../share/components/badges/creditBadge/creditBadge.component';
import { InitialLoadingComponent } from '../../../../share/components/loading/initialLoading.component';
import { ConfirmDialogComponent } from '../../../../share/components/dialog/confirmDialog.component';
import { DeckComponent } from '../../components/deck.component';
import { CardInfo, CardValue } from '../../models/kingleegame.model';
import { range } from 'rxjs';
import { initialCardValue } from '../../services/kingleegame.data';

@Component({
  selector: 'app-kingleegame',
  imports: [CommonModule, CreditBadgeComponent, InitialLoadingComponent, ConfirmDialogComponent, DeckComponent],
  templateUrl: './kingleegame.component.html',
  styleUrl: './kingleegame.component.css',
  standalone: true
})
export class KingleegameComponent implements OnInit {

  isLoading: boolean = false;
  isEditMode: boolean = false;

  deck: CardInfo[] = []

  ngOnInit(): void {
    const allCardValues: CardValue[] = [...initialCardValue];
    range(1,10).forEach((number) => {
      allCardValues.push({
        type: "common",
        value: number.toString()
      })
    })
    allCardValues.map(e=>{
      range(0,4).forEach((number)=>{
        this.deck.push({...e, symbolId: number, ruleId:''})
      })
    })
  }


}

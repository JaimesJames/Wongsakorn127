import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CardComponent } from "./card.component";
import { CommonModule } from "@angular/common";
import { CardInfo } from "../models/kingleegame.model";

@Component({
    selector: 'app-deck',
    imports: [CommonModule, CardComponent],
    standalone: true,
    template: `
        <div (click)="continue()" class="relative left-1/2 -translate-x-[130px]" [ngClass]="{'pointer-events-none': isAnimating}">
            <div class="absolute card-mockup-3 transition-all duration-300" [ngClass]="animateToMockupCard3"><app-card [isFront]="false"></app-card></div>
            <div class="absolute card-mockup-2 transition-all duration-300" [ngClass]="animateToMockupCard2"><app-card [isFront]="false"></app-card></div>
            <div class="absolute card-mockup-1 transition-all duration-300" [ngClass]="animateToMockupCard1"><app-card [isFront]="false"></app-card></div>
            <div class="absolute card-clickable transition-all duration-300" [ngClass]="animateToClickableCard"><app-card [detail]="currentCard" [isFront]="isFlip"></app-card></div>
        </div>
    `
})

export class DeckComponent {

    @Input() deck: CardInfo[] = []
    currentCard: CardInfo = {
        symbolId: 0,
        ruleId: "",
        type: "",
        value: ""
    }
    previousCards: CardInfo[] = []

    isFlip: boolean = false
    isAnimating: boolean = false
    animateToClickableCard: string[] = []
    animateToMockupCard1: string[] = ['rotate-z-20']
    animateToMockupCard2: string[] = ['rotate-z-30', 'translate-y-10']
    animateToMockupCard3: string[] = ['opacity-0', 'rotate-z-40', 'translate-y-10']

    image: string = ''

    random () {
        if (this.deck.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.deck.length);
            this.currentCard = this.deck[randomIndex];
            this.previousCards.push(this.deck[randomIndex]);
            this.deck.splice(randomIndex, 1)
          }
    }

    continue () {
        if (this.isFlip) {
            setTimeout(() => {
                this.isAnimating = true
                this.animateToClickableCard = ['translate-y-[100vh]'];
                this.animateToMockupCard1 = ['rotate-z-0'];
                this.animateToMockupCard2 = ['rotate-z-20'];
                this.animateToMockupCard3 = ['opacity-100', 'rotate-z-30', 'translate-y-10'];
            }, 100);
            setTimeout(() => {
                this.isFlip = !this.isFlip
            }, 200);
            setTimeout(() => {
                this.isAnimating = false
                this.animateToClickableCard = ['transition-none'];
                this.animateToMockupCard1 = ['rotate-z-20', 'transition-none'];
                this.animateToMockupCard2 = ['rotate-z-30', 'translate-y-10', 'transition-none'];
                this.animateToMockupCard3 = ['opacity-0', 'rotate-z-40', 'translate-y-10', 'transition-none'];
            }, 1000);
        }
        else{
            this.random ()
            this.isFlip = !this.isFlip
        }
        
    }
}
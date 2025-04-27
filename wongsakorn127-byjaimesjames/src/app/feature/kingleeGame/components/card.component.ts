import { CommonModule } from "@angular/common";
import { Component, input, Input } from "@angular/core";
import { CardInfo, CardValue } from "../models/kingleegame.model";

@Component({
    selector: 'app-card',
    imports: [CommonModule],
    standalone: true,
    template: `
    <div class="perspective-[1000px]">
        <div class="relative w-[260px] h-[370px] rounded-3xl shadow-light transform-3d transition-all duration-300" [ngClass]="{'rotate-y-0': !isFront, 'rotate-y-180': isFront}">
            <div class="absolute w-full h-full rounded-3xl bg-[#A3E598] backface-hidden border-30 border-white"></div>
            <div class="absolute w-full h-full rounded-3xl bg-white rotate-y-180 backface-hidden flex p-8">
                <div *ngIf="detail.type === 'common'" class="flex flex-col h-full">
                    <img [src]="getSymbolPath(detail.symbolId)" [alt]="detail.value">
                </div>
                <div *ngIf="detail.type === 'uncommon'" class="w-full flex flex-col justify-center gap-5">
                <img [src]="getImagePath(detail.value)" [alt]="detail.value" class="w-[200px] m-auto">

                    <h1 class="text-[30px]">{{detail.value}}</h1>
                </div>
                <div *ngIf="detail.type === 'common'" class="w-full flex flex-col justify-center">
                    <h1 class="text-[100px]">{{detail.value}}</h1>
                </div>
                <div *ngIf="detail.type === 'common'" class="flex flex-col h-full justify-end">
                    <img [src]="getSymbolPath(detail.symbolId)" [alt]="detail.value">
                </div>
            </div>
        </div>
    </div>
    `,
})

export class CardComponent {

    @Input() isFront: boolean = false
    @Input() detail: CardInfo = {
        type: "",
        value: "",
        symbolId: 0,
        ruleId: ""
    }

    getImagePath(value: string): string {
        switch (value) {
            case 'King':
                return 'svg/king.svg';
            case 'Queen':
                return 'svg/queen.svg';
            case 'Jack':
                return 'svg/jack.svg';
            default:
                return 'svg/default.svg';
        }
    }

    getSymbolPath(value: number): string {
        switch (value) {
            case 0:
                return 'svg/below.svg';
            case 1:
                return 'svg/above.svg';
            case 2:
                return 'svg/flower.svg';
            case 3:
                return 'svg/rewel.svg';
            default:
                return 'svg/default.svg';
        }
    }
}
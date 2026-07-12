import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BombgameComponent } from './bombgame.component';

describe('BombgameComponent', () => {
  let component: BombgameComponent;
  let fixture: ComponentFixture<BombgameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BombgameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BombgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts on the setup screen', () => {
    expect(component.phase).toBe('setup');
  });

  it('startSetup moves to the handoff screen for player 1', () => {
    component.startSetup();
    expect(component.phase).toBe('handoff');
    expect(component.placingPlayer).toBe(1);
    expect(component.bombs.length).toBe(10);
    expect(component.bombs.every((b) => !b)).toBeTrue();
  });

  describe('placement', () => {
    beforeEach(() => {
      component.startSetup();
      component.confirmHandoff();
    });

    it('toggles a selection on and off', () => {
      component.togglePlacementCell(2);
      expect(component.isSelectedForPlacement(2)).toBeTrue();

      component.togglePlacementCell(2);
      expect(component.isSelectedForPlacement(2)).toBeFalse();
    });

    it('cannot select more than bombsPerPlayer cells', () => {
      component.selectBombsPerPlayer(1);
      component.togglePlacementCell(0);
      component.togglePlacementCell(1); // should be ignored, already have 1

      expect(component.placementSelections).toEqual([0]);
    });

    it('cannot confirm until exactly bombsPerPlayer cells are selected', () => {
      component.selectBombsPerPlayer(2);
      expect(component.canConfirmPlacement()).toBeFalse();

      component.togglePlacementCell(0);
      expect(component.canConfirmPlacement()).toBeFalse();

      component.togglePlacementCell(1);
      expect(component.canConfirmPlacement()).toBeTrue();
    });

    it('after player 1 confirms, moves to handoff for player 2 without revealing bombs', () => {
      component.togglePlacementCell(3);
      component.confirmPlacement();

      expect(component.bombs[3]).toBeTrue();
      expect(component.phase).toBe('handoff');
      expect(component.placingPlayer).toBe(2);
      // Player 2's placement screen must not show player 1's bomb.
      expect(component.placementSelections).toEqual([]);
    });

    it('after player 2 confirms, moves to the eating phase', () => {
      component.togglePlacementCell(3);
      component.confirmPlacement(); // player 1 done

      component.confirmHandoff(); // player 2's placement screen
      component.togglePlacementCell(7);
      component.confirmPlacement(); // player 2 done

      expect(component.phase).toBe('eating');
      expect(component.currentEater).toBe(1);
      expect(component.bombs[3]).toBeTrue();
      expect(component.bombs[7]).toBeTrue();
    });

    it('handles overlapping bomb selections between players without error', () => {
      component.togglePlacementCell(5);
      component.confirmPlacement(); // player 1 bombs cell 5

      component.confirmHandoff();
      component.togglePlacementCell(5); // player 2 also picks cell 5
      component.confirmPlacement();

      expect(component.phase).toBe('eating');
      expect(component.bombs.filter(Boolean).length).toBe(1);
    });
  });

  function placeBombsAndReachEating(p1Bomb: number, p2Bomb: number): void {
    component.selectBombsPerPlayer(1);
    component.startSetup();
    component.confirmHandoff();
    component.togglePlacementCell(p1Bomb);
    component.confirmPlacement();
    component.confirmHandoff();
    component.togglePlacementCell(p2Bomb);
    component.confirmPlacement();
  }

  describe('eating', () => {
    it('revealing a safe cell marks it safe and passes the turn', () => {
      placeBombsAndReachEating(3, 7);

      component.pickCell(0); // safe

      expect(component.revealed[0]).toBe('safe');
      expect(component.currentEater).toBe(2);
      expect(component.phase).toBe('eating');
    });

    it('picking a bomb ends the game, sets the loser, and reveals remaining bombs', () => {
      placeBombsAndReachEating(3, 7);

      component.pickCell(3); // player 1 picks their own bomb

      expect(component.phase).toBe('ended');
      expect(component.loser).toBe(1);
      expect(component.revealed[3]).toBe('bomb');
      expect(component.revealed[7]).toBe('bomb'); // remaining bomb revealed too
    });

    it('ignores clicks on already-revealed cells', () => {
      placeBombsAndReachEating(3, 7);

      component.pickCell(0);
      const eaterAfterFirstPick = component.currentEater;
      component.pickCell(0); // already revealed, should be a no-op

      expect(component.currentEater).toBe(eaterAfterFirstPick);
    });

    it('ignores picks once the game has ended', () => {
      placeBombsAndReachEating(3, 7);
      component.pickCell(3); // ends the game, player 1 loses

      component.pickCell(0);
      expect(component.revealed[0]).toBeNull();
    });

    it('always resolves: picking every safe cell eventually forces a bomb pick', () => {
      placeBombsAndReachEating(3, 7);

      const safeCells = [...Array(10).keys()].filter((i) => i !== 3 && i !== 7);
      for (const cell of safeCells) {
        if (component.phase === 'ended') {
          break;
        }
        component.pickCell(cell);
      }

      // Only the two bomb cells are left unrevealed; the next pick must be a bomb.
      expect(component.phase).toBe('eating');
      component.pickCell(3);
      expect(component.phase).toBe('ended');
      expect(component.loser).not.toBeNull();
    });
  });

  it('playAgain returns to the setup screen', () => {
    placeBombsAndReachEating(3, 7);
    component.pickCell(3);

    component.playAgain();

    expect(component.phase).toBe('setup');
  });
});

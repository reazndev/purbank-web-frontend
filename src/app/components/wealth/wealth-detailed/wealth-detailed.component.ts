import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../shared/services/language.service';
import { KontenService, Konto, KontoMember } from '../../../shared/services/konten.service';
import { UserAuthService } from '../../../shared/services/user-auth.service';
import { CurrencyService } from '../../../shared/services/currency.service';

@Component({
  selector: 'app-wealth-detailed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wealth-detailed.component.html',
  styleUrls: ['./wealth-detailed.component.css'],
})
export class WealthWealthDetailedComponent implements OnInit {
  konten: Konto[] = [];
  provisionalWealth: number = 0;
  currentWealth: number = 0;
  isExpanded: boolean = false;
  showDetailModal: boolean = false;
  selectedKonto: Konto | null = null;
  kontoMembers: KontoMember[] = [];
  loadingMembers: boolean = false;

  newMemberContractNumber: string = '';
  newMemberRole: 'OWNER' | 'MANAGER' | 'VIEWER' = 'VIEWER';
  isInviting: boolean = false;
  inviteError: string | null = null;
  inviteSuccess: string | null = null;

  constructor(
    public languageService: LanguageService,
    private kontenService: KontenService,
    private authService: UserAuthService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.loadKonten();
  }

  loadKonten(): void {
    this.kontenService.getKonten().subscribe({
      next: (data) => {
        this.konten = data;
        this.calculateWealth();
      },
      error: (error) => {
        // Handle error silently
      }
    });
  }

  calculateWealth(): void {
    // Convert all account balances to CHF and sum them
    const accountAmounts = this.konten.map(k => ({
      amount: k.balance,
      currency: k.currency
    }));

    this.currencyService.convertAndSum(accountAmounts, 'CHF').subscribe({
      next: (total) => {
        this.currentWealth = Math.round(total * 100) / 100; // Round to 2 decimal places
        this.provisionalWealth = this.currentWealth; // For now, same as current
      },
      error: (error) => {
        console.error('Failed to calculate wealth:', error);
        // Fallback: just sum CHF accounts
        this.currentWealth = this.konten
          .filter(k => k.currency === 'CHF')
          .reduce((sum, konto) => sum + konto.balance, 0);
        this.provisionalWealth = this.currentWealth;
      }
    });
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  showKontoDetail(konto: Konto): void {
    this.selectedKonto = konto;
    this.showDetailModal = true;
    this.loadKontoMembers(konto.kontoId);
    this.inviteError = null;
    this.inviteSuccess = null;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedKonto = null;
    this.kontoMembers = [];
  }

  loadKontoMembers(kontoId: string): void {
    this.loadingMembers = true;
    this.kontenService.getKontoMembers(kontoId).subscribe({
      next: (members) => {
        this.kontoMembers = members;
        this.loadingMembers = false;
      },
      error: (error) => {
        this.loadingMembers = false;
      }
    });
  }

  isCurrentUser(memberId: string): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.sub === memberId;
  }

  inviteMember(): void {
    if (!this.selectedKonto || !this.newMemberContractNumber) return;

    this.isInviting = true;
    this.inviteError = null;
    this.inviteSuccess = null;

    const request = {
      contractNumber: this.newMemberContractNumber,
      role: this.newMemberRole,
      deviceId: this.authService.getOrCreateDeviceId()
    };

    this.kontenService.inviteMember(this.selectedKonto.kontoId, request).subscribe({
      next: (response) => {
        this.isInviting = false;
        this.inviteSuccess = `Invitation sent! Please approve on your mobile device (Code: ${response.mobileVerify})`;
        this.newMemberContractNumber = '';
      },
      error: (error) => {
        this.isInviting = false;
        this.inviteError = 'Failed to invite member. Please check the contract number.';
      }
    });
  }

  removeMember(memberId: string): void {
    if (!this.selectedKonto) return;

    const memberToRemove = this.kontoMembers.find(m => m.id === memberId);
    const isOwner = memberToRemove?.role === 'OWNER';
    const ownerCount = this.kontoMembers.filter(m => m.role === 'OWNER').length;
    
    const isSelf = this.isCurrentUser(memberId);

    if (isOwner && ownerCount === 1 && isSelf) {
      alert('You are the only owner of this account. You cannot remove yourself. You can only close the account.');
      return;
    }

    const confirmMessage = isSelf 
      ? 'Are you sure you want to leave this account?' 
      : `Are you sure you want to remove ${memberToRemove?.name || 'this member'}?`;

    if (confirm(confirmMessage)) {
      this.kontenService.removeMember(this.selectedKonto.kontoId, memberId).subscribe({
        next: () => {
          if (isSelf) {
            this.closeDetailModal();
            this.loadKonten();
          } else {
            this.loadKontoMembers(this.selectedKonto!.kontoId);
          }
        },
        error: (error) => {
          alert('Failed to remove member.');
        }
      });
    }
  }
}
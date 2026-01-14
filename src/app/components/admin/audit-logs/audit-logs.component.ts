import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AuditLog, AuditLogFilters } from '../../../shared/services/admin.service';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css']
})
export class AuditLogsComponent implements OnInit {
  private adminService = inject(AdminService);
  private languageService = inject(LanguageService);
  translations = computed(() => this.languageService.getTranslations());

  logs: AuditLog[] = [];
  totalElements = 0;
  totalPages = 0;
  isLoading = false;
  error: string | null = null;

  // Pagination only
  page = 0;
  size = 20;

  // Detail Modal
  selectedLog: AuditLog | null = null;
  showDetailModal = false;

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.isLoading = true;
    this.error = null;
    
    const filters: AuditLogFilters = {
      page: this.page,
      size: this.size
    };

    this.adminService.getAuditLogs(filters).subscribe({
      next: (response) => {
        this.logs = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load audit logs';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadLogs();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadLogs();
    }
  }

  viewDetails(log: AuditLog) {
    this.selectedLog = log;
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedLog = null;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'N/A';
    return this.languageService.formatDate(dateStr);
  }
}

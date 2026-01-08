import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AuditLog, AuditLogFilters } from '../../../shared/services/admin.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css']
})
export class AuditLogsComponent implements OnInit {
  private adminService = inject(AdminService);

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
    return new Date(dateStr).toLocaleString('de-CH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }
}

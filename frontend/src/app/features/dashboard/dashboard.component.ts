import { Component, OnInit, OnDestroy, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Estatisticas } from '../../core/models/models';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Visão geral do sistema de gestão de TCCs</p>
    </div>

    @if (loading) {
      <div class="kpi-grid">
        @for (i of [1,2,3,4]; track i) {
          <div class="kpi-card"><div class="skeleton skeleton-card"></div></div>
        }
      </div>
    } @else if (stats) {
      <!-- KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Total de TCCs</div>
          <div class="kpi-value">{{ stats.total_geral }}</div>
          <div class="kpi-icon">📄</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Aprovados</div>
          <div class="kpi-value" style="color: var(--status-aprovado)">{{ stats.por_status['Aprovado'] || 0 }}</div>
          <div class="kpi-icon">✅</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Em Elaboração</div>
          <div class="kpi-value" style="color: var(--status-elaboracao)">{{ stats.por_status['Em Elaboração'] || 0 }}</div>
          <div class="kpi-icon">✏️</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Orientadores Ativos</div>
          <div class="kpi-value">{{ orientadoresCount }}</div>
          <div class="kpi-icon">👨‍🏫</div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="charts-grid">
        <div class="chart-card">
          <div class="card-header">
            <span class="card-title">📊 Status dos TCCs</span>
          </div>
          <canvas #statusChart></canvas>
        </div>

        <div class="chart-card">
          <div class="card-header">
            <span class="card-title">📚 TCCs por Tipo</span>
          </div>
          <canvas #tipoChart></canvas>
        </div>

        <div class="chart-card">
          <div class="card-header">
            <span class="card-title">👨‍🏫 Top Orientadores</span>
          </div>
          <canvas #orientadorChart></canvas>
        </div>

        <div class="chart-card">
          <div class="card-header">
            <span class="card-title">🎓 TCCs por Curso</span>
          </div>
          <canvas #cursoChart></canvas>
        </div>

        <div class="chart-card" style="grid-column: 1/-1">
          <div class="card-header">
            <span class="card-title">📅 TCCs por Semestre</span>
          </div>
          <canvas #semestreChart></canvas>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tipoChart') tipoChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('orientadorChart') orientadorChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cursoChart') cursoChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('semestreChart') semestreChartRef!: ElementRef<HTMLCanvasElement>;

  api = inject(ApiService);
  loading = true;
  stats: Estatisticas | null = null;
  orientadoresCount = 0;

  private charts: Chart[] = [];

  ngOnInit() {
    this.api.getEstatisticas().subscribe({
      next: (data) => {
        this.stats = data;
        this.orientadoresCount = Object.keys(data.por_orientador).length;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  ngAfterViewInit() {}

  ngOnChanges() {}

  // Called after stats loads and view is stable
  ngAfterViewChecked() {
    if (this.stats && !this.chartsBuilt) {
      this.chartsBuilt = true;
      setTimeout(() => this.buildCharts(), 0);
    }
  }

  private chartsBuilt = false;

  private buildCharts() {
    if (!this.stats) return;
    this.charts.forEach(c => c.destroy());
    this.charts = [];

    const palette = ['#4f8ef7','#3fb950','#f0a500','#f85149','#a371f7','#79c0ff','#56d364','#ffa657'];
    const chartDefaults = {
      plugins: { legend: { labels: { color: '#8b949e', font: { family: 'Inter', size: 12 } } } }
    };

    // Status — Donut
    if (this.statusChartRef) {
      const labels = Object.keys(this.stats.por_status);
      const statusColors: Record<string, string> = {
        'Em Elaboração': '#f0a500', 'Enviado': '#58a6ff', 'Aprovado': '#3fb950', 'Reprovado': '#f85149'
      };
      this.charts.push(new Chart(this.statusChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: labels.map(l => this.stats!.por_status[l]),
            backgroundColor: labels.map(l => statusColors[l] || '#4f8ef7'),
            borderColor: '#161b22', borderWidth: 3, hoverOffset: 6
          }]
        },
        options: { ...chartDefaults, cutout: '65%' }
      }));
    }

    // Tipo — Pie
    if (this.tipoChartRef) {
      const labels = Object.keys(this.stats.por_tipo);
      this.charts.push(new Chart(this.tipoChartRef.nativeElement, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data: labels.map(l => this.stats!.por_tipo[l]),
            backgroundColor: palette, borderColor: '#161b22', borderWidth: 2
          }]
        },
        options: { ...chartDefaults }
      }));
    }

    // Orientadores — Bar horizontal
    if (this.orientadorChartRef) {
      const entries = Object.entries(this.stats.por_orientador)
        .sort((a, b) => b[1] - a[1]).slice(0, 8);
      this.charts.push(new Chart(this.orientadorChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: entries.map(([k]) => k.replace('Prof. ', '').replace('Dr. ', '').split(' ').slice(0, 2).join(' ')),
          datasets: [{
            label: 'TCCs',
            data: entries.map(([, v]) => v),
            backgroundColor: 'rgba(79,142,247,0.7)',
            borderColor: '#4f8ef7',
            borderWidth: 1, borderRadius: 6
          }]
        },
        options: {
          ...chartDefaults,
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#8b949e' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#8b949e' }, grid: { display: false } }
          }
        }
      }));
    }

    // Curso — Bar
    if (this.cursoChartRef) {
      const entries = Object.entries(this.stats.por_curso).sort((a, b) => b[1] - a[1]).slice(0, 6);
      this.charts.push(new Chart(this.cursoChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: entries.map(([k]) => k.length > 20 ? k.substring(0, 20) + '…' : k),
          datasets: [{
            label: 'TCCs',
            data: entries.map(([, v]) => v),
            backgroundColor: 'rgba(63,185,80,0.7)',
            borderColor: '#3fb950',
            borderWidth: 1, borderRadius: 6
          }]
        },
        options: {
          ...chartDefaults,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#8b949e' }, grid: { display: false } },
            y: { ticks: { color: '#8b949e' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      }));
    }

    // Semestre — Line
    if (this.semestreChartRef) {
      const entries = Object.entries(this.stats.por_semestre).sort((a, b) => a[0].localeCompare(b[0]));
      this.charts.push(new Chart(this.semestreChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: entries.map(([k]) => k),
          datasets: [{
            label: 'TCCs',
            data: entries.map(([, v]) => v),
            borderColor: '#a371f7',
            backgroundColor: 'rgba(163,113,247,0.15)',
            pointBackgroundColor: '#a371f7',
            pointRadius: 5, tension: 0.4, fill: true
          }]
        },
        options: {
          ...chartDefaults,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#8b949e' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#8b949e' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      }));
    }
  }

  ngOnDestroy() {
    this.charts.forEach(c => c.destroy());
  }
}

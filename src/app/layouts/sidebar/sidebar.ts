import { Component, HostBinding, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PortalLanguage, UiPreferencesService } from '../../core/preferences/ui-preferences.service';

interface SidebarItemCopy { label: string; icon: string; link: string; count?: number; }

type SidebarCopy = {
  workspace: string;
  dashboard: string;
  operations: string;
  dashboardItems: SidebarItemCopy[];
  utilityItems: SidebarItemCopy[];
};

const copy: Record<PortalLanguage, SidebarCopy> = {
  en: {
    workspace: 'WORKSPACE',
    dashboard: 'Dashboard',
    operations: 'OPERATIONS',
    dashboardItems: [
      { label: 'Executive Overview', icon: 'dashboard', link: '/dashboard' },
      { label: 'Member Master Directory', icon: 'group', link: '/citizens', count: 50 },
      { label: 'Analytics & Trends', icon: 'analytics', link: '/analytics' },
      { label: 'District & Block', icon: 'map', link: '/geography' },
      { label: 'Scheme Performance', icon: 'account_balance', link: '/schemes', count: 31 },
      { label: 'Match Workbench', icon: 'hub', link: '/match-workbench', count: 154 },
      { label: 'Fuzzy Match Lab', icon: 'auto_awesome', link: '/fuzzy-match' },
      { label: 'Data Grade Audit', icon: 'fact_check', link: '/data-audit' },
      { label: 'Gap Analysis', icon: 'warning', link: '/gap-analysis' },
      { label: 'Reports', icon: 'description', link: '/reports' },
    ],
    utilityItems: [
      { label: 'Alerts & Exceptions', icon: 'notifications', link: '/alerts' },
      { label: 'Analytics Assistant', icon: 'smart_toy', link: '/assistant' },
      { label: 'Administration', icon: 'admin_panel_settings', link: '/administration' },
    ],
  },
  bn: {
    workspace: 'ওয়ার্কস্পেস',
    dashboard: 'ড্যাশবোর্ড',
    operations: 'অপারেশনস',
    dashboardItems: [
      { label: 'কার্যনির্বাহী সংক্ষিপ্তসার', icon: 'dashboard', link: '/dashboard' },
      { label: 'সদস্য মাস্টার ডিরেক্টরি', icon: 'group', link: '/citizens', count: 50 },
      { label: 'বিশ্লেষণ ও প্রবণতা', icon: 'analytics', link: '/analytics' },
      { label: 'জেলা ও ব্লক', icon: 'map', link: '/geography' },
      { label: 'স্কিম কার্যকারিতা', icon: 'account_balance', link: '/schemes', count: 31 },
      { label: 'ম্যাচ ওয়ার্কবেঞ্চ', icon: 'hub', link: '/match-workbench', count: 154 },
      { label: 'ফাজি ম্যাচ ল্যাব', icon: 'auto_awesome', link: '/fuzzy-match' },
      { label: 'ডেটা গ্রেড অডিট', icon: 'fact_check', link: '/data-audit' },
      { label: 'ফাঁক বিশ্লেষণ', icon: 'warning', link: '/gap-analysis' },
      { label: 'রিপোর্ট', icon: 'description', link: '/reports' },
    ],
    utilityItems: [
      { label: 'সতর্কতা ও ব্যতিক্রম', icon: 'notifications', link: '/alerts' },
      { label: 'অ্যানালিটিক্স সহকারী', icon: 'smart_toy', link: '/assistant' },
      { label: 'প্রশাসন', icon: 'admin_panel_settings', link: '/administration' },
    ],
  },
  hi: {
    workspace: 'वर्कस्पेस',
    dashboard: 'डैशबोर्ड',
    operations: 'ऑपरेशंस',
    dashboardItems: [
      { label: 'कार्यकारी अवलोकन', icon: 'dashboard', link: '/dashboard' },
      { label: 'सदस्य मास्टर डायरेक्टरी', icon: 'group', link: '/citizens', count: 50 },
      { label: 'विश्लेषण और रुझान', icon: 'analytics', link: '/analytics' },
      { label: 'जिला और ब्लॉक', icon: 'map', link: '/geography' },
      { label: 'योजना प्रदर्शन', icon: 'account_balance', link: '/schemes', count: 31 },
      { label: 'मैच वर्कबेंच', icon: 'hub', link: '/match-workbench', count: 154 },
      { label: 'फ़ज़ी मैच लैब', icon: 'auto_awesome', link: '/fuzzy-match' },
      { label: 'डेटा ग्रेड ऑडिट', icon: 'fact_check', link: '/data-audit' },
      { label: 'गैप विश्लेषण', icon: 'warning', link: '/gap-analysis' },
      { label: 'रिपोर्ट', icon: 'description', link: '/reports' },
    ],
    utilityItems: [
      { label: 'अलर्ट और अपवाद', icon: 'notifications', link: '/alerts' },
      { label: 'एनालिटिक्स सहायक', icon: 'smart_toy', link: '/assistant' },
      { label: 'प्रशासन', icon: 'admin_panel_settings', link: '/administration' },
    ],
  },
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private readonly preferences = inject(UiPreferencesService);

  @HostBinding('class.collapsed-host') get collapsedHost(): boolean { return this.collapsed(); }

  readonly collapsed = signal(false);
  readonly dashboardOpen = signal(true);

  readonly labels = computed(() => copy[this.preferences.language()]);

  readonly workspaceLabel = computed(() => this.labels().workspace);
  readonly dashboardLabel = computed(() => this.labels().dashboard);
  readonly operationsLabel = computed(() => this.labels().operations);

  readonly dashboardItems = computed(() => this.labels().dashboardItems);
  readonly utilityItems = computed(() => this.labels().utilityItems);

  toggle(): void { this.collapsed.update((value) => !value); }
  toggleDashboard(): void { if (this.collapsed()) this.collapsed.set(false); else this.dashboardOpen.update((value) => !value); }
}